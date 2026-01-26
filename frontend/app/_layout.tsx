// frontend/app/_layout.tsx

import { AuthProvider } from '@/AuthContext';
import { ScheduleProvider } from '@/isa/context/ScheduleContext';
import { Stack } from 'expo-router';
import React from 'react';
// ADD THIS LINE
import { LoadingProvider } from '../LoadingContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ScheduleProvider>
        {/* ADD THIS WRAPPER */}
        <LoadingProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </LoadingProvider>
        {/* END WRAPPER */}
      </ScheduleProvider>
    </AuthProvider>
  );
}
