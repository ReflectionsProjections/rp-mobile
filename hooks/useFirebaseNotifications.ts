import { useEffect, useState } from 'react';
import FirebaseService from '../lib/firebase';

export const useFirebaseNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        setIsLoading(true);
        const firebaseService = FirebaseService.getInstance();

        const startupStatus = await firebaseService.checkNotificationStatusOnStartup();
        if (startupStatus.needsAttention && startupStatus.showGuidance) {
          firebaseService.showNotificationGuidance();
        }

        const token = await firebaseService.getFCMToken();
        setFcmToken(token);

        const unsubscribeMessage = await firebaseService.onMessageReceived((message) => {
          console.log('Foreground message received:', message);
        });

        firebaseService.onNotificationOpenedApp((message) => {
          console.log('App opened from notification:', message);
        });

        const unsubscribeTokenRefresh = await firebaseService.onTokenRefresh((token) => {
          console.log('Token refreshed:', token);
          setFcmToken(token);
        });

        setIsLoading(false);

        return () => {
          unsubscribeMessage();
          unsubscribeTokenRefresh();
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    initializeNotifications();
  }, []);

  const registerForNotifications = async (token: string) => {
    try {
      console.log('Registering token with server:', token);
      // Example:
      // await api.post('/notifications/register', { token });
    } catch (err) {
      console.error('Error registering token with server:', err);
    }
  };

  const unregisterFromNotifications = async () => {
    try {
      const firebaseService = FirebaseService.getInstance();
      await firebaseService.unregisterForNotifications();
      console.log('Unregistered from notifications');
      // await api.post('/notifications/unregister');
    } catch (err) {
      console.error('Error unregistering from notifications:', err);
    }
  };

  return {
    fcmToken,
    isLoading,
    error,
    registerForNotifications,
    unregisterFromNotifications,
  };
};
