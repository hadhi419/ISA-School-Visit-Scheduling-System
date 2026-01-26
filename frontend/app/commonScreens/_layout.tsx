import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { Slot } from 'expo-router';

export default function commonLayout() {
  return (
    <ProtectedLayout allowedRoles={['ADE', 'DDE', 'ISA']}>
      <Slot />
    </ProtectedLayout>
  );
}
