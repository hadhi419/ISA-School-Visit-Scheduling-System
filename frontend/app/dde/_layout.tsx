import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { Slot } from 'expo-router';

export default function DDELayout() {
  return (
    <ProtectedLayout allowedRoles={['DDE']}>
      <Slot />
    </ProtectedLayout>
  );
}
