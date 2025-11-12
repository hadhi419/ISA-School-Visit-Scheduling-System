// AdvancedProgram.tsx
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import { router } from 'expo-router';
import React, { FC, useCallback, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScheduleType, useSchedule } from '../isa/context/ScheduleContext';

interface CalendarDay {
  date: number;
  month: 'prev' | 'current' | 'next';
  schedule: ScheduleType;
  year: number;
  monthIndex: number; // 0-11
}

const getNextMonthCalendar = (scheduledEvents?: { [date: number]: ScheduleType }): CalendarDay[] => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const year = nextMonth.getFullYear();
  const month = nextMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const startWeekDay = (firstDay.getDay() + 6) % 7;

  const days: CalendarDay[] = [];

  // Previous month padding
  for (let i = startWeekDay; i > 0; i--) {
    days.push({
      date: prevMonthLastDay - i + 1,
      month: 'prev',
      schedule: 'NONE',
      year,
      monthIndex: month - 1,
    });
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateObj = new Date(year, month, i);
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    days.push({
      date: i,
      month: 'current',
      schedule: isWeekend ? 'NONE' : scheduledEvents?.[i] || 'NONE',
      year,
      monthIndex: month,
    });
  }

  // Next month padding
  let nextDate = 1;
  while (days.length % 7 !== 0) {
    days.push({
      date: nextDate++,
      month: 'next',
      schedule: 'NONE',
      year,
      monthIndex: month + 1,
    });
  }

  return days;
};

// --- DayCell Component ---
const DayCell: FC<{ day: CalendarDay; onPress?: () => void }> = ({ day, onPress }) => {
  const isCurrentMonth = day.month === 'current';
  const dayObj = new Date(day.year, day.monthIndex, day.date);
  const isWeekend = dayObj.getDay() === 0 || dayObj.getDay() === 6;

  const scheduleColors: Record<ScheduleType | 'NONE', { border: string; background?: string; text: string }> = {
    HNST: { border: '#4C72B0', text: '#E0E0E0' },
    EXAM: { border: '#6A1B9A', text: '#E0E0E0' },
    EVAL: { border: '#66BB6A', text: '#E0E0E0' },
    HOLIDAY: { border: '#EF5350', text: '#E0E0E0' },
    DEV: { border: '#FFC107', background: '#FFC107', text: '#333' },
    NONE: { border: 'transparent', text: isCurrentMonth ? (isWeekend ? '#555' : '#E0E0E0') : '#555' },
  };

  const color = scheduleColors[day.schedule] || scheduleColors['NONE'];

  return (
    <Pressable
      style={styles.dayCell}
      disabled={!isCurrentMonth || isWeekend} // disables weekends & other months
      onPress={() => onPress && onPress()}
    >
      <View
        style={[
          styles.dayCircle,
          {
            borderColor: color.border,
            backgroundColor: color.background || 'transparent',
            opacity: isCurrentMonth ? 1 : 0.5, // faded for other months
          },
        ]}
      >
        <Text style={[styles.dayText, { color: color.text }]}>{day.date}</Text>
      </View>
    </Pressable>
  );
};

// --- Main Component ---
const AdvancedProgram: FC = () => {
  const { scheduledEvents } = useSchedule(); // ScheduledEvent[]

  useFocusEffect(
    useCallback(() => {
      console.log('🔁 AdvancedProgram focused', scheduledEvents);
    }, [scheduledEvents])
  );

  const scheduledEventsObj = scheduledEvents.reduce(
    (acc, event) => {
      acc[Number(event.date)] = event.duty;
      return acc;
    },
    {} as { [date: number]: ScheduleType }
  );

  const calendarData = useMemo(() => getNextMonthCalendar(scheduledEventsObj), [scheduledEvents]);

  const monthTitle = useMemo(() => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, []);

  const unscheduledWeekdays = calendarData.filter(
    d => d.month === 'current' && d.schedule === 'NONE' &&
         ![0, 6].includes(new Date(d.year, d.monthIndex, d.date).getDay())
  ).length;

  const onDayPress = (dayDate: number) => {
    router.push({ pathname: '/isa/dutySelection', params: { date: dayDate.toString() } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="arrow-back" type="material" color="#E0E0E0" size={28} onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Advanced Program</Text>
        </View>

        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryText}>{monthTitle} Schedule</Text>
            <Text style={styles.submitDate}>Submit by 25th</Text>
          </View>
          <View style={styles.summaryItemRight}>
            <Text style={styles.summaryText}>Scheduled</Text>
            <Text style={styles.summaryValueScheduled}>
              {calendarData.filter(d => d.schedule !== 'NONE').length}
            </Text>
          </View>
        </View>

        {unscheduledWeekdays > 0 && (
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              You have {unscheduledWeekdays} weekdays with no scheduled visits. Please complete your schedule.
            </Text>
          </View>
        )}

        <View style={styles.calendarContainer}>
          <View style={styles.calendarGrid}>
            {['M','T','W','T','F','S','S'].map(day => (
              <Text key={day} style={styles.dayLabel}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {calendarData.map((day, idx) => (
              <DayCell key={idx} day={day} onPress={() => onDayPress(day.date)} />
            ))}
          </View>
        </View>

        <Pressable style={styles.submitButton} onPress={() => console.log('Submit Pressed')}>
          <Text style={styles.submitButtonText}>Submit Monthly Schedule</Text>
        </Pressable>

        <View style={styles.footerBranding}>
          <Text style={{ color: '#555', fontSize: 12 }}>Made with <Text style={styles.vLogo}>V</Text></Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '500', color: '#E0E0E0', marginLeft: 15 },
  summaryBar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1E1E1E', padding: 15, margin: 15, borderRadius: 12 },
  summaryItem: { flex: 3, paddingRight: 10 },
  summaryItemRight: { flex: 1, alignItems: 'flex-end' },
  summaryText: { fontSize: 14, color: '#A0A0A0' },
  submitDate: { fontWeight: '600', color: '#E0E0E0', fontSize: 15 },
  summaryValueScheduled: { fontSize: 24, fontWeight: '700', color: '#66BB6A', marginTop: 5 },
  warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#383120', padding: 12, marginHorizontal: 15, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#FFC107', marginTop: 10 },
  warningIcon: { fontSize: 20, marginRight: 10 },
  warningText: { flex: 1, fontSize: 14, color: '#FFC107' },
  calendarContainer: { margin: 15, padding: 15, backgroundColor: '#1E1E1E', borderRadius: 12, marginTop: 10 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  dayLabel: { width: `${100/7}%`, textAlign: 'center', fontWeight: '500', color: '#A0A0A0', fontSize: 14, paddingVertical: 5 },
  dayCell: { width: `${100/7}%`, alignItems: 'center', justifyContent: 'center', aspectRatio: 1, paddingVertical: 4 },
  dayCircle: { width: 35, height: 35, borderRadius: 17.5, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 15, fontWeight: '600' },
  submitButton: { marginHorizontal: 15, marginTop: 30, padding: 18, backgroundColor: '#A0A0A0', borderRadius: 12 },
  submitButtonText: { textAlign: 'center', color: '#333', fontSize: 18, fontWeight: '700' },
  footerBranding: { textAlign: 'center', fontSize: 12, color: '#555', marginTop: 40, paddingBottom: 20 },
  vLogo: { color: '#6A1B9A', fontWeight: 'bold', fontSize: 14 },
});

export default AdvancedProgram;
