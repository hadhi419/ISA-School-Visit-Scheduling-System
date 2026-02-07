import { useAuth } from '@/AuthContext';
import AppAlert from '@/components/AppAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const Login: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    message: '',
    title: 'Error',
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'Please enter both email and password',
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        'https://isa-school-visit-scheduling-system.fly.dev/api/auth/login',
        {
          email,
          password,
        }
      );

      const { token } = response.data;

      const decoded: any = jwtDecode(token);
      const userRole = decoded.role;

      await AsyncStorage.setItem('token', token);
      await login(token);

      // Navigate based on role
      switch (userRole) {
        case 'ADMIN':
          router.replace('/admin/adminDashboard');
          break;
        case 'ISA':
          router.replace('/isa/isaDashboard');
          break;
        case 'ZDE':
          router.replace('/zde/zdeDashboard');
          break;
        case 'DDE':
          router.replace('/dde/ddeDashboard');
          break;
        case 'ADE':
          router.replace('/ade/adeDashboard');
          break;
        default:
          setAlert({
            visible: true,
            title: 'Error',
            message: 'Invalid User Role',
          });
      }
    } catch (err: any) {
      setAlert({
        visible: true,
        title: 'Error',
        message: err.response?.data?.error || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={() =>
          setAlert({ visible: false, message: '', title: 'Error' })
        }
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
