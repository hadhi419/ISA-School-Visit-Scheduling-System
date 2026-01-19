import { useAuth } from '@/AuthContext';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
export default function DDELayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, role, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    if (loading || checked) return;

    if (!isLoggedIn || role !== 'ADE') {
      router.replace('/');
    }

    setChecked(true);
  }, [loading, isLoggedIn, role]);

  if (loading || !checked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }}>{children}</Stack>;
}
