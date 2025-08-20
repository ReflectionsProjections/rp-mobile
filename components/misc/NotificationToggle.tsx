import React, { useState, useEffect } from 'react';
import { View, Switch, Text, Alert } from 'react-native';
import { useFirebaseNotifications } from '@/hooks/useFirebaseNotifications';

export const NotificationToggle = () => {
  const { fcmToken, isLoading, error, registerForNotifications, unregisterFromNotifications } =
    useFirebaseNotifications();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Update toggle state based on whether we have a token
    setIsEnabled(!!fcmToken);
  }, [fcmToken]);

  const toggleSwitch = async () => {
    if (isEnabled) {
      // Unregister
      await unregisterFromNotifications();
      setIsEnabled(false);
      Alert.alert('Notifications Disabled', 'You will no longer receive push notifications.');
    } else {
      // Register
      if (fcmToken) {
        await registerForNotifications(fcmToken);
        setIsEnabled(true);
        Alert.alert('Notifications Enabled', 'You will now receive push notifications.');
      } else {
        Alert.alert('Error', 'Unable to enable notifications. Please check your permissions.');
      }
    }
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Push Notifications</Text>
        <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
          {isEnabled ? 'Receive updates and notifications' : 'Get notified about important updates'}
        </Text>
      </View>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};
