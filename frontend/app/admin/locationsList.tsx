import api from '@/api/axiosInstance';
import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Location {
  id: number;
  name: string;
  category: 'SCHOOL' | 'DIVISION';
  address: string;
}

const LocationsList = () => {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/locations');
      setLocations(res.data.locations);
    } catch (err) {
      console.log(err);
      alert('Error fetching locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEditAddress('');
    setEditCategory('');
    setEditName('');
    fetchLocations();
  }, []);

  const handleEditClick = (loc: Location) => {
    setSelectedLocation(loc);
    setEditName(loc.name);
    setEditCategory(loc.category);
    setEditAddress(loc.address);
    setShowModal(true);
  };

  const saveEdit = async () => {
    if (!selectedLocation) return;

    if (!selectedLocation || !editCategory || !editAddress || !editName) {
      alert('All fields to should be filled');
      return;
    }
    try {
      const payload = {
        editLocation: selectedLocation.id,
        name: editName,
        category: editCategory,
        address: editAddress,
      };
      await api.post(`/locations/edit`, payload);

      setEditAddress('');
      setEditCategory('');
      setEditName('');
      alert('Location updated successfully!');
      setShowModal(false);
      fetchLocations();
    } catch (err) {
      console.log(err);
      alert('Error updating location.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          type="material"
          color="#fff"
          size={28}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>All Locations</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchLocations} />
        }
      >
        {locations.map((loc) => (
          <View key={loc.id} style={styles.card}>
            {/* Left: location icon */}
            <View style={styles.iconArea}>
              <Icon
                name="map-marker"
                type="material-community"
                color="#1976D2"
                size={28}
              />
            </View>

            {/* Middle: location info */}
            <View style={styles.infoArea}>
              <Text style={styles.name}>{loc.name}</Text>
              <Text style={styles.category}>{loc.category}</Text>
              {loc.address ? (
                <Text style={styles.address}>{loc.address}</Text>
              ) : null}
            </View>

            {/* Right: edit button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditClick(loc)}
            >
              <Icon
                name="pencil"
                type="material-community"
                color="#fff"
                size={24}
              />
            </TouchableOpacity>
          </View>
        ))}

        {locations.length === 0 && !loading && (
          <Text style={styles.emptyText}>No locations found.</Text>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.popup}>
            <Text style={modalStyles.title}>Edit Location</Text>

            <Text style={modalStyles.label}>Name</Text>
            <TextInput
              style={modalStyles.input}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={modalStyles.label}>Category</Text>
            <TextInput
              style={modalStyles.input}
              value={editCategory}
              onChangeText={setEditCategory}
            />

            <Text style={modalStyles.label}>Address</Text>
            <TextInput
              style={modalStyles.input}
              value={editAddress}
              onChangeText={setEditAddress}
            />

            <View style={modalStyles.actions}>
              <View style={{ width: '45%' }}>
                <Pressable
                  onPress={saveEdit}
                  style={[modalStyles.modalBtn, modalStyles.sendBtn]}
                >
                  <Text style={modalStyles.modalBtnText}>Save</Text>
                </Pressable>
              </View>
              <View style={{ width: '45%' }}>
                <Pressable
                  onPress={() => setShowModal(false)}
                  style={[modalStyles.modalBtn, modalStyles.cancelBtn]}
                >
                  <Text style={modalStyles.modalBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fb' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    textAlign: 'center',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  iconArea: {
    width: '10%',
    alignItems: 'center',
  },
  infoArea: {
    width: '75%',
    paddingLeft: 12,
  },
  editButton: {
    width: '15%',
    backgroundColor: '#1976D2',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginTop: 4,
  },
  address: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 50,
  },
});

const modalStyles = StyleSheet.create({
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
    color: '#1976D2',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f2f2f2',
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between', // puts space between buttons
    marginTop: 20,
    //flex: 2,
  },

  saveBtn: {
    backgroundColor: '#e3922fff',
    marginLeft: 8,
  },

  cancelBtn: {
    backgroundColor: 'rgb(156, 156, 156)',
    marginLeft: 8,
  },

  modalBtn: {
    height: 48,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  closeBtn: {
    backgroundColor: '#9e9e9e',
    marginRight: 8,
  },

  sendBtn: {
    backgroundColor: 'rgb(11, 186, 8)',
    marginLeft: 8,
  },

  modalBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default LocationsList;
