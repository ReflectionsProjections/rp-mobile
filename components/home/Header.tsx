import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Alert, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { logout } from '@/lib/auth';
import LOGO from '../../assets/images/logo.svg';

export const Header: React.FC = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);

  const handleLogoPress = () => {
    if (isSpinning) return; // Prevent multiple spins

    setIsSpinning(true);
    spinValue.setValue(0);

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
    });
  };

  const handleProfilePress = () => {
    router.push('/screens/profile');
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="flex-row p-4 justify-between items-center z-10">
      <TouchableOpacity onPress={handleLogoPress} disabled={isSpinning}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <LOGO width={32} height={32} />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleProfilePress}>
        <FontAwesome name="user-circle-o" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
