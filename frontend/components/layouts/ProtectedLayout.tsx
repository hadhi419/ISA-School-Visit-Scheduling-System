import { useAuth } from '@/AuthContext';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedLayout({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { isLoggedIn, role, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn || !role || !allowedRoles.includes(role)) {
      router.replace('/'); // redirect to login/home if not allowed
    } else {
      setChecked(true);
    }
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
