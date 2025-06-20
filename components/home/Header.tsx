import React from 'react';
import { View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export const Header: React.FC = () => {
  return (
    <View className="flex-row p-4 justify-between items-center">
      <Image 
        source={require('../../assets/images/rp-logo.png')}
        className="w-8 h-8" 
      />
      <FontAwesome name="user-circle-o" size={28} color="#fff" />
    </View>
  );
}; 