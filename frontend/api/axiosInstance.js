import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.20.10.3:5000/api',
  //baseURL: 'https://isa-school-visit-scheduling-system.onrender.com/api',
  //baseURL: 'https://isa-school-visit-scheduling-system.fly.dev/api',
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // //console.log('Calling API:', config.method, config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
