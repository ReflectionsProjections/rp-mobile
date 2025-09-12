import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Linking, Platform, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedSwitch } from '@/components/switch/AnimatedSwitch';
import { useFirebaseNotifications } from '@/hooks/useFirebaseNotifications';
import FirebaseService from '@/lib/firebase';

export const NotificationToggle = () => {
  const { fcmToken, isLoading, error } = useFirebaseNotifications();
  const [isEnabled, setIsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'unknown'>(
    'unknown',
  );

  useEffect(() => {
    checkPermissionStatus();

    // Listen for app state changes to refresh permission status
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkPermissionStatus();
      }
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    // Update toggle state based on system permission status
    setIsEnabled(permissionStatus === 'granted');
  }, [permissionStatus]);

  const checkPermissionStatus = async () => {
    try {
      const firebaseService = FirebaseService.getInstance();
      const { granted } = await firebaseService.checkNotificationPermission();
      setPermissionStatus(granted ? 'granted' : 'denied');
    } catch (error) {
      console.error('Error checking permission status:', error);
      setPermissionStatus('unknown');
    }
  };

  const toggleSwitch = async () => {
    console.log('Toggle pressed!', { isEnabled, permissionStatus });

    // Use setTimeout to ensure the touch event completes before showing alert
    setTimeout(() => {
      if (isEnabled) {
        // If currently enabled, show guidance to disable in system settings
        Alert.alert(
          'Disable Notifications',
          'To disable notifications, please turn them off in your device settings.',
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
          { cancelable: true },
        );
      } else {
        // If currently disabled, show guidance to enable in system settings
        Alert.alert(
          'Enable Notifications',
          'To receive notifications, please enable them in your device settings.',
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
          { cancelable: true },
        );
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading notification settings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        zIndex: 999,
        elevation: 999,
        backgroundColor: 'transparent',
      }}
    >
      <AnimatedSwitch
        key={`notification-switch-${permissionStatus}`}
        value={isEnabled}
        onValueChange={toggleSwitch}
        width={60}
        height={36}
        onColor="#4CD964"
        offColor="rgba(255, 255, 255, 0.4)"
        thumbColor="#fff"
        thumbOffIcon={<Ionicons name="notifications-off" size={20} color="grey" />}
        thumbOnIcon={<Ionicons name="notifications" size={20} color="black" />}
        iconAnimationType="rotate"
        style={{
          zIndex: 999,
          elevation: 999,
        }}
      />
    </View>
  );
};
