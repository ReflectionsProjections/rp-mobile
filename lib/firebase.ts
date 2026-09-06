import { Platform, PermissionsAndroid } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission as requestIosPermission,
  getToken,
  deleteToken as deleteFcmToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  getInitialNotification,
  setBackgroundMessageHandler,
  AuthorizationStatus,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { api } from '@/api/api';

const messagingInstance = () => getMessaging(getApp());

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }
  }

  const authStatus = await requestIosPermission(messagingInstance());
  return (
    Platform.OS === 'android' ||
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}

export async function getFcmToken(): Promise<string | null> {
  try {
    return await getToken(messagingInstance());
  } catch (err) {
    console.error('Failed to get FCM token:', err);
    return null;
  }
}

export async function deleteLocalFcmToken(): Promise<void> {
  try {
    await deleteFcmToken(messagingInstance());
  } catch (err) {
    console.error('Failed to delete FCM token:', err);
  }
}

export async function registerDeviceToken(token: string): Promise<void> {
  await api.post('/notifications/register', { deviceId: token });
}

export function subscribeToForegroundMessages(
  listener: (message: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  return onMessage(messagingInstance(), listener);
}

export function subscribeToNotificationOpened(
  listener: (message: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  return onNotificationOpenedApp(messagingInstance(), listener);
}

export function subscribeToTokenRefresh(listener: (token: string) => void) {
  return onTokenRefresh(messagingInstance(), listener);
}

export function getInitialNotificationMessage() {
  return getInitialNotification(messagingInstance());
}

export function registerBackgroundHandler() {
  setBackgroundMessageHandler(messagingInstance(), async (message) => {
    console.log('Background FCM message:', message);
  });
}
