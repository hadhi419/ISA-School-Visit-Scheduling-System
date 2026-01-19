import { useAuth } from '@/AuthContext';
import { Icon } from '@rneui/base';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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

//const DDE_USER_ID = 6;

const ScheduleDetailPage = ({ route }: any) => {
  const router = useRouter();
  const isa_id = route?.params?.isa_id ?? 5;

  const [detail, setDetail] = useState<VisitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');

  const { id } = useAuth();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/approvals/visitDetail/${isa_id}`);
        const json = res.data as VisitDetail;

        json.schedule = json.schedule.map((item: any, index: number) => ({
          visit_id: item.visit_id ?? index + 1,
          date: item.date,
          duty: item.duty,
          location: item.location,
        }));

        setDetail(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isa_id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await api.post(`/approvals/dde/approve/${isa_id}`, {
        approved_by: id,
      });

      if (res.data.success) {
        Alert.alert('Success', 'Schedule approved');
        router.replace('/dde/ddeDashboard');
      } else {
        Alert.alert('Error', res.data.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Server error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestRevisionWithComment = async (commentText: string) => {
    setActionLoading(true);
    try {
      const res = await api.post(`/approvals/dde/reject/${isa_id}`, {
        approved_by: id,
        comment: commentText,
      });

      if (res.data.success) {
        Alert.alert('Success', 'Revision requested successfully');
        router.replace('/dde/ddeDashboard');
      } else {
        Alert.alert('Error', res.data.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Server error');
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

  if (!detail) return <Text>No schedule found</Text>;

  return (
    <>
      {/* Comment Modal */}
      <Modal visible={showCommentModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Request Revision</Text>

            <TextInput
              placeholder="Enter revision comment..."
              value={comment}
              onChangeText={setComment}
              multiline
              style={styles.commentInput}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, styles.closeBtn]}
                onPress={() => {
                  setShowCommentModal(false);
                  setComment('');
                }}
              >
                <Text style={styles.modalBtnText}>Close</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBtn, styles.sendBtn]}
                onPress={() => {
                  if (!comment.trim()) {
                    Alert.alert('Error', 'Please enter a comment');
                    return;
                  }
                  setShowCommentModal(false);
                  handleRequestRevisionWithComment(comment);
                  setComment('');
                }}
              >
                <Text style={styles.modalBtnText}>Ask Revision</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main Screen */}
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            type="material"
            color="#fff"
            size={28}
            onPress={() => router.replace('/dde/ddeDashboard')}
          />
          <Text style={styles.headerTitle}>Schedule for {detail.isa_name}</Text>
          <View style={{ width: 28 }} />
        </View>

        <FlatList
          data={detail.schedule}
          keyExtractor={(item) => item.visit_id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardDate}>Date: {item.date}</Text>
              <Text>Duty: {item.duty}</Text>
              <Text>Location: {item.location}</Text>
            </View>
          )}
        />

        <Pressable
          style={[styles.button, styles.approve]}
          onPress={handleApprove}
          disabled={actionLoading}
        >
          <Text style={styles.buttonText}>Approve Monthly Schedule</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.request]}
          onPress={() => setShowCommentModal(true)}
          disabled={actionLoading}
        >
          <Text style={styles.buttonText}>Request Revisions</Text>
        </Pressable>
      </SafeAreaView>
    </>
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },

  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  closeBtn: {
    backgroundColor: '#9e9e9e',
    marginRight: 8,
  },

  sendBtn: {
    backgroundColor: '#e3922fff',
    marginLeft: 8,
  },

  modalBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
