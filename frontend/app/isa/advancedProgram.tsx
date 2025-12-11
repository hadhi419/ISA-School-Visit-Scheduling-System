import { useFocusEffect } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import axios from 'axios';
import { router } from 'expo-router';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScheduleType, useSchedule } from '../../isa/context/ScheduleContext';

interface CalendarDay {
  date: number;
  month: 'prev' | 'current' | 'next';
  schedule: ScheduleType;
  year: number;
  monthIndex: number;
}

const getNextMonthCalendar = (scheduledEvents?: { [date: number]: ScheduleType }): CalendarDay[] => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const year = nextMonth.getFullYear();
  const month = nextMonth.getMonth();

  const lastDay = new Date(year, month + 1, 0);
  const firstDay = new Date(year, month, 1).getDay();
  const firstDayOfWeek = (firstDay - 1 + 7) % 7;

  const days: CalendarDay[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({
      date: 0,
      month: 'prev',
      schedule: 'NONE',
      year,
      monthIndex: month,
    });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayObj = new Date(year, month, i);
    const isWeekend = dayObj.getDay() === 0 || dayObj.getDay() === 6;
    days.push({
      date: i,
      month: 'current',
      schedule: isWeekend ? 'NONE' : scheduledEvents?.[i] || 'NONE',
      year,
      monthIndex: month,
    });
  }

  while (days.length % 7 !== 0) {
    days.push({
      date: 0,
      month: 'next',
      schedule: 'NONE',
      year,
      monthIndex: month,
    });
  }

  return days;
};

const DayCell: FC<{ day: CalendarDay; onPress?: () => void }> = ({ day, onPress }) => {
  if (day.date === 0) return <View style={styles.dayCell} />;

  const dayObj = new Date(day.year, day.monthIndex, day.date);
  const isWeekend = day.month === 'current' && (dayObj.getDay() === 0 || dayObj.getDay() === 6);

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

const AdvancedProgram: FC = () => {
  const { scheduledEvents, fetchMonthVisits } = useSchedule();
  const [viewMode, setViewMode] = useState<'calendar' | 'card'>('calendar');

  const monthToFetch = useMemo(
    () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleString('default', { month: 'long' }),
    []
  );

  useEffect(() => {
    fetchMonthVisits(monthToFetch);
  }, [fetchMonthVisits, monthToFetch]);

  useFocusEffect(
    useCallback(() => {
      fetchMonthVisits(monthToFetch);
    }, [fetchMonthVisits, monthToFetch])
  );

  const scheduledEventsObj = useMemo(() => {
    return scheduledEvents.reduce((acc, event) => {
      acc[Number(event.date)] = event.duty;
      return acc;
    }, {} as { [date: number]: ScheduleType });
  }, [scheduledEvents]);

  const calendarData = useMemo(() => getNextMonthCalendar(scheduledEventsObj), [scheduledEventsObj]);

  const monthTitle = useMemo(() => {
    const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    return nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, []);

  const unscheduledWeekdays = calendarData.filter(
    d => d.month === 'current' && d.schedule === 'NONE' && ![0, 6].includes(new Date(d.year, d.monthIndex, d.date).getDay())
  ).length;

  const onDayPress = (dayDate: number) => {
    router.push({ pathname: '/isa/dutySelection', params: { date: dayDate.toString(), month: monthToFetch } });
  };

  const saveScheduleToBackend = async () => {
    try {
      const nextMonthName = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleString('default', { month: 'long' });
      const payloadMap = new Map<number, { visit_date: string; month: string; isa_id: number; location_id: number; duty: ScheduleType }>();
      scheduledEvents.forEach(event => {
        const eventMonthName = new Date(new Date().getFullYear(), new Date().getMonth() + 1, Number(event.date)).toLocaleString('default', { month: 'long' });
        if (eventMonthName === nextMonthName) {
          payloadMap.set(Number(event.date), {
            visit_date: event.date,
            month: nextMonthName,
            isa_id: 5,
            location_id: Number(event.location),
            duty: event.duty,
          });
        }
      });
      const uniquePayloads = Array.from(payloadMap.values());
      if (uniquePayloads.length === 0) return alert('No new visits to save.');
      await axios.post('http://172.20.10.2:5000/api/visits', uniquePayloads);
      alert('✅ Schedule saved to the database!');
      fetchMonthVisits(nextMonthName);
    } catch (err) {
      console.error(err);
      alert('Failed to save schedule.');
    }
  };

  const weekDays = ['M','T','W','T','F','S','S'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="arrow-back" type="material" color="#E0E0E0" size={28} onPress={() => router.push("/isa/isaDashboard")} />
          <Text style={styles.headerTitle}>Advanced Program</Text>
          <Pressable onPress={() => setViewMode(viewMode === 'calendar' ? 'card' : 'calendar')}>
            <Icon name={viewMode === 'calendar' ? 'view-list' : 'calendar-today'} type="material" color="#fff" size={28} />
          </Pressable>
        </View>

        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryText}>{monthTitle} Schedule</Text>
            <Text style={styles.submitDate}>Submit by 25th</Text>
          </View>
          <View style={styles.summaryItemRight}>
            <Text style={styles.summaryText}>Scheduled</Text>
            <Text style={styles.summaryValueScheduled}>
              {calendarData.filter(d => d.month === 'current' && d.schedule !== 'NONE').length}
            </Text>
          </View>
        </View>

        {unscheduledWeekdays > 0 && (
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              You have **{unscheduledWeekdays}** weekdays with no scheduled visits. Please complete your schedule.
            </Text>
          </View>
        )}

        {/* Calendar or Card View */}
        {viewMode === 'calendar' ? (
          <View style={styles.calendarContainer}>
            <View style={styles.calendarGrid}>
              {weekDays.map((day, idx) => (
                <Text key={`weekday-${idx}`} style={styles.dayLabel}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {calendarData.map((day, idx) => (
                <DayCell
                  key={`${day.year}-${day.monthIndex}-${day.date}-${day.month}-${idx}`}
                  day={day}
                  onPress={day.date === 0 ? undefined : () => onDayPress(day.date)}
                />
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            data={calendarData.filter(d => d.month === 'current')}
            keyExtractor={(item, idx) => `${item.year}-${item.monthIndex}-${item.date}-${idx}`}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => onDayPress(item.date)}>
                <Text style={styles.cardDate}>Date: {item.date}</Text>
                <Text style={styles.cardDuty}>Duty: {item.schedule}</Text>
              </Pressable>
            )}
          />
        )}

        <Pressable style={[styles.submitButton, { backgroundColor: '#1976D2' }]} onPress={saveScheduleToBackend}>
          <Text style={[styles.submitButtonText, { color: '#fff' }]}>Save</Text>
        </Pressable>

        <Pressable
          style={[
            styles.submitButton,
            {
              backgroundColor: unscheduledWeekdays === 0 ? '#388E3C' : '#A0A0A0',
              opacity: unscheduledWeekdays === 0 ? 1 : 0.6,
            },
          ]}
          disabled={unscheduledWeekdays > 0}
          onPress={async () => {
            const nextMonthName = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleString('default', { month: 'long' });
            try {
              await axios.post('http://172.20.10.2:5000/api/visits/submit', { month: nextMonthName, isa_id: 5 });
              alert('Monthly schedule submitted successfully!');
            } catch (err) {
              console.error(err);
              alert('Failed to submit monthly schedule.');
            }
          }}
        >
          <Text style={[styles.submitButtonText, { color: '#fff' }]}>
            Submit Monthly Schedule
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#1976D2", justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '500', color: '#fff', textAlign: 'center', flex: 1 },
  summaryBar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#dae1eb', padding: 15, margin: 15, borderRadius: 12 },
  summaryItem: { flex: 3, paddingRight: 10 },
  summaryItemRight: { flex: 1, alignItems: 'flex-end' },
  summaryText: { fontSize: 14, color: '#555' },
  submitDate: { fontWeight: '600', color: '#393052', fontSize: 15 },
  summaryValueScheduled: { fontSize: 24, fontWeight: '700', color: '#66BB6A', marginTop: 5 },
  warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0e5a6', padding: 12, marginHorizontal: 15, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#FFC107', marginTop: 10 },
  warningIcon: { fontSize: 20, marginRight: 10 },
  warningText: { flex: 1, fontSize: 14, color: '#000' },
  calendarContainer: { margin: 15, padding: 15, backgroundColor: '#fff', borderRadius: 12, marginTop: 10 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  dayLabel: { width: `${100 / 7}%`, textAlign: 'center', fontWeight: '500', color: '#585757', fontSize: 14, paddingVertical: 5 },
  dayCell: { width: `${100 / 7}%`, alignItems: 'center', justifyContent: 'center', aspectRatio: 1, paddingVertical: 4 },
  dayCircle: { width: 35, height: 35, borderRadius: 17.5, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 15, fontWeight: '600' },
  submitButton: { marginHorizontal: 15, marginTop: 10, padding: 18, borderRadius: 12 },
  submitButtonText: { textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#fff' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardDate: { fontWeight: '600', fontSize: 16, marginBottom: 6 },
  cardDuty: { fontSize: 15 },
});

export default AdvancedProgram;
