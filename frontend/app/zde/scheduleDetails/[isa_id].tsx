import { useAuth } from '@/AuthContext';
import { Icon } from '@rneui/base';
import { useRouter } from 'expo-router';
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

import api from '../../../api/axiosInstance';

interface VisitDetail {
  isa_id: number;
  isa_name: string;
  schedule: {
    visit_id: number;
    date: string;
    duty: string;
    location: string;
  }[];
}

const ZDE_USER_ID = 6; // Replace with actual logged-in ZDE id

const ScheduleDetailPage = ({ route }: any) => {
  const router = useRouter();
  const isa_id = route?.params?.isa_id ?? 5;

  const [detail, setDetail] = useState<VisitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    const fetchDetail = async () => {
      try {
        console.log('fetchinggg');
        const res = await api.get(`/approvals/visitDetail/${isa_id}`);
        console.log(res.data.schedule);
        // Ensure visit_id exists
        res.data.schedule = res.data.schedule.map(
          (item: any, index: number) => ({
            visit_id: item.visit_id ?? index + 1,
            date: item.date,
            duty: item.duty,
            location: item.location,
          })
        );

        setDetail(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [isa_id]);

  const handleApprove = async () => {
    if (!detail) return;

    setActionLoading(true);
    try {
      const res = await api.post(`/approvals/zde/approve/${isa_id}`, {
        approved_by: ZDE_USER_ID,
      });

      const data = res.data;

      if (data.success) {
        Alert.alert('Success', 'Schedule approved and copied to visit plan.');
        router.replace('/zde/zdeDashboard');
      } else {
        Alert.alert('Error', data.message || 'Failed to approve schedule.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Server error while approving schedule.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!detail) return;
    setActionLoading(true);
    try {
      const res = await api.post(`approvals/zde/reject/${isa_id}`, {
        body: JSON.stringify({
          approved_by: ZDE_USER_ID,
          comment: 'Please revise the schedule',
        }),
      });
      const data = await res.data;
      if (data.success) {
        Alert.alert('Success', 'Revision requested successfully.');
      } else {
        Alert.alert('Error', data.message || 'Failed to request revisions.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Server error while requesting revisions.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text>Loading schedule...</Text>
      </View>
    );

  if (!detail) return <Text style={{ padding: 16 }}>No schedule found</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          type="material"
          color="#fff"
          size={28}
          onPress={() => router.replace('/zde/zdeDashboard')}
        />
        <Text style={styles.headerTitle}>Schedule for {detail.isa_name}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Cards */}
      <FlatList
        data={detail.schedule}
        keyExtractor={(item) => item.visit_id.toString()}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardDate}>Visit ID: {item.visit_id}</Text>
            <Text style={styles.cardDate}>Date: {item.date}</Text>
            <Text style={styles.cardDuty}>Duty: {item.duty}</Text>
            <Text style={styles.cardLocation}>Location: {item.location}</Text>
          </View>
        )}
      />

      {/* Action Buttons */}
      <Pressable
        style={[styles.button, styles.approve]}
        onPress={handleApprove}
        disabled={actionLoading}
      >
        <Text style={styles.buttonText}>Approve Monthly Schedule</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.request]}
        onPress={handleRequestRevision}
        disabled={actionLoading}
      >
        <Text style={styles.buttonText}>Request Revisions</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ScheduleDetailPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDate: { fontWeight: '600', fontSize: 16, marginBottom: 6 },
  cardDuty: { fontSize: 15, marginBottom: 4 },
  cardLocation: { fontSize: 15, color: '#555' },

  button: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  approve: { backgroundColor: '#38c172' },
  request: { backgroundColor: '#e3922fff' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
