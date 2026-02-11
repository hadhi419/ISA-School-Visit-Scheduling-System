import { AuthProvider } from '@/AuthContext';
import { ScheduleProvider } from '@/isa/context/ScheduleContext';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { LoadingProvider } from '../LoadingContext';

const paperTheme = {
  ...MD3LightTheme,
  dark: false,
};

export default function RootLayout() {
  const router = useRouter();

  return (
    <PaperProvider theme={paperTheme}>
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
              <Stack.Screen name="index" />
              <Stack.Screen name="profile" />
            </Stack>
          </LoadingProvider>
        </ScheduleProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
