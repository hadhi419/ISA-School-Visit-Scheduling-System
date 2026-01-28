import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

const AdminDashboard = () => {
  const router = useRouter();

  const [showProfile, setShowProfile] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <MaterialCommunityIcons
          name="account"
          size={28}
          color="#E0E0E0"
          onPress={() => setShowProfile(true)}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}

        <Modal visible={showProfile} transparent animationType="fade">
          <View style={popupStyles.overlay}>
            <View style={popupStyles.popup}>
              <ProfileComponent onClose={() => setShowProfile(false)} />
            </View>
          </View>
        </Modal>

        {/* Action Cards */}
        <View style={styles.actionGrid}>
          {/* Add User */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/admin/addUser')}
          >
            <MaterialCommunityIcons
              name="account-plus"
              size={36}
              color="#42A5F5"
            />
            <Text style={styles.actionTitle}>Add User</Text>
            <Text style={styles.actionSub}>Create new user accounts</Text>
          </TouchableOpacity>

          {/* View Users */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/admin/usersList')}
          >
            <MaterialCommunityIcons
              name="account-group"
              size={36}
              color="#1E88E5"
            />
            <Text style={styles.actionTitle}>View Users</Text>
            <Text style={styles.actionSub}>See all registered users</Text>
          </TouchableOpacity>

          {/* Add Location */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/admin/addLocation')}
          >
            <MaterialCommunityIcons name="map-plus" size={36} color="#66BB6A" />
            <Text style={styles.actionTitle}>Add Location</Text>
            <Text style={styles.actionSub}>Add new school locations</Text>
          </TouchableOpacity>

          {/* View Locations */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/admin/locationsList')}
          >
            <MaterialCommunityIcons
              name="map-marker-multiple"
              size={36}
              color="#43A047"
            />
            <Text style={styles.actionTitle}>View Locations</Text>
            <Text style={styles.actionSub}>See all school locations</Text>
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
    justifyContent: 'space-between',
    backgroundColor: '#1976D2',
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

  actionGrid: {
    paddingHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  actionCard: {
    width: '100%', // 2 cards per row
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
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
    textAlign: 'center',
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

export default AdminDashboard;
