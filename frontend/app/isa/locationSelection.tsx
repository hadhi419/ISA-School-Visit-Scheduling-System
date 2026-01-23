import { Icon } from '@rneui/base';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScheduleType, useSchedule } from '../../isa/context/ScheduleContext';

import { useAuth } from '@/AuthContext';
import api from '../../api/axiosInstance';

const API_URL = '/locations';

const LocationSelection = () => {
  const params = useLocalSearchParams();
  // console.log(params);
  const date = params.date ?? '';
  const dutyP = params.duty ?? '';
  const isEdit = params.isEdit;
  const edit = isEdit === 'true';
  //console.log('isEdit param location:', isEdit);

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { addEvent } = useSchedule();

  const { id, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    const fetchLocations = async () => {
      try {
        const res = await api.get(API_URL);
        const fetched =
          res.data.locations?.map((loc: any) => ({
            id: loc.id, // or loc._id depending on your backend
            name: loc.name,
          })) || [];

        console.log('Fetched locations:', fetched);

        setLocations(fetched);
        console.log('debugging');

        console.log(locations);

        console.log('debugging');
        console.log(edit);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to fetch locations from server');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleChoose = async () => {
    if (!selectedLocationId) return;
    const today = new Date();
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    const month = nextMonth.toLocaleString('default', { month: 'long' });
    if (!edit) {
      const payload = [
        {
          visit_date: date,
          month,
          isa_id: id,
          location_id: selectedLocationId,
          duty: dutyP as ScheduleType,
          report_text: null,
        },
      ];
      console.log('Payload for edit:', payload);
      await api.post('visits', payload);
    } else {
      const payload = [
        {
          visit_date: date,
          month,
          isa_id: id,
          location_id: selectedLocationId,
          duty: dutyP as ScheduleType,
          report_text: null,
        },
      ];
      console.log('Payload for edit:', payload);
      await api.post('visits', payload);
    }

    router.navigate({
      pathname: '/isa/advancedProgram',
    });
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
        <Icon
          name="arrow-back"
          type="material"
          color="#E0E0E0"
          size={28}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Select Location</Text>
        <View style={{ width: 28 }} />
      </View>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 10 }}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.locationItem,
              selectedLocationId === Number(item.id) &&
                styles.selectedLocationItem,
            ]}
            onPress={() => setSelectedLocationId(Number(item.id))}
          >
            <Text
              style={[
                styles.locationText,
                selectedLocationId === Number(item.id) && { color: '#fff' },
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
      />

      <Pressable
        style={[styles.chooseButton, !selectedLocationId && { opacity: 0.5 }]}
        onPress={handleChoose}
        disabled={!selectedLocationId}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffffff',
    textAlign: 'center',
    flex: 1,
  },
  backButton: { marginRight: 15 },
  backIcon: { fontSize: 24, fontWeight: 'bold' },
  locationItem: {
    width: 320,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 8,
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
