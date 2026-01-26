import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axiosInstance';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/AuthContext';

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
  if (status === 'PENDING') {
    return { icon: 'hourglass', color: '#ff9800', label: 'Pending Approval' };
  } else if (status === 'ADE_APPROVED') {
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
  const { icon, color, label } = getStatusProps(status);

  // Only Pending Approval cards are clickable
  const isClickable = label === 'Pending Approval';

  const handleCardPress = () => {
    if (!isClickable) return;

    //console.log('IDDDDDDDDDDD', visit.isa_id);
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
            <MaterialCommunityIcons name="abacus" size={16} color={color} />
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Clear the token
      router.replace('/'); // Redirect to root page
    } catch (err) {
      console.error('Error during logout', err);
    }
  };

  const { isLoggedIn, name } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/approvals?month=February');
        console.log('Loaded data:', res);

        // Suppose these are the roles you want to show
        const allowedRoles = ['ISA'];

        // Filter visits from API response
        const filteredVisits = res.data.visits.filter(
          (visit: { role: string }) => allowedRoles.includes(visit.role)
        );

        setVisits(filteredVisits);

        console.log('Filtered Visits:', filteredVisits);
      } catch (err) {
        console.error('Error loading data', err);
      }
    };

    if (!isLoggedIn) {
      router.replace('/');
    }

    loadData();
  }, []);

  const handleMonitorLocationsPress = () => {
    router.push('/higherOfficialCommonScreens/locationMonitoring');
  };
  const hadndleMonitorISAPress = () => {
    router.push('/higherOfficialCommonScreens/isaMonitoring');
  };

  const handlePrintDocument = () => {
    router.push('/higherOfficialCommonScreens/pdfGenerator');
  };

  const handleApprovalPress = () => {
    router.push('/higherOfficialCommonScreens/approvalScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* BLUE HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={28} color="#eee" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Welcome, {name}</Text>
          {/* <MaterialCommunityIcons
            name="account-circle"
            size={28}
            color="#eee"
          /> */}
          <MaterialCommunityIcons name="menu" size={28} color="#eee" />
        </View>

        <View style={styles.actionGrid}>
          {/* <TouchableOpacity
            style={styles.actionCard}
            onPress={handleApprovalPress}
          >
            <MaterialCommunityIcons
              name="calendar-account"
              size={36}
              color="#e9bf00"
            />
            <Text style={styles.actionTitle}>Approve Schedules</Text>
            <Text style={styles.actionSub}>
              Approve or ask Revisions on Schedules
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleMonitorLocationsPress}
          >
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={36}
              color="#1976D2"
            />
            <Text style={styles.actionTitle}>Monitor Locations</Text>
            <Text style={styles.actionSub}>
              View and track school visit locations
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={hadndleMonitorISAPress}
          >
            <MaterialCommunityIcons
              name="account-group"
              size={36}
              color="#2e7d32"
            />
            <Text style={styles.actionTitle}>Monitor ISAs</Text>
            <Text style={styles.actionSub}>
              Review ISA assignments and progress
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handlePrintDocument}
          >
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={36}
              color="#c62828"
            />
            <Text style={styles.actionTitle}>Generate Reports</Text>
            <Text style={styles.actionSub}>
              Download monthly ISA PDF reports
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/commonScreens/advancedProgram')}
          >
            <MaterialCommunityIcons
              name="calendar-badge"
              size={36}
              color="#ddc105"
            />
            <Text style={styles.actionTitle}>Advanced Program</Text>
            <Text style={styles.actionSub}>
              Prepare the schedule for next month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/commonScreens/amendedProgram')}
          >
            <MaterialCommunityIcons
              name="calendar-check"
              size={36}
              color="#04745a"
            />
            <Text style={styles.actionTitle}>Amended Program</Text>
            <Text style={styles.actionSub}>Make Amendments</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.programActions}>
          <Button
            title="Advanced Program"
            buttonStyle={[styles.programBtn, styles.advancedProgram]}
            titleStyle={[styles.programBtnTitle, styles.darkText]}
            onPress={() => router.push('/commonScreens/advancedProgram')}
          />
          <Button
            title="Amended Program"
            buttonStyle={[styles.programBtn, styles.amendedProgram]}
            titleStyle={[styles.programBtnTitle, styles.darkText]}
            onPress={() => router.push('/commonScreens/amendedProgram')}
          />
        </View> */}

        <Text style={styles.sectionTitle}>
          Schedule Approvals ({currentMonth}) ({currentMonth})
        </Text>

        <View style={styles.cardsContainer}>
          {visits.map((v) => (
            <EmployeeStatusCard key={v.isa_id} visit={v} />
          ))}
        </View>
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

  actionGrid: {
    paddingHorizontal: 16,
    marginTop: 24,
  },

  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  actionTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  actionSub: {
    marginTop: 6,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
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

  programActions: { paddingHorizontal: 16, marginTop: 20, gap: 12 },
  programBtn: { paddingVertical: 18, borderRadius: 12, elevation: 3 },
  advancedProgram: { backgroundColor: '#d2c319ff' },
  amendedProgram: { backgroundColor: '#068a74ff' },
  programBtnTitle: { fontSize: 16, fontWeight: '700', color: '#ffffffff' },

  darkText: { color: '#ffffffff' },
});

export default HigherOfficialDashboard;
