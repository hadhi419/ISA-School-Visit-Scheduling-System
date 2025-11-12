import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScheduleType, useSchedule } from './context/ScheduleContext';

type Props = {
  date: string;
  duty: 'HNST' | 'EXAM' | 'DEV' | 'EVAL';
};

const LocationSelection = () => {


    const searchParams = new URLSearchParams(window.location.search);
    const date = searchParams.get('date') ?? '';
    const dutyP = searchParams.get('duty') ?? '';
    console.log(searchParams.get('duty'));
    console.log(searchParams.get('date'));

    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const { addEvent } = useSchedule();


    const sampleLocations = [
  'Kidachchurai Karubippankul',
  'Tharanikkulam Ganesh Vidyalaya',
  'Parannaddakal GTMS',
  'Maravankulam Barathidasan School',
  'Omanthi Central College',
  'Kankesanthurai Hindu College',
  'Chavakachcheri Hindu College',
  'Point Pedro Central College',
];


  const handleChoose = () => {
    if (!selectedLocation) return;

    
    addEvent({ date, duty: dutyP as ScheduleType , location: selectedLocation });
        console.log('✅ Event added:', { date, dutyP, location: selectedLocation });

        router.navigate('/isa/advancedProgram');
      };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Select Location</Text>
      </View>

      {/* Location List */}
      <FlatList
        data={sampleLocations}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.locationItem,
              selectedLocation === item && styles.selectedLocationItem,
            ]}
            onPress={() => setSelectedLocation(item)}
          >
            <Text
              style={[
                styles.locationText,
                selectedLocation === item && { color: '#fff' },
              ]}
            >
              {item}
            </Text>
          </Pressable>
        )}
      />

      {/* Choose Button */}
      <Pressable
        style={[styles.chooseButton, !selectedLocation && { opacity: 0.5 }]}
        onPress={handleChoose}
        disabled={!selectedLocation}
      >
        <Text style={styles.chooseButtonText}>Choose</Text>
      </Pressable>
    </View>
  );
};

export default LocationSelection;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { marginRight: 15 },
  backIcon: { fontSize: 24, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  locationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  selectedLocationItem: { backgroundColor: '#1976D2' },
  locationText: { fontSize: 16, color: '#000' },
  chooseButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  chooseButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
