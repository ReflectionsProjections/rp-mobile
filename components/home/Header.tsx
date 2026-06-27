import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  Dimensions,
  Text,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { fetchEvents } from '@/lib/slices/favoritesSlice';
import { fetchUserProfile } from '@/lib/slices/userSlice';
import { fetchAttendeeProfile } from '@/lib/slices/attendeeSlice';
import { fetchMyShifts } from '@/lib/slices/shiftsSlice';
import { fetchDailyLeaderboard, fetchGlobalLeaderboard } from '@/lib/slices/leaderboardSlice';
import { fetchStaff } from '@/lib/slices/staffSlice';
import LOGO from '../../assets/images/logo.svg';
import { useThemeColor } from '@/lib/theme';
import { triggerIfEnabled } from '@/lib/haptics';
import { RootState } from '@/lib/store';
import Toast from 'react-native-toast-message';

const { height } = Dimensions.get('window');

interface HeaderProps {
  title?: string;
  bigText: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title = '', bigText = false }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const themeColor = useThemeColor();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);
  const hapticsEnabled = useAppSelector((s: RootState) => s.settings?.hapticsEnabled ?? true);
  const handleLogoPress = async () => {
    if (isSpinning) return; // Prevent multiple spins

    setIsSpinning(true);
    spinValue.setValue(0);

    // Haptics on tap
    await triggerIfEnabled(hapticsEnabled, 'medium');

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
        // Re-initialize app data via Redux fetches so routes refetch
        dispatch(fetchEvents());
        dispatch(fetchUserProfile());
        dispatch(fetchAttendeeProfile());
        const roles: string[] = Array.isArray(profile?.roles) ? (profile?.roles as string[]) : [];
        const hasStaffOrAdmin = roles.some((r) => {
          const R = (r || '').toUpperCase();
          return R === 'STAFF' || R === 'ADMIN';
        });
        if (hasStaffOrAdmin) {
          dispatch(fetchMyShifts());
          if (profile?.email) {
            dispatch(fetchStaff(profile.email));
          }
        }
        const today = new Date();
        const dayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
          today.getDate(),
        ).padStart(2, '0')}`;
        dispatch(fetchDailyLeaderboard({ day: dayStr }));
        dispatch(fetchGlobalLeaderboard({}));
        // Visual feedback: toast confirmation
        Toast.show({
          type: 'success',
          text1: 'All up to speed!',
          text2: 'Successfully refreshed data',
          position: 'top',
          topOffset: 50,
          visibilityTime: 1500,
        });
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
        <View style={[styles.titleContainer, title === 'EVENTS' && styles.eventsTitleContainer]}>
          <Text style={[styles.mainTitle, { fontSize: bigText ? 32 : 28 }]}>{title}</Text>
          {title !== 'EVENTS' && (
            <View style={[styles.titleUnderline, { backgroundColor: themeColor }]} />
          )}
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
  eventsTitleContainer: {
    marginTop: -2,
  },
  mainTitle: {
    fontFamily: 'Ethnocentric',
    color: '#fff',
    lineHeight: height < 700 ? 32 : 40,
    letterSpacing: 0,
    textAlign: 'center',
  },
  titleUnderline: {
    marginTop: height < 700 ? 2 : 4,
    width: 98,
    height: 4,
    borderRadius: 6,
  },
});
