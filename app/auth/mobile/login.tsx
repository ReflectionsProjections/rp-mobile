import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { api } from '@/api/api';

export default function MobileMagicLinkScreen() {
  const { token } = useLocalSearchParams<{ token?: string | string[] }>();
  const router = useRouter();
  const hasStarted = useRef(false);
  const [message, setMessage] = useState('Signing you in...');

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }
    hasStarted.current = true;

    const completeMagicLink = async () => {
      const magicLinkToken = Array.isArray(token) ? token[0] : token;
      if (!magicLinkToken) {
        throw new Error('This sign-in link is incomplete.');
      }

      const response = await api.post('/auth/magic-links/verify', {
        token: magicLinkToken,
        client: 'mobile',
      });

      await SecureStore.setItemAsync('jwt', response.data.token);
      const roles = await api.get('/auth/info').then((result) => result.data.roles);
      if (!roles.includes('USER')) {
        await SecureStore.deleteItemAsync('jwt');
        throw new Error('Register for the event before signing in.');
      }

      router.replace('/(tabs)/home');
    };

    completeMagicLink().catch(async (error: any) => {
      await SecureStore.deleteItemAsync('jwt');
      setMessage('This sign-in link could not be used.');
      Alert.alert(
        'Sign-in failed',
        error.response?.data?.error === 'InvalidToken'
          ? 'This link has expired or was already used. Request a new one.'
          : error.message || 'Request a new sign-in link and try again.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/sign-in') }],
      );
    });
  }, [router, token]);

  return (
    <View className="flex-1 items-center justify-center bg-black px-8">
      <ActivityIndicator color="#FFFFFF" size="large" />
      <Text className="mt-4 text-center text-white">{message}</Text>
    </View>
  );
}
