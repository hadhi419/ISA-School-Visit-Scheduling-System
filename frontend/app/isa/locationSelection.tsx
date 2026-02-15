import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppAlert from '@/components/AppAlert';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { useLoading } from '../../LoadingContext';

const API_URL = '/locations';

const LocationSelection = () => {
  const params = useLocalSearchParams();
  // //console.log(params);
  const date = params.date ?? '';
  const dutyP = params.duty ?? '';
  const isEdit = params.isEdit;
  const edit = isEdit === 'true';
  ////console.log('isEdit param location:', isEdit);

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { addEvent } = useSchedule();

  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [appAlert, setAppAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const { id, isLoggedIn } = useAuth();
  const { setLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    const fetchLocations = async () => {
      const minTime = 300;
      const start = Date.now();
      setGlobalLoading(true);

      try {
        const res = await api.get(API_URL);
        const fetched =
          res.data.locations?.map((loc: any) => ({
            id: loc.id, // or loc._id depending on your backend
            name: loc.name,
          })) || [];

        //console.log('Fetched locations:', fetched);

        setLocations(fetched);
        //console.log('debugging');

        //console.log(locations);

        //console.log('debugging');
        //console.log(edit);
      } catch (err) {
        //console.error(err);
        setAppAlert({
          visible: true,
          title: 'Error',
          message: 'Failed to fetch locations from server',
        });
      } finally {
        setLoading(false);
        const elapsed = Date.now() - start; // ADDED
        if (elapsed < minTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minTime - elapsed)
          );
        }
        setGlobalLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const selectedLocation = locations.find(
    (l) => Number(l.id) === selectedLocationId
  );

  const handleChoose = async () => {
    if (!selectedLocationId || submitting) return;

    setSubmitting(true);
    setGlobalLoading(true);

    const today = new Date();
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    const month = nextMonth.toLocaleString('default', { month: 'long' });

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

    try {
      await api.post('visits', payload);
      router.navigate({ pathname: '/isa/advancedProgram' });
    } catch (err) {
      setAppAlert({
        visible: true,
        title: 'Error',
        message: 'Failed to save visit',
      });
    } finally {
      setSubmitting(false);
      setGlobalLoading(false);
    }
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
      <AppAlert
        visible={appAlert.visible}
        title={appAlert.title}
        message={appAlert.message}
        onClose={() => setAppAlert({ ...appAlert, visible: false })}
      />
      <View style={styles.header}>
       

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
        style={[
          styles.chooseButton,
          (!selectedLocationId || submitting) && { opacity: 0.5 },
        ]}
        onPress={() => setShowConfirm(true)}
        disabled={!selectedLocationId || submitting}
      >
        <Text style={styles.chooseButtonText}>
          {submitting ? 'Saving...' : 'Choose'}
        </Text>
      </Pressable>

      {showConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Selection</Text>

            <Text style={styles.modalText}>
              Date: <Text style={styles.bold}>{date}</Text>
            </Text>

            <Text style={styles.modalText}>
              Duty: <Text style={styles.bold}>{dutyP}</Text>
            </Text>

            <Text style={styles.modalText}>
              Location:{' '}
              <Text style={styles.bold}>{selectedLocation?.name}</Text>
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setShowConfirm(false);
                  handleChoose();
                }}
              >
                <Text style={styles.modalBtnText}>
                  {submitting ? 'Saving...' : 'Confirm'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  modalText: {
    fontSize: 15,
    marginBottom: 8,
  },

  bold: {
    fontWeight: '600',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#9E9E9E',
    marginRight: 10,
  },

  confirmButton: {
    backgroundColor: '#4CAF50',
  },

  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
