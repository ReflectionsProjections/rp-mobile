import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { validateAuthToken } from '@/lib/auth';
import { api } from '@/api/api';
import LoadingScreenView from '@/components/loading/LoadingScreenView';

export default function LoadingScreen() {
  const router = useRouter();
  // guest=1 skips the auth check: guests have no JWT but still belong on home.
  const { guest } = useLocalSearchParams<{ guest?: string }>();

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (guest === '1') {
        router.replace('/(tabs)/home');
        return;
      }

      try {
        const jwt = await SecureStore.getItemAsync('jwt');

        if (jwt) {
          const isValid = await validateAuthToken();

          if (isValid) {
            const roles = await api.get('/auth/info').then((res) => res.data.roles);
            if (roles.length > 0) {
              router.replace('/(tabs)/home');
            } else {
              Alert.alert('Please sign in with a registered account!');
              router.replace('/(auth)/sign-in');
            }
          } else {
            await SecureStore.deleteItemAsync('jwt');
            router.replace('/(auth)/sign-in');
          }
        } else {
          router.replace('/(auth)/sign-in');
        }
      } catch (error) {
        router.replace('/(auth)/sign-in');
      }
    };

    setTimeout(() => {
      checkAuthStatus();
    }, 2000);
  }, [router, guest]);

  return <LoadingScreenView />;
}
