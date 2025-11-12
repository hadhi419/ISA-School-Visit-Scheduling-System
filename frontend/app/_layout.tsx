import { Stack } from 'expo-router';
import { ScheduleProvider } from './isa/context/ScheduleContext';

export default function RootLayout() {
  return (
    <ScheduleProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ScheduleProvider>
  );
}
