import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export function ProfileButton({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress ?? (() => router.push('/screens/profile'))}>
      <FontAwesome name="user-circle-o" size={28} color="#fff" />
    </TouchableOpacity>
  );
}
