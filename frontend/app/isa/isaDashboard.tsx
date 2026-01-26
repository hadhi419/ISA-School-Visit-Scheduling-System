import api from '@/api/axiosInstance';
import { useAuth } from '@/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';
import { FC, useEffect, useState } from 'react';
import { Modal, Pressable } from 'react-native';

import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface Visit {
  id: string;
  location: string;
  time: string;
  image: string;
}

interface VisitCardProps extends Visit {}

interface DashboardProps {}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffffff' },
  scrollContent: { paddingBottom: 20 },

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

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555454ff',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  visitsCarousel: { paddingLeft: 16 },
  visitCard: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardImage: { width: '100%', height: 180, backgroundColor: '#ccc' },
  cardContent: { padding: 12 },
  cardLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardTime: { fontSize: 14, color: '#555', marginBottom: 10 },

  programActions: { paddingHorizontal: 16, marginTop: 20, gap: 12 },
  programBtn: { paddingVertical: 18, borderRadius: 12, elevation: 3 },
  advancedProgram: { backgroundColor: '#d2c319ff' },
  amendedProgram: { backgroundColor: '#068a74ff' },
  programBtnTitle: { fontSize: 16, fontWeight: '700', color: '#ffffffff' },

  darkText: { color: '#ffffffff' },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffad8c',
    padding: 12,
    marginHorizontal: 3,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#ff7b29',
    marginTop: 5,
  },
  warningIcon: { fontSize: 20, marginRight: 10 },
  warningText: { flex: 1, fontSize: 14, color: '#000', textAlign: 'center' },
  calendarContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
  },
});
const VISITS_DATA: Visit[] = [
  {
    id: '1',
    location: 'Sundharapuram GTMS',
    time: 'Mon, 10th Nov, 10:00 AM',
    image:
      'https://via.placeholder.com/320x180/4C72B0/FFFFFF?text=Sundharapuram',
  },
  {
    id: '2',
    location: 'Kanagapuram School',
    time: 'Wed, 12th Nov, 11:30 AM',
    image: 'https://via.placeholder.com/320x180/66BB6A/FFFFFF?text=Kanagapuram',
  },
  {
    id: '3',
    location: 'New Location Site',
    time: 'Fri, 14th Nov, 2:00 PM',
    image: 'https://via.placeholder.com/320x180/FFC107/FFFFFF?text=New+Site',
  },
];

// const handleLogout = async (logout: () => Promise<void>) => {
//   try {
//     //await AsyncStorage.removeItem('token'); // Clear the token

//     logout();
//     router.replace('/'); // Redirect to root page
//   } catch (err) {
//     console.error('Error during logout', err);
//   }
// };

const VisitCard: FC<VisitCardProps> = ({ location, time, image }) => (
  <View style={styles.visitCard}>
    <Image source={{ uri: image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardLocation}>{location}</Text>
      <Text style={styles.cardTime}>{time}</Text>
      <Button
        title="View Details"
        buttonStyle={{
          backgroundColor: '#4C72B0',
          borderRadius: 8,
        }}
        titleStyle={{ fontSize: 16, fontWeight: '600' }}
        onPress={() => console.log(`Viewing details for ${location}`)}
      />
    </View>
  </View>
);

const Dashboard: FC<DashboardProps> = () => {
  const [notification, setNotification] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false);

  const { name, logout, id, isLoggedIn } = useAuth();
  console.log('ISA Dashboard - User Name:', name);

  //const [Notifications, setNotifications] = useState<string>('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/');
    }

    const fetchNotifications = async () => {
      try {
        const response = await api.get(`/approvals/rejections/latest/${id}`);
        setNotification(response.data?.rejection?.comment || '');
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          {/* <Icon name="menu" type="material" color="#E0E0E0" size={28} /> */}
          <TouchableOpacity
            onPress={() => {
              logout();
              router.replace('/');
            }}
          >
            <MaterialCommunityIcons name="logout" size={28} color="#eee" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Good Morning, {name}</Text>

          {notification.length > 0 && (
            <TouchableOpacity onPress={() => setShowPopup(true)}>
              <MaterialCommunityIcons
                name="bell-alert"
                size={26}
                color={notification.length > 0 ? '#ffea00' : '#eee'}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          )}

          {/* <Icon name="person" type="material" color="#E0E0E0" size={28} /> */}
        </View>

        <Text style={styles.sectionTitle}>Your Upcoming Visits</Text>

        <FlatList<Visit>
          data={VISITS_DATA}
          renderItem={({ item }) => <VisitCard {...item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.visitsCarousel}
          pagingEnabled
        />

        <View style={styles.programActions}>
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
        </View>
      </ScrollView>
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={popupStyles.overlay}>
          <View style={popupStyles.popup}>
            <Text style={popupStyles.title}>Schedule Rejected</Text>

            <Text style={popupStyles.message}>{notification}</Text>

            <View style={popupStyles.actions}>
              <Pressable
                style={popupStyles.editBtn}
                onPress={() => {
                  setShowPopup(false);
                  router.push('/commonScreens/advancedProgram');
                }}
              >
                <Text style={popupStyles.btnText}>Edit Schedule</Text>
              </Pressable>

              <Pressable
                style={popupStyles.closeBtn}
                onPress={() => setShowPopup(false)}
              >
                <Text style={popupStyles.btnText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Dashboard;

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
