import { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '@/lib/store';
import {
  requestNotificationPermission,
  getFcmToken,
  registerDeviceToken,
  subscribeToForegroundMessages,
  subscribeToNotificationOpened,
  subscribeToTokenRefresh,
} from '@/lib/firebase';

export const useFirebaseNotifications = () => {
  const notificationsEnabled = useAppSelector(
    (s) => s.settings?.notificationsEnabled ?? true,
  );
  const hasUserRole = useAppSelector((s) => !!s.user?.profile?.roles?.includes('USER'));
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!notificationsEnabled || !hasUserRole || registeredRef.current) return;

    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeOpened: (() => void) | undefined;
    let unsubscribeRefresh: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const granted = await requestNotificationPermission();
      if (!granted || cancelled) return;

      const token = await getFcmToken();
      if (!token || cancelled) return;

      console.log('[FCM] device token:', token);

      try {
        await registerDeviceToken(token);
      } catch (err) {
        console.error('Failed to register device for notifications:', err);
      }

      registeredRef.current = true;

      unsubscribeMessage = subscribeToForegroundMessages((message) => {
        Toast.show({
          type: 'info',
          text1: message.notification?.title ?? 'Notification',
          text2: message.notification?.body,
        });
      });

      unsubscribeOpened = subscribeToNotificationOpened((message) => {
        console.log('Notification opened app:', message);
      });

      unsubscribeRefresh = subscribeToTokenRefresh((newToken) => {
        registerDeviceToken(newToken).catch((err) =>
          console.error('Failed to register refreshed token:', err),
        );
      });
    })();

    return () => {
      cancelled = true;
      unsubscribeMessage?.();
      unsubscribeOpened?.();
      unsubscribeRefresh?.();
    };
  }, [notificationsEnabled, hasUserRole]);
};
