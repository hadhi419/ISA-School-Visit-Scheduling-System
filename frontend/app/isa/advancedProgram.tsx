import { Picker } from '@react-native-picker/picker';
import { Icon } from '@rneui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScheduleType } from '../../isa/context/ScheduleContext';

import { useAuth } from '@/AuthContext';
import api from '../../api/axiosInstance';

interface DayCellProps {
  day: CalendarDay;
  onPress?: () => void; // normal tap
  onEditPress?: () => void; // edit popup
}

interface CalendarDay {
  date: number;
  month: 'prev' | 'current' | 'next';
  schedule: ScheduleType;
  year: number;
  monthIndex: number;
  location?: string;
}

export interface ScheduledEvent {
  date: string;
  duty: ScheduleType;
  location: number;
}

// Updated getNextMonthCalendar to preserve location
const getNextMonthCalendar = (scheduledEvents?: {
  [date: number]: { duty: ScheduleType; location?: string };
}): CalendarDay[] => {
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
      schedule: isWeekend ? 'NONE' : scheduledEvents?.[i]?.duty || 'NONE',
      location: scheduledEvents?.[i]?.location,
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

const DayCell: FC<{
  day: CalendarDay;
  canEdit: boolean;
  onPress?: () => void;
  onEditPress?: (dayDate: number, isEdit: string) => void;
}> = ({ day, canEdit, onPress, onEditPress }) => {
  if (day.date === 0) return <View style={styles.dayCell} />;

  const [showPopup, setShowPopup] = useState(false);
  const dayObj = new Date(day.year, day.monthIndex, day.date);
  const isWeekend =
    day.month === 'current' && (dayObj.getDay() === 0 || dayObj.getDay() === 6);

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

  const color = scheduleColors[day.schedule] || scheduleColors.NONE;

  return (
    <View style={styles.dayCell}>
      <Pressable
        disabled={isWeekend || !canEdit}
        onPress={onPress}
        onLongPress={() => setShowPopup(true)}
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
          <Text style={[styles.dayText, { color: color.text }]}>
            {day.date}
          </Text>
        </View>
      </Pressable>

      {/* {showPopup && (
        <Pressable
          style={styles.popupOverlay}
          onPress={() => setShowPopup(false)}
        >
          <View style={styles.popupCard}>
            <Text style={styles.popupTitle}>
              {day.date} {dayObj.toLocaleString('default', { month: 'long' })}
            </Text>

            <View style={styles.popupInfoRow}>
              <Text style={styles.popupLabel}>Duty:</Text>
              <Text style={styles.popupValue}>
                {day.schedule !== 'NONE' ? day.schedule : 'Not set'}
              </Text>
            </View>

            <View style={styles.popupInfoRow}>
              <Text style={styles.popupLabel}>Location:</Text>
              <Text style={styles.popupValue}>{day.location}</Text>
            </View>

            <View style={styles.popupActions}>
              <Pressable
                style={[styles.popupButton, styles.popupEdit]}
                onPress={() => {
                  setShowPopup(false);
                  onEditPress?.(day.date, 'true'); // existing edit flow
                }}
              >
                <Text style={styles.popupButtonText}>Edit</Text>
              </Pressable>

              <Pressable
                style={[styles.popupButton, styles.popupClear]}
                onPress={() => {
                  setShowPopup(false);
                  //console.log('Clear pressed for day:', day.date);
                  // Later: call context function to clear duty
                }}
              >
                <Text style={styles.popupButtonText}>Clear</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      )} */}
    </View>
  );
};

const AdvancedProgram: FC = () => {
  const { id, name } = useAuth();

  const { fromLocationSelection } = useLocalSearchParams<{
    fromLocationSelection?: string;
  }>();

  const [viewMode, setViewMode] = useState<'calendar' | 'card'>('calendar');

  const [scheduledEvents, setRemoteData] = useState<ScheduledEvent[]>([]);

  const [canEdit, setCanEdit] = useState(false);

  const [showPicker, setShowPicker] = useState(false);

  const monthToFetch = useMemo(
    () =>
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      ).toLocaleString('default', { month: 'long' }),
    []
  );

  // useEffect(() => {
  //   fetchMonthVisits(monthToFetch);
  // }, [fetchMonthVisits, monthToFetch]);

  // useFocusEffect(
  //   useCallback(() => {
  //     //fetchMonthVisits(monthToFetch);
  //   }, [fetchMonthVisits, monthToFetch])
  // );

  // useEffect(
  //   useCallback(() => {
  //     // if (skipFetch) {
  //     //   return; // ⛔ skip fetch when coming from LocationSelection
  //     // }

  //     const fetchData = async () => {
  //       const nextMonth = new Date(
  //         new Date().getFullYear(),
  //         new Date().getMonth() + 1,
  //         1
  //       ).toLocaleString('default', { month: 'long' });

  //       const response = await api.get(`/visits/month/${nextMonth}/5`);

  //       const remoteEvents: ScheduledEvent[] = response.data.visits.map(
  //         (item: any) => ({
  //           date: item.visit_date.toString(),
  //           duty: item.duty as ScheduleType,
  //           location: item.location_name,
  //         })
  //       );

  //       setRemoteData(remoteEvents);
  //     };

  //     fetchData();
  //   }, [setRemoteData, skipFetch])
  // );

  const fetchData = async () => {
    const nextMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    ).toLocaleString('default', { month: 'long' });

    const response = await api.get(`/visits/month/${nextMonth}/${id}`);
    const canEditResponse = await api.get(
      `/visits/month/${nextMonth}/${id}/edit-permission`
    );

    console.log('Haaaaaaaaaadhi', response.data);

    const canEditValue = canEditResponse.data.canEdit as boolean;
    setCanEdit(canEditValue);

    console.log('Can Edit Response:', canEditResponse.data);

    const remoteEvents: ScheduledEvent[] = response.data.visits.map(
      (item: any) => ({
        date: item.visit_date.toString(),
        duty: item.duty as ScheduleType,
        location: item.location_name,
      })
    );

    console.log('Remoooote', remoteEvents);

    setRemoteData(remoteEvents);
  };

  useEffect(() => {
    fetchData();
  }, [setRemoteData]);

  const handleSubmitSchedule = async () => {
    {
      const nextMonthName = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      ).toLocaleString('default', { month: 'long' });
      try {
        await api.post('visits/submit', {
          month: nextMonthName,
          isa_id: id,
        });
        alert('Monthly schedule submitted successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to submit monthly schedule.');
      }

      fetchData();
    }
  };

  // ✅ Preserve location in scheduledEventsObj
  const scheduledEventsObj = useMemo(() => {
    return scheduledEvents.reduce(
      (acc, event) => {
        acc[Number(event.date)] = {
          duty: event.duty,
          location: event.location?.toString(),
        };
        return acc;
      },
      {} as { [date: number]: { duty: ScheduleType; location?: string } }
    );
  }, [scheduledEvents]);

  const calendarData = useMemo(
    () => getNextMonthCalendar(scheduledEventsObj),
    [scheduledEventsObj]
  );

  const monthTitle = useMemo(() => {
    const nextMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    );
    return nextMonth.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const unscheduledWeekdays = calendarData.filter(
    (d) =>
      d.month === 'current' &&
      d.schedule === 'NONE' &&
      ![0, 6].includes(new Date(d.year, d.monthIndex, d.date).getDay())
  ).length;

  const onDayPress = (dayDate: number, isEdit: string) => {
    //console.log('edit pressed:', isEdit);

    router.push({
      pathname: '/isa/dutySelection',
      params: { date: dayDate.toString(), month: monthToFetch, edit: isEdit },
    });
  };

  const saveScheduleToBackend = async () => {
    try {
      const nextMonthName = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      ).toLocaleString('default', { month: 'long' });

      if (id === null) {
        throw new Error('ISA id is missing');
      }

      const payloadMap = new Map<
        number,
        {
          visit_date: string;
          month: string;
          isa_id: number;
          location_id: number;
          duty: ScheduleType;
        }
      >();
      scheduledEvents.forEach((event) => {
        const eventMonthName = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          Number(event.date)
        ).toLocaleString('default', { month: 'long' });
        if (eventMonthName === nextMonthName) {
          payloadMap.set(Number(event.date), {
            visit_date: event.date,
            month: nextMonthName,
            isa_id: id,
            location_id: Number(event.location),
            duty: event.duty,
          });
        }
      });
      const uniquePayloads = Array.from(payloadMap.values());
      console.log('Payload to be sent:', uniquePayloads);
      if (uniquePayloads.length === 0) return alert('No new visits to save.');
      await api.post('/visits', uniquePayloads);
      alert('✅ Schedule saved to the database!');
      // fetchMonthVisits(nextMonthName);
      //fetchMonthVisits(monthToFetch);
    } catch (err) {
      console.error(err);
      alert('Failed to save schedule.');
    }
  };

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const DUTY_COLORS: Record<
    ScheduleType | 'NONE',
    { bg: string; border: string; text: string }
  > = {
    HNST: { bg: '#E3F2FD', border: '#1976D2', text: '#0D47A1' },
    DEV: { bg: '#FFF8E1', border: '#FFC107', text: '#795548' },
    EVAL: { bg: '#E8F5E9', border: '#4CAF50', text: '#1B5E20' },
    EXAM: { bg: '#F3E5F5', border: '#8E24AA', text: '#4A148C' },
    HOLI: { bg: '#FDECEA', border: '#E53935', text: '#B71C1C' },
    NONE: { bg: '#FFFFFF', border: '#DDD', text: '#333' },
  };

  const [selectedDuty, setSelectedDuty] = useState<string | ''>();

  var dataToBeShownInCard;
  if (selectedDuty == 'ALL' || selectedDuty == undefined) {
    dataToBeShownInCard = scheduledEvents.map((event) => ({
      date: Number(event.date),
      month: 'current',
      schedule: event.duty,
      location: event.location?.toString(),
      year: new Date().getFullYear(),
      monthIndex: new Date().getMonth() + 1, // next month
    }));
  } else {
    dataToBeShownInCard = scheduledEvents
      .filter((event) => event.duty === selectedDuty)
      .map((event) => ({
        date: Number(event.date),
        month: 'current',
        schedule: event.duty,
        location: event.location?.toString(),
        year: new Date().getFullYear(),
        monthIndex: new Date().getMonth() + 1,
      }));
  }

  console.log('Data to be shown in card view:', dataToBeShownInCard);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          type="material"
          color="#E0E0E0"
          size={28}
          onPress={() => router.push('/isa/isaDashboard')}
        />
        <Text style={styles.headerTitle}>Advanced Program</Text>
        <Pressable
          onPress={() =>
            setViewMode(viewMode === 'calendar' ? 'card' : 'calendar')
          }
        >
          <Icon
            name={viewMode === 'calendar' ? 'view-list' : 'calendar-today'}
            type="material"
            color="#fff"
            size={28}
          />
        </Pressable>
      </View>

      {viewMode == 'calendar' && (
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryText}>{monthTitle} Schedule</Text>
            <Text style={styles.submitDate}>Submit by 25th</Text>
          </View>
          <View style={styles.summaryItemRight}>
            <Text style={styles.summaryText}>Scheduled</Text>
            <Text style={styles.summaryValueScheduled}>
              {
                calendarData.filter(
                  (d) => d.month === 'current' && d.schedule !== 'NONE'
                ).length
              }
            </Text>
          </View>
        </View>
      )}

      {!canEdit && (
        <View style={styles.warningBoxSubmitted}>
          {/* <View style={styles.summaryItem}> */}
          <Text style={styles.warningIcon}>✅</Text>
          <Text style={styles.warningText}>
            Schedule already has been submitted for {monthTitle} and You are not
            allowed edit
          </Text>
          {/*<Text style={styles.submitDate}>Submit by 25th</Text>*/}
          {/* </View> */}
        </View>
      )}

      {unscheduledWeekdays > 0 && (
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            You have **{unscheduledWeekdays}** weekdays with no scheduled
            visits. Please complete your schedule.
          </Text>
        </View>
      )}

      {viewMode === 'calendar' ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.calendarContainer}>
            <Text style={styles.monthTitle}>{monthToFetch}</Text>
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
                  key={`${day.year}-${day.monthIndex}-${day.date}-${day.month}-${idx}`}
                  canEdit={canEdit}
                  day={day}
                  onPress={
                    day.date === 0
                      ? undefined
                      : () => onDayPress(day.date, 'false')
                  }
                  onEditPress={
                    day.date === 0
                      ? undefined
                      : () => onDayPress(day.date, 'true')
                  }
                />
              ))}
            </View>
            {canEdit && (
              <Pressable
                style={[
                  styles.submitButton,
                  {
                    backgroundColor:
                      unscheduledWeekdays === 0 ? '#388E3C' : '#A0A0A0',
                    opacity: unscheduledWeekdays === 0 ? 1 : 0.6,
                  },
                ]}
                disabled={unscheduledWeekdays > 0}
                onPress={handleSubmitSchedule}
              >
                <Text style={styles.submitButtonText}>Submit Schedule</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      ) : (
        <>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filter by Duty</Text>
            {Platform.OS === 'ios' ? (
              <>
                <Pressable
                  style={{
                    borderWidth: 2,
                    borderColor: '#1976D2',
                    borderRadius: 8,
                    padding: 14,
                  }}
                  onPress={() => setShowPicker(true)}
                >
                  <Text>
                    {selectedDuty ? selectedDuty : '-- Select Duty --'}
                  </Text>
                </Pressable>

                <Modal visible={showPicker} transparent animationType="slide">
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    <View style={{ backgroundColor: '#fff' }}>
                      <Picker
                        selectedValue={selectedDuty ?? ''}
                        onValueChange={(value) => setSelectedDuty(value)}
                        style={{ width: '100%', height: 150 }}
                        itemStyle={{
                          color: '#000',
                          fontSize: 16,
                        }}
                      >
                        <Picker.Item label="-- Select Duty --" value="" />
                        {['HNST', 'DEV', 'EVAL', 'EXAM', 'HOLI', 'ALL'].map(
                          (duty) => (
                            <Picker.Item key={duty} label={duty} value={duty} />
                          )
                        )}
                      </Picker>
                      <Pressable
                        style={{
                          padding: 14,
                          alignItems: 'center',
                          borderTopWidth: 1,
                          borderColor: '#ddd',
                        }}
                        onPress={() => setShowPicker(false)}
                      >
                        <Text style={{ color: '#1976D2', fontWeight: '600' }}>
                          Done
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </>
            ) : (
              <View
                style={{
                  borderWidth: 2,
                  borderColor: '#1976D2',
                  borderRadius: 8,
                }}
              >
                <Picker
                  selectedValue={selectedDuty}
                  onValueChange={(value) => setSelectedDuty(value)}
                >
                  <Picker.Item label="-- Select Duty --" value="" />
                  {['HNST', 'DEV', 'EVAL', 'EXAM', 'HOLI', 'ALL'].map(
                    (duty) => (
                      <Picker.Item key={duty} label={duty} value={duty} />
                    )
                  )}
                </Picker>
              </View>
            )}
          </View>
          <FlatList
            style={{ flex: 1 }}
            data={dataToBeShownInCard}
            keyExtractor={(item, idx) =>
              `${item.year}-${item.monthIndex}-${item.date}-${idx}`
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
            renderItem={({ item }) => {
              const isWeekend =
                new Date(item.year, item.monthIndex, item.date).getDay() ===
                  0 ||
                new Date(item.year, item.monthIndex, item.date).getDay() === 6;
              const isHoliday = item.schedule === 'HOLI';
              const isNonHoliday = item.schedule !== 'NONE' && !isHoliday;

              const cardStyle = [
                styles.card,
                {
                  backgroundColor: DUTY_COLORS[item.schedule].bg, // highlight non-holiday days
                  borderWidth: isNonHoliday ? 1 : 0,
                  borderColor: DUTY_COLORS[item.schedule].border,
                },
              ];
              var textColor;
              var BackgroundColor;

              if (isWeekend) {
                textColor = '#b5b5b5';
                BackgroundColor = '#fff4f4';
              } else {
                textColor = DUTY_COLORS[item.schedule].text;
                BackgroundColor = DUTY_COLORS[item.schedule].bg;
              }

              return (
                <Pressable
                  disabled={isWeekend || !canEdit}
                  style={[cardStyle, { backgroundColor: BackgroundColor }]}
                  onPress={() => onDayPress(item.date, 'false')}
                >
                  <Text style={[styles.cardDate, { color: textColor }]}>
                    {item.date} {isWeekend ? 'Holiday' : ''}
                  </Text>
                  <Text style={[styles.cardDuty, { color: textColor }]}>
                    Duty: {item.schedule}
                  </Text>
                  <Text style={[styles.cardDuty, { color: textColor }]}>
                    Location: {item.location || 'Not Set'}
                  </Text>
                  {isHoliday && (
                    <Text
                      style={{
                        color: '#888',
                        fontStyle: 'italic',
                        marginTop: 4,
                      }}
                    >
                      Holiday
                    </Text>
                  )}
                </Pressable>
              );
            }}
          />
        </>
      )}

      {/* <Pressable
          style={[styles.submitButton, { backgroundColor: '#1976D2' }]}
          onPress={saveScheduleToBackend}
        >
          <Text style={[styles.submitButtonText, { color: '#fff' }]}>Save</Text>
        </Pressable> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#dae1eb',
    padding: 15,
    margin: 15,
    borderRadius: 12,
  },
  summaryItem: { flex: 3, paddingRight: 10 },
  summaryItemRight: { flex: 1, alignItems: 'flex-end' },
  summaryText: { fontSize: 14, color: '#555' },
  submitDate: { fontWeight: '600', color: '#393052', fontSize: 15 },
  summaryValueScheduled: {
    fontSize: 24,
    fontWeight: '700',
    color: '#66BB6A',
    marginTop: 5,
  },
  cannotEditBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffa87a',
    padding: 15,
    margin: 15,
    borderRadius: 12,
  },
  cannotEditText: { fontSize: 14, color: '#ffffff' },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e5a6',
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#FFC107',
    marginTop: 5,
  },
  warningBoxSubmitted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b2f0a6',
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#28ff07',
    marginTop: 5,
  },
  warningIcon: { fontSize: 20, marginRight: 10 },
  warningText: { flex: 1, fontSize: 14, color: '#000' },
  calendarContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
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
  monthTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    flex: 1,
    marginBottom: 15,
  },
  dayText: { fontSize: 15, fontWeight: '600' },
  submitButton: {
    marginHorizontal: 15,
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
  },
  submitButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  card: {
    backgroundColor: '#870202',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDate: { fontWeight: '600', fontSize: 16, marginBottom: 6 },
  cardDuty: { fontSize: 15 },

  popup: {
    position: 'relative',
    top: 45,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  popupButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  popupButtonSecondary: {
    backgroundColor: '#EF5350',
  },

  popupText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },

  popupCard: {
    width: 280,
    height: 300, // ⬅️ bigger card
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18, // ⬅️ more inner space
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },

  popupTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },

  popupInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },

  popupLabel: {
    fontWeight: '600',
    width: 70, // fixed width for label
    color: '#333',
  },

  popupValue: {
    flex: 1, // allows wrapping
    color: '#555',
  },

  popupActions: {
    marginTop: 18,
    gap: 10, // ⬅️ spacing between buttons
  },

  popupEdit: {
    backgroundColor: '#1976D2',
  },

  popupClear: {
    backgroundColor: '#EF5350',
  },

  popupButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  filterContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 1,
    //borderRadius: 12,
    //backgroundColor: '#fefefe',
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.1,
    //shadowRadius: 4,
    //elevation: 3,
  },

  filterLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },

  pickerWrapper: {
    backgroundColor: '#f5f5f5',
    borderRadius: 7,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#1976d2',
  },

  pickerStyle: {
    height: 30,
    color: '#020304',
    fontSize: 15,
    paddingHorizontal: 8,
  },
});

export default AdvancedProgram;
