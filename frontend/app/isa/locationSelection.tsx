import { Icon } from '@rneui/base';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScheduleType, useSchedule } from '../../isa/context/ScheduleContext';

// ⚙️ Update if you're testing on a physical device
const API_URL = "http://localhost:5000/api/locations";

const LocationSelection = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const date = searchParams.get('date') ?? '';
  const dutyP = searchParams.get('duty') ?? '';

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { addEvent } = useSchedule();

  // 🔹 Fetch locations using Axios
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(API_URL);
        const fetched = res.data.locations?.map((loc: any) => loc.name) || [];
        setLocations(fetched);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to fetch locations from server");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleChoose = () => {
    if (!selectedLocation) return;

    const month = new Date().toLocaleString('default', { month: 'long' });

    addEvent({ date, month, duty: dutyP as ScheduleType, location: selectedLocation });

    console.log('✅ Event added:', { date, dutyP, location: selectedLocation });
    router.navigate('/isa/advancedProgram');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text>Loading locations...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
                      <Icon name="arrow-back" type="material" color="#E0E0E0" size={28} onPress={() => router.back()} />
                      <Text style={styles.headerTitle}>Select Location</Text>
                      <View style={{ width: 28 }} />
      </View>
      {/* Location List */}
     <FlatList
        data={locations}
        keyExtractor={(item, index) => item + index}
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 10 }}  // 👈 Add this line
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
    </SafeAreaView>
  );
};

export default LocationSelection;

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#1976D2", justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '500', color: '#ffffffff', textAlign: 'center', flex: 1 },
  backButton: { marginRight: 15 },
  backIcon: { fontSize: 24, fontWeight: 'bold' },
  locationItem: {
  width: 320, // or any fixed pixel width you like
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#ddd',
  borderRadius: 8,
  marginBottom: 8,
  marginTop: 8,
  backgroundColor: '#eee'
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
