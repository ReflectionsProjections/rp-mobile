import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export const Header: React.FC = () => {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('jwt');
    await SecureStore.deleteItemAsync('codeVerifier');
    router.push('/');
  };

  return (
    <View className="flex-row p-4 justify-between items-center">
      <Image source={require('../../assets/images/rp-logo.png')} className="w-8 h-8" />
      <TouchableOpacity onPress={() => handleLogout()}>
        <FontAwesome name="user-circle-o" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
