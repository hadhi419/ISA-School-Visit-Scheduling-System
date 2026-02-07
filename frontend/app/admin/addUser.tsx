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
import AppAlert from '@/components/AppAlert';
import api from '@/api/axiosInstance';
import { Button, IconButton } from 'react-native-paper';

const AddUser = () => {
  const router = useRouter();

  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('ISA');

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    title: 'Alert',
    message: '',
  });

  const createUser = async () => {
    if (!full_name || !email || !password || !phone || !role) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'Please fill all fields',
      });
      return;
    }

    try {
      setLoading(true);

      const payload = { full_name, email, password, phone, role };
      await api.post('/auth/register', payload);

      setEmail('');
      setFullName('');
      setPhone('');
      setRole('ISA');
      setPassword('');

      setAlert({
        visible: true,
        title: 'Success',
        message: 'User created successfully!',
      });
    } catch (error) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'Error creating user.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={() =>
          setAlert({ visible: false, title: 'Alert', message: '' })
        }
      />
      <View style={styles.header}>
        <IconButton
          icon="arrow-left" // MaterialCommunityIcons name
          iconColor="#fff" // must use iconColor instead of color
          size={28}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Add New User</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}

        {/* Card with input fields */}
        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={full_name}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Role</Text>
          <TextInput
            style={styles.input}
            value={role}
            onChangeText={setRole}
            placeholder="ISA, ADE, DDE, ZDE, ADMIN"
          />

          <Button
            mode="contained"
            onPress={createUser}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create User'}
          </Button>
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

export default AddUser;
