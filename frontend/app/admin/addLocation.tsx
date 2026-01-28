import api from '@/api/axiosInstance';
import { Button, Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
const AddLocation = () => {
  const router = useRouter();

  const [locationName, setName] = useState('');
  const [category, setCategory] = useState('SCHOOL'); // default SCHOOL
  const [address, setAddress] = useState('');

  const createLocation = async () => {
    try {
      const payload = { locationName, category, address };

      const response = await api.post('/locations/addLocation', payload);

      const data = response.data;

      console.log(data);
      alert('Location Created Successfully!');

      setAddress('');
      setCategory('SCHOOl');
      setName('');
    } catch (error) {
      console.log(error);
      alert('Error creating location.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            type="material"
            color="#fff"
            size={28}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Add New Location</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Location Name</Text>
          <TextInput
            style={styles.input}
            value={locationName}
            onChangeText={setName}
            placeholder="Enter location name"
          />

          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="SCHOOL or DIVISION"
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
          />

          <Button
            title="Create Location"
            onPress={createLocation}
            buttonStyle={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fb' },

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
    flex: 1,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
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
  button: {
    backgroundColor: '#1976D2',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
});

export default AddLocation;
