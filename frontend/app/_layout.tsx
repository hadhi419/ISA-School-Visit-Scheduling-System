import { AuthProvider } from '@/AuthContext';
import { ScheduleProvider } from '@/isa/context/ScheduleContext';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { LoadingProvider } from '../LoadingContext';

export default function RootLayout() {
  const router = useRouter();

  return (
    <AuthProvider>
      <ScheduleProvider>
        <LoadingProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => router.push('/profile')}
                  style={{ marginRight: 15 }}
                >
                  <Text style={{ fontSize: 18 }}>☰</Text>
                </TouchableOpacity>
              ),
            }}
          >
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="profile" options={{ title: 'User Profile' }} />
          </Stack>
        </LoadingProvider>
      </ScheduleProvider>
    </AuthProvider>
  );
}
