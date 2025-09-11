import { API_CONFIG } from '@/lib/config';
import createApi from './axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

// Create a store reference that will be set by the app
let store: any = null;

export const setStore = (reduxStore: any) => {
  store = reduxStore;
};

export const api = createApi(API_CONFIG.BASE_URL, async () => {
  // Clear JWT token
  await SecureStore.deleteItemAsync('jwt');
  await SecureStore.deleteItemAsync('codeVerifier');

  if (store) {
    // Dispatch logout actions
    store.dispatch({ type: 'user/logout' });
    store.dispatch({ type: 'attendee/clearAttendeeProfile' });
    store.dispatch({ type: 'favorites/clearFavorites' });
    store.dispatch({ type: 'favorites/clearEvents' });
    store.dispatch({ type: 'shifts/clearShifts' });
  }

  // Redirect to sign-in
  router.replace('/(auth)/sign-in');
});
