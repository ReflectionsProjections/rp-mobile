import { API_CONFIG } from '@/lib/config';
import createApi from './axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export const api = createApi(API_CONFIG.BASE_URL, async () => {
  // Clear JWT token
  await SecureStore.deleteItemAsync('jwt');
  await SecureStore.deleteItemAsync('codeVerifier');
  
  // Redirect to sign-in
  router.replace('/(auth)/sign-in');
});
