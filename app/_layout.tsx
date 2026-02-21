import { Stack, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function ProtectedLayout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const pin = await SecureStore.getItemAsync('userPin');
      setIsAuthenticated(!!pin);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}