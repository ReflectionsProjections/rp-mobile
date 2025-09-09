import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Alert, Animated, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { logout } from '@/lib/auth';
import LOGO from '../../assets/images/logo.svg';
import { ThemedText } from '../themed/ThemedText';
import { useThemeColor } from '@/lib/theme';

interface HeaderProps {
  title?: string;
  bigText: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title = '', bigText = false }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const themeColor = useThemeColor();
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
    <View className="flex-row p-4 justify-between items-start z-10">
      <TouchableOpacity onPress={handleLogoPress} disabled={isSpinning}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <LOGO width={32} height={32} />
        </Animated.View>
      </TouchableOpacity>
      {title && (
        <View style={styles.titleContainer}>
          <ThemedText variant="bigName" style={[styles.mainTitle, { fontSize: bigText ? 30 : 28 }]}>
            {title}
          </ThemedText>
          <View style={[styles.titleUnderline, { backgroundColor: themeColor }]} />
        </View>
      )}
      <TouchableOpacity onPress={handleProfilePress}>
        <FontAwesome name="user-circle-o" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
  },
  titleUnderline: {
    marginTop: 8,
    width: 120,
    height: 3,
    borderRadius: 2,
  },
});
