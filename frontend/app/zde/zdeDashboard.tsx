import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';

import api from '../../api/axiosInstance';

import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ProfileComponent from '@/components/ProfileComponent';

import { useAuth } from '@/AuthContext';
import { useLoading } from '../../LoadingContext';

// Images
const SUPERVISOR_IMAGE = require('@/assets/avatar.png');

const FOOTER_LOGO = { uri: 'https://via.placeholder.com/20' };

interface VisitResponseItem {
  isa_id: number;
  isa_name: string;
  status: string;
  scheduleSubmitted: boolean;
}

const getStatusProps = (status: string) => {
  if (status === 'DDE_APPROVED') {
    return { icon: 'hourglass', color: '#ff9800', label: 'Pending Approval' };
  } else if (status === 'ZDE_APPROVED') {
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

// const EmployeeStatusCard = ({ visit }: { visit: VisitResponseItem }) => {
//   const router = useRouter();

//   const { status, scheduleSubmitted, isa_name, isa_id } = visit;
//   const { icon, color, label } = getStatusProps(status);

//   // Only Pending Approval cards are clickable
//   const isClickable = label === 'Pending Approval';

//   const handleCardPress = () => {
//     if (!isClickable) return;
//     router.push(`./scheduleDetails/${visit.isa_id}`);
//   };

//   return (
//     <TouchableOpacity
//       onPress={handleCardPress}
//       activeOpacity={isClickable ? 0.8 : 1}
//     >
//       <View style={[styles.card, !isClickable && { opacity: 0.5 }]}>
//         <View style={styles.cardHeader}>
//           <Image source={SUPERVISOR_IMAGE} style={styles.cardProfileImage} />
//           <View style={{ flex: 1 }}>
//             <Text style={styles.nameText}>{isa_name}</Text>
//             <Text style={styles.isaText}>ISA</Text>
//           </View>
//           <View
//             style={[styles.statusBubble, { backgroundColor: color + '22' }]}
//           >
//             <MaterialCommunityIcons name="abacus" size={16} color={color} />
//             <Text style={[styles.statusLabel, { color, marginLeft: 6 }]}>
//               {label}
//             </Text>
//           </View>
//         </View>
//         <View style={styles.statusRow}>
//           <StatusItem
//             label={scheduleSubmitted ? 'Schedule Submitted' : 'No Schedule'}
//             isSuccess={scheduleSubmitted}
//           />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

const HigherOfficialDashboard = () => {
  const currentMonth = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1); // Go to next month
    return date.toLocaleString('default', { month: 'long' });
  }, []);

  const [visits, setVisits] = useState<VisitResponseItem[]>([]);
  const { id, isLoggedIn, logout } = useAuth();
  const { setLoading } = useLoading();

  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }
    const loadData = async () => {
      const minTime = 300;
      const start = Date.now();
      setLoading(true);

      try {
        const res = await api.get('/approvals?month=February');
        //console.log('Loaded data:', res);
        setVisits(res.data.visits);
      } catch (err) {
        //console.error('Error loading data', err);
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

    loadData();

    //console.log(id);
  }, []);

  const router = useRouter();
  const handleMonitorLocationsPress = () => {
    router.push('/common/locationMonitoring');
  };
  const hadndleMonitorISAPress = () => {
    router.push('/common/isaMonitoring');
  };

  const handlePrintDocument = () => {
    router.push('/common/pdfGenerator');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* <TouchableOpacity
          onPress={() => {
            logout();
            router.replace('/');
          }}
        >
          <MaterialCommunityIcons name="logout" size={28} color="#eee" />
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Welcome, ZDE</Text>
        <MaterialCommunityIcons
          name="account"
          size={28}
          color="#E0E0E0"
          onPress={() => setShowProfile(true)}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* BLUE HEADER */}

        <Modal visible={showProfile} transparent animationType="fade">
          <View style={popupStyles.overlay}>
            <View style={popupStyles.popup}>
              <ProfileComponent onClose={() => setShowProfile(false)} />
            </View>
          </View>
        </Modal>
        {/* <Text style={styles.sectionTitle}>
          ISA Monthly Visit Status ({currentMonth})
        </Text> */}

        {/* <View style={styles.cardsContainer}>
          {visits.map((v) => (
            <EmployeeStatusCard key={v.isa_id} visit={v} />
          ))}
        </View> */}

        <View style={styles.actionGrid}>
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
              Review TA / Subject Directors / DDE assignments and progress
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
              Download monthly TA PDF reports
            </Text>
          </TouchableOpacity>
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
});

const popupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d32f2f',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editBtn: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeBtn: {
    backgroundColor: '#9e9e9e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default HigherOfficialDashboard;
