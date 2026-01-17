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

  const dayObj = new Date(day.year, day.monthIndex, day.date);
  const isWeekend = dayObj.getDay() === 0 || dayObj.getDay() === 6;
  const isHoliday = day.schedule === 'HOLI';
  const isVisited = day.status === 'VISITED';
  const isDisabled = isWeekend || isHoliday || isVisited;

  const scheduleColors: Record<
    ScheduleType | 'NONE',
    { border: string; background?: string; text: string }
  > = {
    HNST: { border: '#4C72B0', text: '#464545ff' },
    EXAM: { border: '#6A1B9A', text: '#464545ff' },
    EVAL: { border: '#66BB6A', text: '#464545ff' },
    HOLI: { border: '#EF5350', text: '#464545ff' },
    DEV: { border: '#FFC107', background: '#FFC107', text: '#333' },
    NONE: {
      border: 'transparent',
      text: isWeekend ? '#b1aeaeff' : '#464545ff',
    },
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
            borderColor: color.border,
            backgroundColor: color.background || 'transparent',
          },
        ]}
      >
        <Text style={[styles.dayText, { color: color.text }]}>{day.date}</Text>
      </View>
    </Pressable>
  );
};

const AmmendedProgram: FC = () => {
  const [scheduledEvents, setRemoteData] = useState<ScheduledEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const nextMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toLocaleString('default', { month: 'long' });

      const response = await api.get(`/visits/month/${nextMonth}/5`);
      console.log(response);
      const remoteEvents: ScheduledEvent[] = response.data.visits.map(
        (item: any) => ({
          id: item.id,
          date: item.visit_date.toString(),
          duty: item.duty as ScheduleType,
          location: item.location_name,
          status: item.status as ScheduledEvent['status'],
        })
      );

      console.log('Fetched amended program data:', remoteEvents);
      setRemoteData(remoteEvents);
    };

    fetchData();
  }, [setRemoteData]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const nextMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toLocaleString('default', { month: 'long' });

        try {
          const response = await api.get(`/visits/month/${nextMonth}/5`);
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
          console.error('Failed to fetch visits on focus', err);
        }
      };

      fetchData();
    }, [])
  );

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

  const onDayPress = (dayDate: number, location: string, id: number) => {
    const current_year = new Date().getFullYear();
    console.log(location);

    router.push({
      pathname: '/isa/submitReport',
      params: {
        id: id,
        year: current_year,
        date: dayDate.toString(),
        month: monthToFetch,
        location: location,
      },
    });
  };

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                    : () => onDayPress(day.date, day.location, day.id)
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
    marginBottom: '30%',
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
});

export default AmmendedProgram;
