import api from '@/api/axiosInstance';
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
import { SafeAreaView } from 'react-native-safe-area-context';

interface Location {
  id: number;
  name: string;
}

interface VisitItem {
  id: number;
  isa_name: string;
  date: string;
  duty: string;
  location_id: number;
  status: string;
}

const LocationMonitoring: FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(-1);
  const [visits, setVisits] = useState<VisitItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showDutyPicker, setShowDutyPicker] = useState(false);

  // 🔹 Load locations
  useEffect(() => {
    fetchData();
    fetchLocations();
  }, []);

  const fetchData = async () => {
    const response = await api.get(
      `/visits/location?location_id=${selectedLocation}&month=February&day=14`
    );
    const dutiesData = response.data.data;
    console.log(dutiesData);

    setVisits(dutiesData);
  };

  const fetchLocations = async () => {
    const response = await api.get(`/locations`);

    const locations = response.data.locations;

    const locationsFiltered = locations.map((loc: { id: any; name: any }) => ({
      id: loc.id,
      name: loc.name,
    }));

    console.log(locationsFiltered);
    setLocations(locationsFiltered);
    //console.log(dutiesData);

    //setVisits(dutiesData);
  };

  // 🔹 Load visits by location
  useEffect(() => {
    if (!selectedLocation) {
      setVisits([]);
      return;
    }

    // const dummyVisits: VisitItem[] = [
    //   {
    //     id: 1,
    //     isa_name: 'Mohomed Hadhi',
    //     date: '2026-02-07',
    //     duty: 'School Visit',
    //     location_id: 1,
    //     status: 'APPROVED',
    //   },
    //   {
    //     id: 2,
    //     isa_name: 'Maleesha Aiya',
    //     date: '2026-02-07',
    //     duty: 'Meeting',
    //     location_id: 1,
    //     status: 'SUBMITTED',
    //   },
    //   {
    //     id: 3,
    //     isa_name: 'Fathima Rizni',
    //     date: '2026-02-09',
    //     duty: 'Training Session',
    //     location_id: 2,
    //     status: 'VERIFIED',
    //   },
    // ];

    fetchData();
  }, [selectedLocation]);

  return (
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
              <Text style={styles.filterLabel}>Select Location</Text>

              {Platform.OS === 'ios' ? (
                <>
                  {/* iOS Button */}
                  <Pressable
                    style={styles.iosPickerButton}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={styles.iosPickerText}>
                      {selectedLocation
                        ? locations.find((l) => l.id === selectedLocation)?.name
                        : '-- Select Location --'}
                    </Text>
                  </Pressable>

                  {/* iOS Modal Picker */}
                  <Modal visible={showPicker} transparent animationType="slide">
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
            <Text style={styles.cardDate}>{item.date}</Text>
            <Text style={styles.cardText}>ISA: {item.isa_name}</Text>
            <Text style={styles.cardText}>Duty: {item.duty}</Text>
            <Text style={styles.cardText}>Status: {item.status}</Text>
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

  filterContainer: { margin: 16 },
  filterLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6 },

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
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardDate: { fontWeight: '700', fontSize: 16, marginBottom: 6 },
  cardText: { fontSize: 14 },

  warningBox: {
    backgroundColor: '#f0e5a6',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  warningText: { textAlign: 'center', fontWeight: '600' },
});
