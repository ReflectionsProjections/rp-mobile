import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '@/lib/config';

export async function validateAuthToken(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/info`, {
      method: 'GET',
      headers: {
        Authorization: (await SecureStore.getItemAsync('jwt')) || '',
      },
      signal: controller.signal,
    });

    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function clearAuth(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('jwt');
    await SecureStore.deleteItemAsync('codeVerifier');
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
}

export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync('jwt');
    await SecureStore.deleteItemAsync('codeVerifier');
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};
