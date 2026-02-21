import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, usePathname } from 'expo-router';

export default function ProtectedLayout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const pin = await SecureStore.getItemAsync('userPin');
        const authenticated = !!pin;
        setIsAuthenticated(authenticated);
        
        // Navigation conditionnelle sans Redirect
        if (!authenticated && pathname !== '/') {
          router.replace('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Écran de chargement
  if (loading) {
    return null;
  }


  // Contenu protégé accessible uniquement si authentifié
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Vos écrans protégés ici */}
    </Stack>
  );
}
