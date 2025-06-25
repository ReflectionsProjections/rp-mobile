import * as SecureStore from 'expo-secure-store';

export async function validateAuthToken(): Promise<boolean> {
  try {
    const response = await fetch('https://api.reflectionsprojections.org/auth/info', {
      method: 'GET',
      headers: {
        'Authorization': await SecureStore.getItemAsync('jwt') || '',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

export async function clearAuth(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('jwt');
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
}
