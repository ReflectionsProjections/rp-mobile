import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
  Platform,
  DevSettings,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import LOGO from '../../assets/images/logo.svg';
import { ThemedText } from '../themed/ThemedText';
import { useThemeColor } from '@/lib/theme';

const { height } = Dimensions.get('window');

interface HeaderProps {
  title?: string;
  bigText: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title = '', bigText = false }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const themeColor = useThemeColor();
  const handleLogoPress = async () => {
    if (isSpinning) return; // Prevent multiple spins

    setIsSpinning(true);
    spinValue.setValue(0);

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(async () => {
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.location.reload();
          return;
        }

        // Try expo-updates if available (production builds)
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const Updates: any = require('expo-updates');
          if (Updates?.reloadAsync) {
            await Updates.reloadAsync();
            return;
          }
        } catch (_) {
          // expo-updates not available; fall back below
        }

        // Fallback for native dev
        if (DevSettings?.reload) {
          DevSettings.reload();
          return;
        }
      } catch (e) {
        console.warn('Failed to refresh app:', e);
      } finally {
        setIsSpinning(false);
      }
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
    <View style={[styles.headerContainer, { padding: height < 700 ? 12 : 16 }]}>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: height < 700 ? 18 : 22, // Smaller title for iPhone SE
    fontFamily: 'ProRacingSlant',
    letterSpacing: height < 700 ? 0.5 : 1, // Tighter spacing for small screens
  },
  titleUnderline: {
    marginTop: height < 700 ? 6 : 8, // Tighter spacing for iPhone SE
    width: height < 700 ? 100 : 120, // Smaller underline for small screens
    height: 3,
    borderRadius: 2,
  },
});
