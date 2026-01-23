import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { Slot } from 'expo-router';

export default function ZDELayout() {
  return (
    <ProtectedLayout allowedRoles={['ZDE']}>
      <Slot />
    </ProtectedLayout>
  );
}
