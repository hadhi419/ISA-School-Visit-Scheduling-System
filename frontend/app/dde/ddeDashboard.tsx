import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axiosInstance';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Images
const SUPERVISOR_IMAGE = {
  uri: 'https://randomuser.me/api/portraits/men/75.jpg',
};

const FOOTER_LOGO = { uri: 'https://via.placeholder.com/20' };

interface VisitResponseItem {
  isa_id: number;
  isa_name: string;
  status: string;
  scheduleSubmitted: boolean;
}

const getStatusProps = (status: string) => {
  if (status === 'ADE_APPROVED') {
    return { icon: 'hourglass', color: '#ff9800', label: 'Pending Approval' };
  } else if (status === 'DDE_APPROVED') {
    return { icon: 'check-circle', color: '#38c172', label: 'Approved' };
  } else {
    return { icon: 'pencil', color: '#f5c407', label: 'In Process' };
  }
};

const StatusItem = ({
  label,
  isSuccess,
}: {
  label: string;
  isSuccess: boolean;
}) => (
  <View style={styles.statusItem}>
    <MaterialCommunityIcons
      name={isSuccess ? 'check-circle' : 'close-circle'}
      size={18}
      color={isSuccess ? '#38c172' : '#e3342f'}
      style={{ marginRight: 6 }}
    />
    <Text style={styles.statusText}>{label}</Text>
  </View>
);

const EmployeeStatusCard = ({ visit }: { visit: VisitResponseItem }) => {
  const router = useRouter();

  const { status, scheduleSubmitted, isa_name, isa_id } = visit;
  console.log(status);
  const { icon, color, label } = getStatusProps(status);

  // Only Pending Approval cards are clickable
  const isClickable = label === 'Pending Approval';

  const handleCardPress = () => {
    if (!isClickable) return;
    router.push(`./scheduleDetails/${visit.isa_id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      activeOpacity={isClickable ? 0.8 : 1}
    >
      <View style={[styles.card, !isClickable && { opacity: 0.5 }]}>
        <View style={styles.cardHeader}>
          <Image source={SUPERVISOR_IMAGE} style={styles.cardProfileImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.nameText}>{isa_name}</Text>
            <Text style={styles.isaText}>ISA</Text>
          </View>
          <View
            style={[styles.statusBubble, { backgroundColor: color + '22' }]}
          >
            <MaterialCommunityIcons name={icon} size={16} color={color} />
            <Text style={[styles.statusLabel, { color, marginLeft: 6 }]}>
              {label}
            </Text>
          </View>
        </View>
        <View style={styles.statusRow}>
          <StatusItem
            label={scheduleSubmitted ? 'Schedule Submitted' : 'No Schedule'}
            isSuccess={scheduleSubmitted}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HigherOfficialDashboard = () => {
  const currentMonth = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1); // Go to next month
    return date.toLocaleString('default', { month: 'long' });
  }, []);

  const [visits, setVisits] = useState<VisitResponseItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/approvals?month=February');

        setVisits(res.data.visits);
      } catch (err) {
        console.error('Error loading data', err);
      }
    };

    loadData();
  }, []);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Clear the token
      router.replace('/'); // Redirect to root page
    } catch (err) {
      console.error('Error during logout', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* BLUE HEADER */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={28} color="#eee" />
          <Text style={styles.headerTitle}>Welcome, DDE</Text>
          {/* <MaterialCommunityIcons
            name="account-circle"
            size={28}
            color="#eee"
          /> */}
          <TouchableOpacity onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={28} color="#eee" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          ISA Monthly Visit Status ({currentMonth})
        </Text>

        <View style={styles.cardsContainer}>
          {visits.map((v) => (
            <EmployeeStatusCard key={v.isa_id} visit={v} />
          ))}
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Reports</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fb' },
  scrollContent: { paddingBottom: 40 },

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

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  cardsContainer: { paddingHorizontal: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardProfileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  nameText: { fontSize: 16, fontWeight: '600', color: '#333' },
  isaText: { fontSize: 12, color: '#777' },

  statusBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusLabel: { fontSize: 14, fontWeight: '700' },

  statusRow: { marginTop: 10 },
  statusItem: { flexDirection: 'row', alignItems: 'center' },
  statusText: { fontSize: 13, color: '#555' },

  button: {
    backgroundColor: '#068a74',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  footer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { fontSize: 12, color: '#888', marginRight: 6 },
  logo: { width: 20, height: 20 },
});

export default HigherOfficialDashboard;
