import { useAuth } from '@/AuthContext';
import { Icon } from '@rneui/themed';
import { router, useFocusEffect } from 'expo-router';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api/axiosInstance';
import {
  ScheduledEvent,
  ScheduleType,
} from '../../isa/context/ScheduleContext';
import { useLoading } from '../../LoadingContext'; // loading hook

interface CalendarDay {
  id: number;
  date: number;
  month: 'prev' | 'current' | 'next';
  status:
    | 'VISITED'
    | 'IN_PROGRESS'
    | 'DDE_APPROVED'
    | 'DDE_REJECTED'
    | 'ADE_APPROVED'
    | 'ADE_REJECTED'
    | 'NOT_SUBMITTED';
  schedule: ScheduleType;
  year: number;
  monthIndex: number;
  location: string;
}

// Generates a calendar array for the next month
const getCurrentMonthCalendar = (scheduledEvents?: {
  [date: number]: {
    id: number;
    duty: ScheduleType;
    location: string;
    status: ScheduledEvent['status'];
  };
}): CalendarDay[] => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const year = nextMonth.getFullYear();
  const month = nextMonth.getMonth();

  const lastDay = new Date(year, month + 1, 0).getDate();
  const firstDayWeekIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const days: CalendarDay[] = [];

  // Previous month padding
  for (let i = 0; i < firstDayWeekIndex; i++) {
    days.push({
      id: 0,
      date: 0,
      month: 'prev',
      status: 'NOT_SUBMITTED',
      schedule: 'NONE',
      year,
      monthIndex: month,
      location: '',
    });
  }

  // Current month days
  for (let i = 1; i <= lastDay; i++) {
    const dayObj = new Date(year, month, i);
    const event = scheduledEvents?.[i];
    days.push({
      id: event?.id || 0,
      date: i,
      month: 'current',
      status: event?.status || 'NOT_SUBMITTED',
      schedule: event?.duty || 'NONE',
      year,
      monthIndex: month,
      location: event?.location || '',
    });
  }

  // Next month padding
  while (days.length % 7 !== 0) {
    days.push({
      id: 0,
      date: 0,
      month: 'next',
      status: 'IN_PROGRESS',
      schedule: 'NONE',
      year,
      monthIndex: month,
      location: '',
    });
  }

  return days;
};

const DayCell: FC<{ day: CalendarDay; onPress?: () => void }> = ({
  day,
  onPress,
}) => {
  if (day.date === 0) return <View style={styles.dayCell} />;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayObj = new Date(day.year, day.monthIndex, day.date);
  const isWeekend = dayObj.getDay() === 0 || dayObj.getDay() === 6;
  const isHoliday = day.schedule === 'HOLI' || day.schedule === 'PL';
  const isVisited = day.status === 'VISITED';
  const isFutureDate = dayObj > today;
  const isDisabled =
    isHoliday || isVisited || isFutureDate || day.schedule === 'NONE';

  const scheduleColors: Record<
    ScheduleType | 'NONE',
    { border: string; background?: string; text: string }
  > = {
    HNST: { border: '#4C72B0', text: '#464545ff' },
    ADVO: { border: '#FFC107', background: '#FFC107', text: '#333' },
    ExEv: { border: '#66BB6A', text: '#464545ff' },
    Office: { border: '#8E24AA', text: '#464545ff' },
    HOLI: { border: '#e00303ff', text: '#464545ff' },
    PL: { border: '#e00303ff', text: '#464545ff' },
    Parti: { border: '#2494aa', text: '#464545ff' },
    Faci: { border: '#ec7c03', text: '#464545ff' },
    Other: { border: 'rgb(31, 2, 193)', text: '#464545ff' },
    NONE: { border: 'transparent', text: '#464545ff' },
  };

  // ✅ If visited, override bg color to green
  const color = isVisited
    ? { border: '#4CAF50', background: '#4CAF50', text: '#fff' }
    : scheduleColors[day.schedule] || scheduleColors['NONE'];

  return (
    <Pressable
      style={styles.dayCell}
      disabled={isDisabled}
      android_ripple={{ color: '#ccc' }}
      onPress={onPress}
    >
      <View
        style={[
          styles.dayCircle,
          {
            borderColor:
              isFutureDate && !isWeekend
                ? '#e0e0e0'
                : isFutureDate && isWeekend
                  ? 'transparent'
                  : color.border,
            backgroundColor: isFutureDate
              ? '#e0e0e0'
              : isFutureDate && isWeekend
                ? 'transparent'
                : color.background,
            opacity: isDisabled ? 40 : 100,
          },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: isFutureDate ? '#ffffff' : color.text,
            },
          ]}
        >
          {day.date}
        </Text>
      </View>
    </Pressable>
  );
};

const AmmendedProgram: FC = () => {
  const { id, isLoggedIn } = useAuth();
  const { setLoading } = useLoading();
  const [scheduledEvents, setRemoteData] = useState<ScheduledEvent[]>([]);

  useEffect(() => {
    const number = pendingReportsCount;
    //console.log(number);
    if (!isLoggedIn) {
      router.replace('/');
    }
    const fetchData = async () => {
      const minTime = 2000; // ADD
      const start = Date.now(); // ADD
      setLoading(true); // ADD

      try {
        const nextMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toLocaleString('default', { month: 'long' });

        const response = await api.get(`/visits/month/${nextMonth}/${id}`);
        //console.log(response);
        const remoteEvents: ScheduledEvent[] = response.data.visits.map(
          (item: any) => ({
            id: item.id,
            date: item.visit_date.toString(),
            duty: item.duty as ScheduleType,
            location: item.location_name,
            status: item.status as ScheduledEvent['status'],
          })
        );

        //console.log('Fetched amended program data:', remoteEvents);
        setRemoteData(remoteEvents);
      } catch (err) {
        //console.error('Failed to fetch visits', err);
      } finally {
        const elapsed = Date.now() - start; // ADD
        if (elapsed < minTime) {
          // ADD
          await new Promise(
            (
              resolve // ADD
            ) => setTimeout(resolve, minTime - elapsed)
          );
        }
        setLoading(false); // ADD
      }
    };

    fetchData();
  }, [setRemoteData, id, isLoggedIn, setLoading]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const minTime = 300; // ADD
        const start = Date.now(); // ADD
        setLoading(true);

        const nextMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toLocaleString('default', { month: 'long' });

        try {
          const response = await api.get(`/visits/month/${nextMonth}/${id}`);
          const remoteEvents: ScheduledEvent[] = response.data.visits.map(
            (item: any) => ({
              id: item.id,
              date: item.visit_date.toString(),
              duty: item.duty as ScheduleType,
              location: item.location_name,
              status: item.status as ScheduledEvent['status'],
            })
          );

          setRemoteData(remoteEvents);
        } catch (err) {
          //console.error('Failed to fetch visits on focus', err);
        } finally {
          const elapsed = Date.now() - start; // ADD
          if (elapsed < minTime) {
            // ADD
            await new Promise(
              (
                resolve // ADD
              ) => setTimeout(resolve, minTime - elapsed)
            );
          }
          setLoading(false); // ADD
        }
      };

      fetchData();
    }, [id, setLoading])
  );

  //const { id, isLoggedIn } = useAuth();
  const monthToFetch = useMemo(() => {
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toLocaleString('default', { month: 'long' });
  }, []);

  const scheduledEventsObj = useMemo(() => {
    return scheduledEvents.reduce(
      (acc, event) => {
        acc[Number(event.date)] = {
          id: event.id,
          duty: event.duty,
          location: event.location || '',
          status: event.status,
        };
        return acc;
      },
      {} as {
        [date: number]: {
          id: number;
          duty: ScheduleType;
          location: string;
          status: ScheduledEvent['status'];
        };
      }
    );
  }, [scheduledEvents]);

  const calendarData = useMemo(
    () => getCurrentMonthCalendar(scheduledEventsObj),
    [scheduledEventsObj]
  );

  const pendingReportsCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const submittedStatuses: ScheduledEvent['status'][] = ['VISITED'];

    //console.log(calendarData);

    return calendarData.filter((day) => {
      if (day.date === 0) return false; // skip padding
      if (day.schedule === 'NONE') return false; // skip empty days
      if (day.schedule === 'HOLI' || day.schedule === 'PL') return false; // skip holidays

      const dayObj = new Date(day.year, day.monthIndex, day.date);
      dayObj.setHours(0, 0, 0, 0);

      const isSubmitted = submittedStatuses.includes(day.status);
      const isFutureDate = dayObj > today;

      return !isSubmitted && !isFutureDate; // weekends with duties are included
    }).length;
  }, [calendarData]);

  const onDayPress = (
    dayDate: number,
    location: string,
    id: number,
    duty: ScheduleType
  ) => {
    const current_year = new Date().getFullYear();
    //console.log(location);

    router.push({
      pathname: '/isa/submitReport',
      params: {
        id: id,
        year: current_year,
        date: dayDate.toString(),
        month: monthToFetch,
        location: location,
        duty: duty,
      },
    });
  };

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          type="material"
          color="#E0E0E0"
          size={28}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Amended Program</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {pendingReportsCount > 0 && (
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>📄</Text>
            <Text style={styles.warningText}>
              You have{' '}
              <Text style={{ fontWeight: '700' }}>{pendingReportsCount}</Text>{' '}
              report(s to submit up to today.
            </Text>
          </View>
        )}

        <Text style={styles.monthTitle}>{monthToFetch}</Text>

        <View style={styles.calendarContainer}>
          <View style={styles.calendarGrid}>
            {weekDays.map((day, idx) => (
              <Text key={`weekday-${idx}`} style={styles.dayLabel}>
                {day}
              </Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {calendarData.map((day, idx) => (
              <DayCell
                key={`${day.year}-${day.monthIndex}-${day.date}-${idx}`}
                day={day}
                onPress={
                  day.date === 0
                    ? undefined
                    : () =>
                        onDayPress(day.date, day.location, day.id, day.schedule)
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: '0%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  calendarContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 10,
  },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  dayLabel: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontWeight: '500',
    color: '#585757',
    fontSize: 14,
    paddingVertical: 5,
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    paddingVertical: 4,
  },
  dayCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: { fontSize: 15, fontWeight: '600' },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2e5e3',
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#E53935',
    marginTop: '10%',
    marginBottom: '10%',
  },

  warningIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
});

export default AmmendedProgram;
