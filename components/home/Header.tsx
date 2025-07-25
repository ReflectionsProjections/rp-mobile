import React from 'react';
import { View, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import LOGO from '../../assets/images/logo.svg';

export const Header: React.FC = () => {
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('jwt');
              await SecureStore.deleteItemAsync('codeVerifier');
              router.replace('/(auth)/sign-in');
            } catch (error) {
              console.error('Error during logout:', error);
              router.replace('/(auth)/sign-in');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-row p-4 justify-between items-center z-10">
      <LOGO width={32} height={32} />
      <TouchableOpacity onPress={handleLogout}>
        <FontAwesome name="user-circle-o" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};