import { AuthProvider } from '@/AuthContext';
import { ScheduleProvider } from '@/isa/context/ScheduleContext';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { LoadingProvider } from '../LoadingContext';

import { registerTranslation } from 'react-native-paper-dates';

registerTranslation('en', {
  save: 'Save',
  selectSingle: 'Select date',
  selectMultiple: 'Select dates',
  selectRange: 'Select period',

  notAccordingToDateFormat: (inputFormat: string) =>
    `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date: string) => `Must be later than ${date}`,
  mustBeLowerThan: (date: string) => `Must be earlier than ${date}`,
  mustBeBetween: (startDate: string, endDate: string) =>
    `Must be between ${startDate} and ${endDate}`,
  dateIsDisabled: 'Day is not allowed',

  previous: 'Previous',
  next: 'Next',
  typeInDate: 'Type in date',
  pickDateFromCalendar: 'Pick date from calendar',
  close: 'Close',

  // ✅ REQUIRED in newer versions
  hour: 'Hour',
  minute: 'Minute',
});

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
