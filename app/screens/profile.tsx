import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { TouchableOpacity } from '@/components/ui/HapticControls';
import { logout as clearAuthTokens } from '@/lib/auth';
import { useLogout } from '@/api/tanstack/user';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import LoadingScreenView from '@/components/loading/LoadingScreenView';
import { useAppSelector } from '@/lib/store';
import { RootState, useAppDispatch, persistor } from '@/lib/store';
import { useDataInitialization } from '@/hooks/useDataInitialization';
import { AnimatedSwitch } from '@/components/switch/AnimatedSwitch';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { fetchAttendeePoints } from '@/lib/slices/attendeeSlice';
import { clearAttendeeProfile } from '@/lib/slices/attendeeSlice';
import { clearUserProfile, logout as logoutUserSlice } from '@/lib/slices/userSlice';
import { clearFavorites, clearEvents } from '@/lib/slices/favoritesSlice';
import { clearShifts } from '@/lib/slices/shiftsSlice';
import { clearStaff } from '@/lib/slices/staffSlice';
import { clearLeaderboard } from '@/lib/slices/leaderboardSlice';
import { toggleHaptics, toggleNotifications } from '@/lib/slices/settingsSlice';
import { useAttendeeAttendance } from '@/api/tanstack/attendee';
import { useMyLeaderboardRank } from '@/api/tanstack/leaderboard';

import QrButtonOrnament from '@/assets/profile/updated/qr_button_ornament.svg';
import LogoutButtonOrnament from '@/assets/profile/updated/logout_button_ornament.svg';
import RolePanelBg from '@/assets/profile/updated/role_panel_bg.svg';
import RankCardFrame from '@/assets/profile/updated/rank_card_frame.svg';
import RankBannerPink from '@/assets/profile/updated/rank_banner_pink.svg';
import BellIcon from '@/assets/profile/updated/icon_ringing_bell.svg';
import VibrationIcon from '@/assets/profile/updated/icon_phone_vibration.svg';
import CornerBrackets from '@/assets/profile/updated/avatar_corner_brackets_bottom.svg';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';

const { width } = Dimensions.get('window');

// Design frame is 402pt wide; content blocks use the design's fixed widths, centered.
const COLORS = {
  bgTop: '#0F062D',
  bgBottom: '#24114C',
  panel: '#310F78',
  panelBorder: '#373792',
  chipBg: '#373792',
  dark: '#181818',
  pink: '#FF4CCC',
  rankNumberBg: '#140532',
  progress: '#B9C8FF',
  divider: '#B44FBF',
  decoFrame: '#463E4F',
  glow: '#A511B4',
};

const ordinal = (n: number) => {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
};

const titleCase = (s: string) =>
  s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

// 0.8pt-wide decorative tick marks scattered around the panels
const Tick = ({ top, left, right }: { top: number; left?: number; right?: number }) => (
  <View
    pointerEvents="none"
    style={{
      position: 'absolute',
      top,
      left,
      right,
      width: 1,
      height: 6,
      backgroundColor: COLORS.divider,
    }}
  />
);

const CornerDot = ({ top, left, right }: { top: number; left?: number; right?: number }) => (
  <View
    pointerEvents="none"
    style={{
      position: 'absolute',
      top,
      left,
      right,
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    }}
  />
);

const ToggleRow = ({
  label,
  value,
  onToggle,
  icon,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
}) => (
  <View
    style={{
      width: 348,
      height: 54,
      backgroundColor: COLORS.panel,
      borderWidth: 4,
      borderColor: COLORS.panelBorder,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 35,
      paddingRight: 22,
    }}
  >
    <CornerDot top={7} left={7} />
    <CornerDot top={33} left={7} />
    <CornerDot top={7} right={7} />
    <CornerDot top={33} right={7} />
    <Text
      style={{
        fontFamily: 'ShareTechMono',
        fontSize: 18,
        lineHeight: 22,
        color: '#fff',
      }}
    >
      {label}
    </Text>
    <AnimatedSwitch
      value={value}
      onValueChange={onToggle}
      width={75}
      height={28}
      onColor="#D9D9D9"
      offColor="rgba(217, 217, 217, 0.35)"
      thumbColor={COLORS.panel}
      thumbSize={22}
      thumbInset={3}
      thumbOnIcon={icon}
      thumbOffIcon={icon}
      iconAnimationType="fade"
      style={{}}
    />
  </View>
);

const ProfileScreen = () => {
  const { isInitialized } = useDataInitialization();
  const user = useAppSelector((state: RootState) => state.user.profile);
  const attendee = useAppSelector((state: RootState) => state.attendee.attendee);
  const logout = useLogout();
  const dispatch = useAppDispatch();
  const staffMe = useAppSelector((s: RootState) => s.staff.me);
  const hapticsEnabled = useAppSelector((s: RootState) => s.settings?.hapticsEnabled ?? true);
  const notificationsEnabled = useAppSelector(
    (s: RootState) => s.settings?.notificationsEnabled ?? true,
  );

  const hasUserRole = (user?.roles || []).some((r: string) => (r || '').toUpperCase() === 'USER');
  const attendanceQuery = useAttendeeAttendance(hasUserRole);
  const rankQuery = useMyLeaderboardRank(hasUserRole);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

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
            // Server-side logout (if any)
            logout();
            // Clear secure tokens
            await clearAuthTokens();
            // Clear Redux slices
            dispatch(logoutUserSlice());
            dispatch(clearUserProfile());
            dispatch(clearAttendeeProfile());
            dispatch(clearFavorites());
            dispatch(clearEvents());
            dispatch(clearShifts());
            dispatch(clearStaff());
            dispatch(clearLeaderboard());
            // Purge persisted storage to avoid dangling cached roles
            try {
              await persistor.purge();
            } catch {}
            // Navigate to sign-in
            router.replace('/(auth)/sign-in');
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)/home');
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [user, dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (hasUserRole) {
        dispatch(fetchAttendeePoints());
      }
      return () => {};
    }, [dispatch, hasUserRole]),
  );

  if (!isInitialized) {
    return <LoadingScreenView />;
  }

  if (!user || user.roles.length === 0) {
    return (
      <View className="flex-1">
        <LinearGradient
          colors={['#130630', '#72138A']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView className="flex-1 justify-center items-center px-6">
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: logoScaleAnim }],
            }}
            className="items-center"
          >
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderWidth: 3,
                borderColor: '#ffffff',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 30,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="business-outline" size={60} color="#ffffff" />
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                fontFamily: 'ProRacing',
                color: '#fff',
                textAlign: 'center',
                marginBottom: 12,
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}
            >
              SEE THE CITY!
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter',
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                maxWidth: 300,
                paddingHorizontal: 12,
                marginBottom: 40,
                lineHeight: 24,
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Sign in to track your points and unlock exclusive rewards!
            </Text>

            {/* Action buttons */}
            <View className="w-full max-w-[280px] mt-8 space-y-4">
              {/* Continue as Guest button */}
              <TouchableOpacity
                onPress={() => router.replace('/(tabs)/home')}
                activeOpacity={0.8}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  borderRadius: 12,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600',
                    fontFamily: 'Inter',
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  Continue as Guest
                </Text>
              </TouchableOpacity>

              {/* Return to sign in page button */}
              <TouchableOpacity
                onPress={() => router.replace('/(auth)/sign-in')}
                activeOpacity={0.8}
                style={{
                  backgroundColor: 'rgba(45, 45, 128, 0.8)',
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  borderRadius: 12,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600',
                    fontFamily: 'Inter',
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  Return to Sign In Page
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  const isStaffOrAdmin = (user?.roles || []).some((r: string) => {
    const R = (r || '').toUpperCase();
    return R === 'STAFF' || R === 'ADMIN';
  });
  const staffWithoutUser = isStaffOrAdmin && !hasUserRole;

  {
    /* Staff without user role - show registration prompt */
  }
  if (staffWithoutUser) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F062D' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={{
              position: 'absolute',
              top: 56,
              left: 20,
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
              zIndex: 1,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 32,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontFamily: 'ProRacing',
                fontSize: 24,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              SEE THE CITY!
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontFamily: 'Inter',
                fontSize: 16,
                lineHeight: 24,
                textAlign: 'center',
                maxWidth: 300,
              }}
            >
              Log in with the account you used to register as an attendee to view your profile.
            </Text>
            {!!user?.email && (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'ShareTechMono',
                  fontSize: 14,
                  textAlign: 'center',
                  maxWidth: 300,
                  marginTop: 20,
                }}
              >
                {user.email}
              </Text>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const points = attendee?.points ?? 0;
  const eventsAttended = attendanceQuery.data?.count ?? 0;
  const rank = rankQuery.data?.rank;
  const nextRank = rankQuery.data?.nextRank ?? null;
  const pointsToNextRank = rankQuery.data?.pointsToNextRank ?? null;

  const rankCaption =
    rank === undefined
      ? 'Check in at events to climb the leaderboard!'
      : nextRank === null || pointsToNextRank === null
        ? "You're on top of the leaderboard!"
        : `Only ${pointsToNextRank} pts left to catch up to ${ordinal(nextRank)}!`;

  // Fraction of the way to the next rank, for the small progress bar
  const progressFraction =
    nextRank === null || pointsToNextRank === null
      ? 1
      : points + pointsToNextRank > 0
        ? points / (points + pointsToNextRank)
        : 0;

  const roleChips: string[] = [];
  if (isStaffOrAdmin && staffMe?.team) {
    roleChips.push(titleCase(staffMe.team));
  }
  (user?.roles || []).forEach((r: string) => {
    const R = (r || '').toUpperCase();
    if (R === 'USER') return;
    const label = titleCase(R);
    if (!roleChips.includes(label)) roleChips.push(label);
  });
  if (roleChips.length === 0) {
    roleChips.push('Attendee');
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.bgTop, overflow: 'hidden' }}>
      <LinearGradient
        colors={[COLORS.bgTop, COLORS.bgBottom]}
        locations={[0.2, 0.56]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 60, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Decorative frame hanging off the right edge */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              right: -52,
              width: 107,
              height: 148,
              borderWidth: 10,
              borderColor: COLORS.decoFrame,
              borderRadius: 12,
            }}
          />

          {/* Scattered tick marks */}
          <Tick top={169} right={24} />
          <Tick top={322} right={22} />
          <Tick top={365} left={34} />
          <Tick top={365} right={22} />
          <Tick top={470} left={30} />
          <Tick top={496} left={30} />
          <Tick top={509} right={22} />
          <Tick top={534} left={30} />
          <Tick top={568} left={31} />

          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            pointerEvents="box-none"
          >
            {/* ---- Header: back, avatar, QR ---- */}
            <View style={{ width: width, height: 150 }}>
              <TouchableOpacity
                onPress={handleBackPress}
                style={{
                  position: 'absolute',
                  left: 20,
                  top: 4,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: 'rgba(24, 24, 24, 0.7)',
                  borderWidth: 1,
                  borderColor: COLORS.panelBorder,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </TouchableOpacity>

              {/* Avatar tile with corner brackets (brackets drawn above the tile) */}
              <TouchableOpacity
                onPress={() => router.push('/screens/configure-profile')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Configure profile avatar"
                style={{ alignSelf: 'center', width: 116, height: 113 }}
              >
                <ProfileAvatar
                  size={107.3}
                  borderRadius={2.4}
                  style={{ position: 'absolute', top: 2.4, left: 4.3 }}
                />
                <CornerBrackets
                  width={116}
                  height={20.2}
                  style={{ position: 'absolute', top: 0, transform: [{ scaleY: -1 }] }}
                />
                <CornerBrackets
                  width={116}
                  height={20.2}
                  style={{ position: 'absolute', bottom: 0 }}
                />
              </TouchableOpacity>

              {/* QR button */}
              <TouchableOpacity
                onPress={() => router.push('/screens/scanner')}
                activeOpacity={0.8}
                style={{ position: 'absolute', right: 31, top: 72 }}
              >
                <QrButtonOrnament width={68} height={64} />
              </TouchableOpacity>

              {/* Logout button, stacked beneath QR */}
              <TouchableOpacity
                onPress={handleLogout}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Log out"
                style={{ position: 'absolute', right: 31, top: 0 }}
              >
                <LogoutButtonOrnament width={68} height={64} />
              </TouchableOpacity>
            </View>

            {/* ---- Name ---- */}
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 14,
                fontFamily: 'Ethnocentric',
                fontSize: 20,
                letterSpacing: 3,
                color: '#fff',
                textTransform: 'uppercase',
                textAlign: 'center',
                maxWidth: width - 40,
                textShadowColor: COLORS.glow,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 18,
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {user?.displayName || ''}
            </Text>

            {!!user?.email && (
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  alignSelf: 'center',
                  marginTop: 8,
                  paddingHorizontal: 24,
                  maxWidth: width - 48,
                  fontFamily: 'ShareTechMono',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.55)',
                  textAlign: 'center',
                }}
              >
                {user.email}
              </Text>
            )}

            {/* ---- Stats bar ---- */}
            <View
              style={{
                alignSelf: 'center',
                marginTop: 22,
                width: 349,
                height: 58,
                backgroundColor: COLORS.panel,
                borderWidth: 4,
                borderColor: COLORS.panelBorder,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'Ethnocentric', fontSize: 24, color: '#fff' }}>
                  {points}
                </Text>
                <Text
                  style={{
                    fontFamily: 'ShareTechMono',
                    fontSize: 14,
                    color: '#fff',
                    marginLeft: 6,
                    marginBottom: 3,
                  }}
                >
                  pts
                </Text>
              </View>

              <View
                style={{
                  width: 6,
                  height: 34,
                  borderRadius: 5,
                  backgroundColor: COLORS.divider,
                  marginHorizontal: 24,
                }}
              />

              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'Ethnocentric', fontSize: 24, color: '#fff' }}>
                  {eventsAttended}
                </Text>
                <Text
                  style={{
                    fontFamily: 'ShareTechMono',
                    fontSize: 14,
                    color: '#fff',
                    marginLeft: 6,
                    marginBottom: 3,
                  }}
                >
                  events
                </Text>
              </View>
            </View>

            {/* ---- ROLE panel ---- */}
            <View style={{ alignSelf: 'center', marginTop: 25, width: 344, height: 148 }}>
              <RolePanelBg width={344} height={148} style={StyleSheet.absoluteFillObject} />
              {/* Dark pill inside the top notch */}
              <View
                style={{
                  position: 'absolute',
                  top: 8,
                  alignSelf: 'center',
                  width: 80,
                  height: 9,
                  borderRadius: 12,
                  backgroundColor: COLORS.dark,
                }}
              />
              <Text
                style={{
                  position: 'absolute',
                  top: 30,
                  left: 0,
                  right: 0,
                  fontFamily: 'Ethnocentric',
                  fontSize: 24,
                  color: '#fff',
                  textAlign: 'center',
                }}
              >
                ROLE
              </Text>
              <View
                style={{
                  position: 'absolute',
                  top: 62,
                  left: 10,
                  width: 316,
                  height: 65,
                  borderRadius: 10,
                  backgroundColor: COLORS.dark,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  paddingHorizontal: 12,
                }}
              >
                {roleChips.map((chip) => (
                  <View
                    key={chip}
                    style={{
                      height: 35,
                      paddingHorizontal: 20,
                      borderRadius: 6,
                      backgroundColor: COLORS.chipBg,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'ShareTechMono',
                        fontSize: 18,
                        lineHeight: 22,
                        color: '#fff',
                      }}
                    >
                      {chip}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ---- RANK card ---- */}
            <View style={{ alignSelf: 'center', marginTop: 24, width: 348, height: 122 }}>
              <RankCardFrame
                width={348}
                height={114}
                style={{ position: 'absolute', top: 4, transform: [{ scaleX: -1 }] }}
              />

              {/* Pink banner + RANK label */}
              <RankBannerPink
                width={230}
                height={125}
                style={{ position: 'absolute', left: 5, top: -4 }}
              />
              <Text
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 30,
                  width: 120,
                  textAlign: 'center',
                  fontFamily: 'Ethnocentric',
                  fontSize: 24,
                  color: '#fff',
                  transform: [{ rotate: '-8deg' }],
                }}
              >
                RANK
              </Text>
              <Text
                style={{
                  position: 'absolute',
                  left: 26,
                  top: 68,
                  width: 160,
                  fontFamily: 'ShareTechMono',
                  fontSize: 14,
                  color: '#fff',
                }}
              >
                {rankCaption}
              </Text>

              {/* Rank number card (drawn above the banner, as in the design) */}
              <View
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 10,
                  width: 153,
                  height: 90,
                  borderRadius: 12,
                  backgroundColor: COLORS.rankNumberBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Text
                    style={{
                      fontFamily: 'Ethnocentric',
                      fontSize: rank !== undefined && rank >= 1000 ? 40 : 56,
                      color: COLORS.pink,
                      lineHeight: rank !== undefined && rank >= 1000 ? 46 : 62,
                    }}
                  >
                    {rank !== undefined ? rank : '--'}
                  </Text>
                  {rank !== undefined && (
                    <Text
                      style={{
                        fontFamily: 'Ethnocentric',
                        fontSize: 12,
                        color: COLORS.pink,
                        marginTop: 6,
                        marginLeft: 2,
                      }}
                    >
                      {ordinal(rank).replace(String(rank), '')}
                    </Text>
                  )}
                </View>
                {/* Progress toward next rank */}
                <View
                  style={{
                    width: 131,
                    height: 8,
                    borderRadius: 12,
                    backgroundColor: 'rgba(185, 200, 255, 0.25)',
                    marginTop: 6,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: 131 * Math.max(0.06, Math.min(1, progressFraction)),
                      height: 8,
                      borderRadius: 12,
                      backgroundColor: COLORS.progress,
                    }}
                  />
                </View>
              </View>
            </View>

            {/* ---- Toggles ---- */}
            <View style={{ alignSelf: 'center', marginTop: 26 }}>
              <ToggleRow
                label="Notification"
                value={notificationsEnabled}
                onToggle={() => dispatch(toggleNotifications())}
                icon={<BellIcon width={16} height={16} />}
              />
            </View>
            <View style={{ alignSelf: 'center', marginTop: 21 }}>
              <ToggleRow
                label="Haptics"
                value={hapticsEnabled}
                onToggle={() => dispatch(toggleHaptics())}
                icon={<VibrationIcon width={16} height={16} />}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
