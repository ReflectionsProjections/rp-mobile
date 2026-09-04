import React from 'react';
import { TouchableOpacity } from '@/components/ui/HapticControls';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export function ProfileButton({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.push('/screens/profile'))}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
    >
      <FontAwesome name="user-circle-o" size={32} color="#fff" />
    </TouchableOpacity>
  );
}
