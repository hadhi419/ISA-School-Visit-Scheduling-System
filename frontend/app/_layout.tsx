// app/_layout.tsx
import { AuthProvider } from '@/AuthContext';
import { ScheduleProvider } from '@/isa/context/ScheduleContext';
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ScheduleProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ScheduleProvider>
    </AuthProvider>
  );
}
