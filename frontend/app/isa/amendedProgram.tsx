// AmendedProgram.tsx
import { Icon } from '@rneui/themed';
import { router } from 'expo-router';
import React, { FC, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScheduleType } from '../isa/context/ScheduleContext'; // Assuming this ScheduleType is available

// Re-using the CalendarDay interface for structure
interface CalendarDay {
  date: number;
  month: 'prev' | 'current' | 'next';
  schedule: ScheduleType;
  year: number;
  monthIndex: number;
  isCompleted: boolean; 
}

// Mock Data for Amended Program 
const mockAmendedEvents: { [date: number]: { duty: ScheduleType; isCompleted: boolean } } = {
  1: { duty: 'HOLIDAY', isCompleted: false }, // Red (Scheduled/Holiday)
  2: { duty: 'HNST', isCompleted: true }, // Green (Completed)
  3: { duty: 'HNST', isCompleted: true }, // Green (Completed)
  4: { duty: 'HNST', isCompleted: true }, // Green (Completed)
  23: { duty: 'HOLIDAY', isCompleted: false }, // Red (Scheduled/Holiday)
};

const getAmendedCalendar = (): CalendarDay[] => {
  const today = new Date();
  const targetMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Using current month for simplicity
  const year = targetMonth.getFullYear();
  const month = targetMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const startWeekDay = (firstDay.getDay() + 6) % 7;

  const days: CalendarDay[] = [];

  // Previous month padding
  for (let i = startWeekDay; i > 0; i--) {
    days.push({ date: prevMonthLastDay - i + 1, month: 'prev', schedule: 'NONE', year, monthIndex: month - 1, isCompleted: false });
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const event = mockAmendedEvents[i];
    days.push({
      date: i,
      month: 'current',
      schedule: event?.duty || 'NONE',
      year,
      monthIndex: month,
      isCompleted: event?.isCompleted || false,
    });
  }

  // Next month padding
  let nextDate = 1;
  while (days.length % 7 !== 0) {
    days.push({ date: nextDate++, month: 'next', schedule: 'NONE', year, monthIndex: month + 1, isCompleted: false });
  }

  return days;
};

// --- AmendedDayCell Component ---
const AmendedDayCell: FC<{ day: CalendarDay }> = ({ day }) => {
  const isCurrentMonth = day.month === 'current';
  const isScheduled = day.schedule !== 'NONE';
  
  let borderColor = 'transparent';
  let textColor = '#A0A0A0';
  let opacity = 0.3;

  if (isCurrentMonth) {
    opacity = 1;
    if (day.isCompleted) {
      // Completed - Green circle (as per image)
      borderColor = '#006c05ff'; 
      textColor = '#E0E0E0';
    } else if (isScheduled) {
      // Scheduled/Not Completed - Red circle (as per image)
      borderColor = '#c40000ff'; 
      textColor = '#E0E0E0';
    } else {
      // Unscheduled/Empty - Grey text
      textColor = '#A0A0A0';
    }
  }

  return (
    <View style={styles.dayCell}>
      <View
        style={[
          styles.dayCircle,
          {
            borderColor: borderColor,
            borderWidth: isScheduled ? 2 : 0, // Only show border if scheduled
            opacity: opacity,
          },
        ]}
      >
        <Text style={[styles.dayText, { color: textColor }]}>{day.date}</Text>
      </View>
    </View>
  );
};

// --- Main Component ---
const AmendedProgram: FC = () => {
  const calendarData = useMemo(() => getAmendedCalendar(), []);

  const monthTitle = useMemo(() => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="arrow-back" type="material" color="#E0E0E0" size={28} onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Amended Program</Text>
        </View>

        <View style={styles.calendarContainer}>
            {/* Calendar Header with Arrows and Month */}
            <View style={styles.monthHeader}>
                <Pressable><Icon name="arrow-back-ios" type="material" color="#E0E0E0" size={20} /></Pressable>
                <Text style={styles.monthTitle}>{monthTitle}</Text>
                <Pressable><Icon name="arrow-forward-ios" type="material" color="#E0E0E0" size={20} /></Pressable>
            </View>

            {/* Day Labels */}
            <View style={styles.calendarGrid}>
              {['M','T','W','T','F','S','S'].map(day => (
                <Text key={day} style={styles.dayLabel}>{day}</Text>
              ))}
            </View>
            
            {/* Calendar Days */}
            <View style={styles.calendarGrid}>
              {calendarData.map((day, idx) => (
                <AmendedDayCell key={idx} day={day} />
              ))}
            </View>
        </View>

        {/* Footer Legend */}
        <View style={styles.footerLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#c40000ff' }]} />
            <Text style={styles.legendText}>Scheduled</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#006c05ff' }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
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
  
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  monthTitle: { fontSize: 18, fontWeight: '700', color: '#E0E0E0' },

  calendarContainer: { margin: 15, padding: 15, backgroundColor: '#1E1E1E', borderRadius: 12, marginTop: 10 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  dayLabel: { width: `${100/7}%`, textAlign: 'center', fontWeight: '500', color: '#A0A0A0', fontSize: 14, paddingVertical: 5 },
  dayCell: { width: `${100/7}%`, alignItems: 'center', justifyContent: 'center', aspectRatio: 1, paddingVertical: 4 },
  dayCircle: { width: 35, height: 35, borderRadius: 17.5, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 15, fontWeight: '600' },
  
  footerLegend: { flexDirection: 'row', justifyContent: 'center', marginTop: 40, paddingBottom: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { color: '#E0E0E0', fontSize: 14 },
});

export default AmendedProgram;