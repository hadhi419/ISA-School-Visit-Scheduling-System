import { useAuth } from '@/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon } from '@rneui/themed';
import { router } from 'expo-router';
import { FC } from 'react';
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

const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('token'); // Clear the token
    router.replace('/'); // Redirect to root page
  } catch (err) {
    console.error('Error during logout', err);
  }
};

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
  const { name } = useAuth();
  console.log('ISA Dashboard - User Name:', name);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Icon name="menu" type="material" color="#E0E0E0" size={28} />
          <Text style={styles.headerTitle}>Good Morning, {name}</Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={28} color="#eee" />
          </TouchableOpacity>

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
            onPress={() => router.push('/isa/advancedProgram')}
          />
          <Button
            title="Amended Program"
            buttonStyle={[styles.programBtn, styles.amendedProgram]}
            titleStyle={[styles.programBtnTitle, styles.darkText]}
            onPress={() => router.push('/isa/amendedProgram')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
