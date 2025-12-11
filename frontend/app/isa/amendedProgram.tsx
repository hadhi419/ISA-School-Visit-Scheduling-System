import { useFocusEffect } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import { router } from 'expo-router';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScheduleType, useSchedule } from '../../isa/context/ScheduleContext';

interface CalendarDay {
  date: number;
  month: 'prev' | 'current' | 'next';
  schedule: ScheduleType;
  year: number;
  monthIndex: number;
}

// Generates a calendar array for the next month
const getCurrentMonthCalendar = (scheduledEvents?: { [date: number]: ScheduleType }): CalendarDay[] => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const year = nextMonth.getFullYear();
  const month = nextMonth.getMonth();

  const lastDay = new Date(year, month + 1, 0).getDate();
  const firstDayWeekIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday=0, Sunday=6

  const days: CalendarDay[] = [];

  // Previous month padding
  for (let i = 0; i < firstDayWeekIndex; i++) {
    days.push({ date: 0, month: 'prev', schedule: 'NONE', year, monthIndex: month });
  }

  // Current month days
  for (let i = 1; i <= lastDay; i++) {
    const dayObj = new Date(year, month, i);
    const isWeekend = dayObj.getDay() === 0 || dayObj.getDay() === 6; // Sunday=0, Saturday=6
    days.push({
      date: i,
      month: 'current',
      schedule: scheduledEvents?.[i] || 'NONE',
      year,
      monthIndex: month,
    });
  }

  // Next month padding
  while (days.length % 7 !== 0) {
    days.push({ date: 0, month: 'next', schedule: 'NONE', year, monthIndex: month });
  }

  return days;
};

const DayCell: FC<{ day: CalendarDay; onPress?: () => void }> = ({ day, onPress }) => {
  if (day.date === 0) return <View style={styles.dayCell} />;

  const dayObj = new Date(day.year, day.monthIndex, day.date);
  const isWeekend = dayObj.getDay() === 0 || dayObj.getDay() === 6;

  const scheduleColors: Record<ScheduleType | 'NONE', { border: string; background?: string; text: string }> = {
    HNST: { border: '#4C72B0', text: '#464545ff' },
    EXAM: { border: '#6A1B9A', text: '#464545ff' },
    EVAL: { border: '#66BB6A', text: '#464545ff' },
    HOLI: { border: '#EF5350', text: '#464545ff' },
    DEV: { border: '#FFC107', background: '#FFC107', text: '#333' },
    NONE: { border: 'transparent', text: isWeekend ? '#b1aeaeff' : '#464545ff' },
  };

  const color = scheduleColors[day.schedule] || scheduleColors['NONE'];

  return (
    <Pressable
      style={styles.dayCell}
      disabled={isWeekend}
      android_ripple={{ color: '#ccc' }}
      onPress={onPress}
    >
      <View style={[styles.dayCircle, { borderColor: color.border, backgroundColor: color.background || 'transparent' }]}>
        <Text style={[styles.dayText, { color: color.text }]}>{day.date}</Text>
      </View>
    </Pressable>
  );
};

const AmmendedProgram: FC = () => {
  const { scheduledEvents, fetchMonthVisitsApproved } = useSchedule();

  const monthToFetch = useMemo(() => {
    return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      .toLocaleString('default', { month: 'long' });
  }, []);

  const scheduledEventsObj = useMemo(() => {
    return scheduledEvents.reduce((acc, event) => {
      acc[Number(event.date)] = event.duty;
      return acc;
    }, {} as { [date: number]: ScheduleType });
  }, [scheduledEvents]);

  const calendarData = useMemo(() => getCurrentMonthCalendar(scheduledEventsObj), [scheduledEventsObj]);

  useEffect(() => {
    fetchMonthVisitsApproved(monthToFetch);
  }, [fetchMonthVisitsApproved, monthToFetch]);

  useFocusEffect(
    useCallback(() => {
      fetchMonthVisitsApproved(monthToFetch);
    }, [fetchMonthVisitsApproved, monthToFetch])
  );

  const onDayPress = (dayDate: number) => {
    router.push({ pathname: '/isa/submitReport', params: { date: dayDate.toString(), month: monthToFetch } });
  };

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="arrow-back" type="material" color="#E0E0E0" size={28} onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Amended Program</Text>
          <View style={{ width: 28 }} />
        </View>

        <Text style={styles.monthTitle}>{monthToFetch}</Text>

        <View style={styles.calendarContainer}>
          <View style={styles.calendarGrid}>
            {weekDays.map((day, idx) => (
              <Text key={`weekday-${idx}`} style={styles.dayLabel}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {calendarData.map((day, idx) => (
              <DayCell
                key={`${day.year}-${day.monthIndex}-${day.date}-${idx}`}
                day={day}
                onPress={day.date === 0 ? undefined : () => onDayPress(day.date)}
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
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#1976D2", justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#333', marginBottom:"30%" },
  headerTitle: { fontSize: 18, fontWeight: '500', color: '#ffffff', textAlign: 'center', flex: 1 },
  monthTitle: { fontSize: 16, fontWeight: '500', color: '#000', textAlign: 'center', flex: 1 },
  calendarContainer: { margin: 15, padding: 15, backgroundColor: '#ffffff', borderRadius: 12, marginTop: 10 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  dayLabel: { width: `${100 / 7}%`, textAlign: 'center', fontWeight: '500', color: '#585757', fontSize: 14, paddingVertical: 5 },
  dayCell: { width: `${100 / 7}%`, alignItems: 'center', justifyContent: 'center', aspectRatio: 1, paddingVertical: 4 },
  dayCircle: { width: 35, height: 35, borderRadius: 17.5, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 15, fontWeight: '600' },
});

export default AmmendedProgram;
