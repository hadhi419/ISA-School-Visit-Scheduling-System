import api from '@/api/axiosInstance';
import { useAuth } from '@/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Icon } from '@rneui/themed';
import { router } from 'expo-router';
import React, { FC, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLoading } from '../../LoadingContext';

interface Location {
  id: number;
  name: string;
}

interface VisitItem {
  id: number;
  isa_name: string;
  date: string;
  month: string;
  duty: string;
  location_id: number;
  status: string;
}

const LocationMonitoring: FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(-1);
  const [visits, setVisits] = useState<VisitItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { role, id, isLoggedIn } = useAuth();
  const { setLoading } = useLoading();

  //const [showDatePicker, setShowDatePicker] = useState(false);

  // 🔹 Load locations
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    console.log(role);
    console.log(id);
    const today = new Date();

    setSelectedDate(today);

    fetchData();
    fetchLocations();
  }, []);

  const formatDateToYMD = (date: Date | null): string | null => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const fetchData = async () => {
    if (!selectedLocation || selectedLocation === -1) return;

    const date = formatDateToYMD(selectedDate);

    const minTime = 300; 
    const start = Date.now(); 
    setLoading(true); 

    try {
      let dateParam = '';
      if (selectedDate) {
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        dateParam = `&date=${yyyy}-${mm}-${dd}`;
      }
      console.log('debugging');
      const response = await api.get(
        `/visits/location?location_id=${selectedLocation}&date=${date}`
      );
      console.log(response);

      setVisits(response.data.data);
    } catch (err) {
      console.error('Error fetching visits by location', err);
    } finally {
      const elapsed = Date.now() - start; 
      if (elapsed < minTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minTime - elapsed)
        );
      }
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    const minTime = 300; 
    const start = Date.now(); 
    setLoading(true);

    try {
      const response = await api.get(`/locations`);

      const locations = response.data.locations;

      const locationsFiltered = locations.map(
        (loc: { id: any; name: any }) => ({
          id: loc.id,
          name: loc.name,
        })
      );

      console.log(locationsFiltered);
      setLocations(locationsFiltered);
    } catch (err) {
      console.error('Error fetching locations', err);
    } finally {
      const elapsed = Date.now() - start; 
      if (elapsed < minTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minTime - elapsed)
        );
      }
      setLoading(false);
    }
  };

  // 🔹 Load visits by location
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    console.log('daaate', selectedDate);
    if (!selectedLocation || selectedLocation === -1) {
      setVisits([]);
      return;
    }
    fetchData();
  }, [selectedLocation, selectedDate]);

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <>
              {/* Header */}
              <View style={styles.header}>
                <Icon
                  name="arrow-back"
                  type="material"
                  color="#fff"
                  onPress={() => router.back()}
                />
                <Text style={styles.headerTitle}>Location Monitoring</Text>
                <View style={{ width: 24 }} />
              </View>

              {/* Picker */}
              <View style={styles.filterContainer}>
                <Text style={[styles.filterLabel, { marginTop: 14 }]}>
                  Select Location
                </Text>

                {Platform.OS === 'ios' ? (
                  <>
                    {/* iOS Button */}
                    <Pressable
                      style={styles.iosPickerButton}
                      onPress={() => setShowPicker(true)}
                    >
                      <Text style={styles.iosPickerText}>
                        {selectedLocation
                          ? locations.find((l) => l.id === selectedLocation)
                              ?.name
                          : '-- Select Location --'}
                      </Text>
                    </Pressable>

                    {/* iOS Modal Picker */}
                    <Modal
                      visible={showPicker}
                      transparent
                      animationType="slide"
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <Picker
                            style={{
                              width: '100%',
                              height: 150,
                              color: '#f97f7f',
                            }}
                            itemStyle={{
                              color: '#000',
                              fontSize: 16,
                            }}
                            // make sure color is set here
                            selectedValue={selectedLocation ?? -1}
                            onValueChange={(value) => {
                              if (value !== -1) setSelectedLocation(value);
                            }}
                          >
                            <Picker.Item
                              label="-- Select Location --"
                              value={-1}
                            />
                            {locations.map((loc) => (
                              <Picker.Item
                                key={loc.id}
                                label={loc.name}
                                value={loc.id}
                              />
                            ))}
                          </Picker>

                          <Pressable
                            style={styles.doneButton}
                            onPress={() => setShowPicker(false)}
                          >
                            <Text style={styles.doneText}>Done</Text>
                          </Pressable>
                        </View>
                      </View>
                    </Modal>
                  </>
                ) : (
                  /* Android Picker */
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={selectedLocation}
                      onValueChange={(value) =>
                        setSelectedLocation(value ? Number(value) : null)
                      }
                    >
                      <Picker.Item label="-- Select Location --" value={null} />
                      {locations.map((loc) => (
                        <Picker.Item
                          key={loc.id}
                          label={loc.name}
                          value={loc.id}
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              </View>

              {/* Date Filter */}
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter by Date</Text>

                {Platform.OS === 'web' ? (
                  // ✅ Web fallback
                  <input
                    type="date"
                    style={{
                      borderWidth: 2,
                      borderColor: '#1976D2',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                      width: '100%',
                    }}
                    value={
                      selectedDate ? (formatDateToYMD(selectedDate) ?? '') : ''
                    }
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  />
                ) : (
                  // ✅ Mobile (iOS + Android)
                  <>
                    <Pressable
                      style={styles.iosPickerButton}
                      onPress={() => setDatePickerVisible(true)}
                    >
                      <Text style={styles.iosPickerText}>
                        {selectedDate
                          ? selectedDate.toDateString()
                          : '-- Select Date --'}
                      </Text>
                    </Pressable>

                    <DatePickerModal
                      mode="single"
                      locale="en"
                      visible={isDatePickerVisible}
                      onDismiss={() => setDatePickerVisible(false)}
                      date={selectedDate ?? new Date()}
                      onConfirm={({ date }) => {
                        if (date) {
                          setSelectedDate(date); // now matches Date | null
                        }
                        setDatePickerVisible(false);
                      }}
                    />
                  </>
                )}

                {selectedDate && (
                  <Pressable
                    onPress={() => setSelectedDate(null)}
                    style={{ marginTop: 8 }}
                  >
                    <Text style={{ color: '#1976D2', fontWeight: '600' }}>
                      Clear Date Filter
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Summary */}
              {selectedLocation && (
                <View style={styles.summaryBar}>
                  <Text style={styles.summaryText}>Total Visits</Text>
                  <Text style={styles.summaryValue}>{visits.length}</Text>
                </View>
              )}
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRight}>
                <Text style={styles.cardDate}>{item.date}</Text>
                <Text style={{ fontSize: 10, marginTop: -10 }}>
                  {item.month}
                </Text>
              </View>
              <View style={styles.verticalLine} />
              <View>
                <Text style={styles.cardText}>
                  <MaterialIcons name="person"></MaterialIcons> {item.isa_name}
                </Text>
                <Text style={styles.cardText}>
                  <MaterialIcons name="work"></MaterialIcons> {item.duty}
                </Text>
                <Text style={styles.cardText}>
                  <MaterialIcons name="approval"></MaterialIcons> {item.status}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            selectedLocation ? (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>No visits found</Text>
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default LocationMonitoring;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    padding: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },

  filterContainer: { margin: 14 },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: -5,
  },

  pickerWrapper: {
    borderWidth: 2,
    borderColor: '#1976D2',
    borderRadius: 8,
  },

  iosPickerButton: {
    borderWidth: 2,
    borderColor: '#1976D2',
    borderRadius: 8,
    padding: 14,
  },
  iosPickerText: {
    fontSize: 16,
    color: '#000000',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(60, 60, 60, 0.3)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
  },
  doneButton: {
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
  },

  summaryBar: {
    backgroundColor: '#dae1eb',
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
  },
  summaryText: { color: '#555' },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1976D2',
  },

  card: {
    flex: 2,
    flexDirection: 'row',
    gap: '',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardRight: {
    justifyContent: 'center', // ✅ vertical center
    alignItems: 'center', // right align
    textAlign: 'center',
  },

  cardDate: {
    fontWeight: '700',
    fontSize: 30,
    marginBottom: 6,
    color: '#00a708',
    paddingRight: 10,
    paddingLeft: 10,
    justifyContent: 'space-evenly',
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#cfcfcf',
    marginHorizontal: 12,
  },
  cardText: { fontSize: 14 },

  warningBox: {
    backgroundColor: '#f0e5a6',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  warningText: { textAlign: 'center', fontWeight: '600' },
});
