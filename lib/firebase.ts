import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  hasPermission,
  AuthorizationStatus,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  onTokenRefresh,
  deleteToken,
} from '@react-native-firebase/messaging';
import { Alert, Platform, Linking, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/api/api';

// Storage keys for notification preferences
const NOTIFICATION_PERMISSION_KEY = 'notification_permission_granted';
const NOTIFICATION_TOKEN_KEY = 'notification_fcm_token';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class FirebaseService {
  private static instance: FirebaseService;
  private fcmToken: string | null = null;
  private messaging: any;
  private appStateSubscription: any = null;
  private lastPermissionStatus: boolean | null = null;

  private constructor() {
    this.initializeFirebase();
    this.setupAppStateListener();
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  private async initializeFirebase() {
    try {
      // Initialize Firebase messaging
      const app = getApp();
      this.messaging = getMessaging(app);
      console.log('Firebase initialized successfully');

      // Initialize permission status tracking
      await this.initializePermissionTracking();
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }

  private async initializePermissionTracking() {
    try {
      const { granted } = await this.checkNotificationPermission();
      this.lastPermissionStatus = granted;

      // If permission is already granted, try to get and register token
      if (granted) {
        await this.autoRegisterTokenIfNeeded();
      }
    } catch (error) {
      console.error('Error initializing permission tracking:', error);
    }
  }

  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        // App became active, check if permission status changed
        await this.checkPermissionStatusChange();
      }
    });
  }

  private async checkPermissionStatusChange() {
    try {
      const { granted } = await this.checkNotificationPermission();

      // If permission status changed from false to true, auto-register token
      if (this.lastPermissionStatus === false && granted === true) {
        console.log('Notification permission granted in system settings, auto-registering token');
        await this.autoRegisterTokenIfNeeded();
      }

      // Update stored permission status
      if (this.lastPermissionStatus !== granted) {
        await this.storeNotificationPreferences({
          permissionGranted: granted,
          fcmToken: granted ? this.fcmToken : null,
        });
      }

      this.lastPermissionStatus = granted;
    } catch (error) {
      console.error('Error checking permission status change:', error);
    }
  }

  private async autoRegisterTokenIfNeeded() {
    try {
      // Always get a fresh token and register it
      const token = await getToken(this.messaging);
      if (token) {
        this.fcmToken = token;

        try {
          // Register with your backend
          const response = await api.post('/notifications/register', { deviceId: token });
          console.log('Successfully registered FCM token with backend:', token);
          console.log('Backend response:', response.data);

          // Store the new token
          await this.storeNotificationPreferences({
            permissionGranted: true,
            fcmToken: token,
          });
        } catch (apiError) {
          console.error('Failed to register token with backend:', apiError);
        }
      }
    } catch (error) {
      console.error('Error auto-registering token:', error);
    }
  }

  public async requestUserPermission(): Promise<{
    success: boolean;
    token?: string;
    error?: string;
  }> {
    try {
      if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return { success: false, error: 'Must use physical device' };
      }

      const authStatus = await requestPermission(this.messaging);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        try {
          const fcmToken = await getToken(this.messaging);
          console.log('FCM Token:', fcmToken);

          try {
            const response = await api.post('/notifications/register', { deviceId: fcmToken });
            console.log('Successfully registered FCM token:', fcmToken);
            console.log('Backend response:', response.data);

            this.fcmToken = fcmToken;

            // Store the token
            await this.storeNotificationPreferences({
              permissionGranted: true,
              fcmToken: fcmToken,
            });

            return { success: true, token: fcmToken };
          } catch (apiError) {
            console.error('Failed to register token with backend:', apiError);
            return { success: false, error: 'Failed to register with backend' };
          }
        } catch (tokenError) {
          console.error('Error getting FCM token:', tokenError);
          return { success: false, error: 'Failed to get FCM token' };
        }
      } else {
        return { success: false, error: 'Permission denied' };
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  public async getFCMToken(): Promise<string | null> {
    try {
      if (this.fcmToken) {
        return this.fcmToken;
      }

      // Only get token if permission is already granted (don't request permission)
      const { granted } = await this.checkNotificationPermission();
      if (!granted) {
        return null;
      }

      // Get token without requesting permission
      const token = await getToken(this.messaging);
      if (token) {
        this.fcmToken = token;
        // Auto-register the token if we haven't already
        await this.autoRegisterTokenIfNeeded();
      }

      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Get stored notification preferences
  public async getStoredNotificationPreferences() {
    try {
      const [permissionGranted, fcmToken] = await Promise.all([
        AsyncStorage.getItem(NOTIFICATION_PERMISSION_KEY),
        AsyncStorage.getItem(NOTIFICATION_TOKEN_KEY),
      ]);

      return {
        permissionGranted: permissionGranted === 'true',
        fcmToken: fcmToken || null,
      };
    } catch (error) {
      console.error('Error getting stored notification preferences:', error);
      return {
        permissionGranted: false,
        fcmToken: null,
      };
    }
  }

  // Store notification preferences
  public async storeNotificationPreferences(preferences: {
    permissionGranted: boolean;
    fcmToken?: string | null;
  }) {
    try {
      await Promise.all([
        AsyncStorage.setItem(NOTIFICATION_PERMISSION_KEY, preferences.permissionGranted.toString()),
        ...(preferences.fcmToken
          ? [AsyncStorage.setItem(NOTIFICATION_TOKEN_KEY, preferences.fcmToken)]
          : []),
      ]);
    } catch (error) {
      console.error('Error storing notification preferences:', error);
    }
  }

  // Check current notification permission status
  public async checkNotificationPermission() {
    try {
      const authStatus = await hasPermission(this.messaging);
      const granted =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      return {
        granted,
        status: authStatus,
      };
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return { granted: false, status: 'error' };
    }
  }

  // Show guidance for users when notifications are disabled
  public showNotificationGuidance() {
    Alert.alert(
      'Notifications Disabled',
      'To receive updates, please enable notifications in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
      ],
    );
  }

  public async onMessageReceived(callback: (message: any) => void) {
    // Handle foreground messages
    const unsubscribe = onMessage(this.messaging, async (remoteMessage: any) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));

      // Show local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title || 'New Message',
          body: remoteMessage.notification?.body || '',
          data: remoteMessage.data,
        },
        trigger: null, // Show immediately
      });

      callback(remoteMessage);
    });

    return unsubscribe;
  }

  public async onNotificationOpenedApp(callback: (message: any) => void) {
    // Handle background/quit state messages
    onNotificationOpenedApp(this.messaging, (remoteMessage: any) => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      callback(remoteMessage);
    });

    // Check if app was opened from a notification
    getInitialNotification(this.messaging).then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
        callback(remoteMessage);
      }
    });
  }

  public async onTokenRefresh(callback: (token: string) => void) {
    // Handle token refresh
    const unsubscribe = onTokenRefresh(this.messaging, (token: string) => {
      console.log('FCM token refreshed:', token);
      this.fcmToken = token;
      callback(token);
    });

    return unsubscribe;
  }

  // Unregister for notifications
  public async unregisterForNotifications() {
    try {
      // Delete the FCM token from the device
      await deleteToken(this.messaging);

      // Clear stored preferences
      await this.storeNotificationPreferences({
        permissionGranted: false,
        fcmToken: null,
      });

      this.fcmToken = null;
      this.lastPermissionStatus = false;
      console.log('Successfully unregistered for notifications');
    } catch (error) {
      console.error('Failed to unregister notifications:', error);
    }
  }

  // Force re-registration of token (useful for debugging)
  public async forceReregisterToken() {
    try {
      console.log('Force re-registering FCM token...');
      const token = await getToken(this.messaging);
      if (token) {
        this.fcmToken = token;

        try {
          const response = await api.post('/notifications/register', { deviceId: token });
          console.log('Force registration successful:', token);
          console.log('Backend response:', response.data);

          await this.storeNotificationPreferences({
            permissionGranted: true,
            fcmToken: token,
          });

          return { success: true, token };
        } catch (apiError) {
          console.error('Force registration failed:', apiError);
          return { success: false, error: apiError };
        }
      }
      return { success: false, error: 'No token available' };
    } catch (error) {
      console.error('Error in force re-registration:', error);
      return { success: false, error };
    }
  }

  // Cleanup method to remove listeners
  public cleanup() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  // Check and handle notification issues on app startup
  public async checkNotificationStatusOnStartup() {
    try {
      const { granted } = await this.checkNotificationPermission();
      const storedPrefs = await this.getStoredNotificationPreferences();

      // If user previously had notifications enabled but they're now disabled
      if (storedPrefs.permissionGranted && !granted) {
        console.log('Notification permission lost');
        return {
          needsAttention: true,
          message: 'Please enable notifications in your device settings',
          showGuidance: true,
        };
      }

      return { needsAttention: false };
    } catch (error) {
      console.error('Error checking notification status on startup:', error);
      return { needsAttention: false };
    }
  }
}

export default FirebaseService;
