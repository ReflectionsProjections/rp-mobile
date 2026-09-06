import '@/global.css';
import { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/api/api';

// Handles the magic-link universal link:
// https://reflectionsprojections.org/auth/mobile/login?token=...
export default function MagicLinkLogin() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [failed, setFailed] = useState(false);
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (verifyingRef.current) {
      return;
    }
    verifyingRef.current = true;

    const verify = async () => {
      try {
        if (!token) {
          throw new Error('This sign-in link is missing its token.');
        }
        const response = await api.post('/auth/magic-links/verify', {
          token,
          client: 'mobile',
        });
        await SecureStore.setItemAsync('jwt', response.data.token);
        if (__DEV__) {
          console.log('[JWT]', response.data.token);
        }

        const roles = await api.get('/auth/info').then((res) => res.data.roles);
        if (roles.length > 0) {
          router.replace('/(auth)/loading');
        } else {
          await SecureStore.deleteItemAsync('jwt');
          Alert.alert('Make sure to register for the event first!');
          router.replace('/(auth)/sign-in');
        }
      } catch (error: any) {
        setFailed(true);
        const invalidToken = error?.response?.status === 401;
        Alert.alert(
          'Sign-In Link Failed',
          invalidToken
            ? 'This sign-in link is invalid or has expired. Please request a new one.'
            : error.message || 'An error occurred during sign-in. Please try again.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/sign-in') }],
        );
      }
    };

    void verify();
  }, [token, router]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      {!failed && <ActivityIndicator size="large" color="#FF4CCC" />}
      <Text style={{ color: '#FFF', marginTop: 16 }}>
        {failed ? 'Sign-in failed.' : 'Signing you in...'}
      </Text>
    </View>
  );
}
