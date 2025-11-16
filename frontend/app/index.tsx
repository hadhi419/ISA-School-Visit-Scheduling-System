import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

// Import Input and Button from the components folder
import Button from '../components/Button';
import Input from '../components/Input';

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Fake login function (replace with API call)
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

   try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });

    const { token } = response.data;

    // Save token locally
    await AsyncStorage.setItem('token', token);

    // Decode the token to get role or user info (optional)
    // For simplicity, here we just check the email
    let role: 'admin' | 'isa' | 'zde';
    if (email.includes('admin')) role = 'admin';
    else if (email.includes('isa')) role = 'isa';
    else role = 'zde';

    // Navigate based on role
    switch (role) {
      case 'admin':
        router.replace('/admin/adminDashboard'); 
        break;
      case 'isa':
        router.replace('/isa/isaDashboard');
        break;
      case 'zde':
        router.replace('/zde/zdeDashboard');
        break;
      default:
        Alert.alert('Error', 'Invalid user role');
    }
  } catch (err: any) {
    console.log(err.response?.data || err.message);
    Alert.alert('Login Failed', err.response?.data?.error || 'Something went wrong');
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

      <Button text="Login" onPress={handleLogin} />
      
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
