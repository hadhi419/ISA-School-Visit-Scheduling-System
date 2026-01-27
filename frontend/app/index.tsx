import { useAuth } from '@/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
// Import Input and Button from the components folder

import Button from '../components/Button';
import Input from '../components/Input';

const Login: React.FC = () => {
  const { login, role } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const response = await axios.post(
        'http://172.20.10.3:5000/api/auth/login',
        {
          email,
          password,
        }
      );

      const { token } = response.data;
      console.log('Received token:', token);

      const decoded: any = jwtDecode(token);
      const userRole = decoded.role;
      await AsyncStorage.setItem('token', token);
      // Navigate first based on decoded token

      // Update context state
      await login(token);

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
          router.push('/ade/adeDashboard');
          break;
        default:
          Alert.alert('Error', 'Invalid user role');
          return;
      }
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert(
        'Login Failed',
        err.response?.data?.error || 'Something went wrong'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button text="Login" onPress={handleLogin} style={undefined} />
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
});

export default Login;
