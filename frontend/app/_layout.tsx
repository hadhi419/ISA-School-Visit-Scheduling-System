// app/_layout.tsx
import { Stack } from 'expo-router';
import { ScheduleProvider } from '../isa/context/ScheduleContext';

export default function Layout() {
  return (
    <ScheduleProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ScheduleProvider>
  );
}
