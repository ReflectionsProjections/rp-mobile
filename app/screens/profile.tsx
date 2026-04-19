import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import ProfileHeader from '@/components/profile/Header';
import ImageCarousel from '@/components/profile/ImageCarousel';
import UserInfo from '@/components/profile/UserInfo';
import ColorPicker from '@/components/profile/ColorPicker';
import TagSelector from '@/components/profile/TagSelector';
import StaffTeamBadge from '@/components/profile/StaffTeamBadge';
import StaffRolesList from '@/components/profile/StaffRolesList';
import { logout as clearAuthTokens } from '@/lib/auth';
import { useLogout } from '@/api/tanstack/user';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Background from '@/assets/background/dottedBackground2.svg';
import LottieView from 'lottie-react-native';
import { useAppSelector } from '@/lib/store';
import { RootState, useAppDispatch, persistor } from '@/lib/store';
import { useDataInitialization } from '@/hooks/useDataInitialization';
import { NotificationToggle } from '@/components/misc/NotificationToggle';
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
import { toggleHaptics } from '@/lib/slices/settingsSlice';

const { width, height } = Dimensions.get('window');
const Separator = () => <View className="h-0.5 bg-white mb-2" />;

const LSeparator = ({ size = width * 0.85, thickness = 2, color = '#fff', zIndex = 1 }) => (
  <View
    style={{
      position: 'absolute',
      top: 10,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      flexDirection: 'row',
      height: size,
      justifyContent: 'flex-end',
      zIndex: zIndex,
      pointerEvents: 'none',
    }}
  >
    <View
      style={{
        width: size,
        height: thickness,
        backgroundColor: color,
        borderRadius: thickness / 2,
        left: 1,
      }}
    />
    <View
      style={{
        width: thickness,
        height: size,
        backgroundColor: color,
        borderRadius: thickness / 2,
      }}
    />
  </View>
);

const ProfileScreen = () => {
  const { isInitialized } = useDataInitialization();
  const user = useAppSelector((state: RootState) => state.user.profile);
  const attendee = useAppSelector((state: RootState) => state.attendee.attendee);
  const themeColor = useAppSelector((state: RootState) => state.attendee.themeColor);
  const logout = useLogout();
  const dispatch = useAppDispatch();
  const staffMe = useAppSelector((s: RootState) => s.staff.me);
  const hapticsEnabled = useAppSelector((s: RootState) => s.settings?.hapticsEnabled ?? true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const backButtonAnim = useRef(new Animated.Value(0)).current;
  const notificationAnim = useRef(new Animated.Value(0)).current;
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
    router.back();
  };

  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(backButtonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start();
  }, [user, dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (user && user.roles && user.roles.length > 0) {
        dispatch(fetchAttendeePoints());
      }
      return () => {};
    }, [dispatch, user]),
  );

  if (!isInitialized) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <LottieView
          source={require('@/assets/lottie/rp_animation.json')}
          autoPlay
          loop
          style={{ width: 1000, height: 1000 }}
          speed={4}
        />
      </SafeAreaView>
    );
  }

  if (!user || user.roles.length === 0) {
    return (
      <View className="flex-1">
        <Background
          width={width}
          height={height}
          style={{ zIndex: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          preserveAspectRatio="none"
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
                backgroundColor: 'rgba(202, 37, 35, 0.2)',
                borderWidth: 3,
                borderColor: '#CA2523',
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
              <Ionicons name="trophy-outline" size={60} color="#CA2523" />
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
              JOIN THE RACE!
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter',
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
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
                onPress={() => router.back()}
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
                  backgroundColor: 'rgba(202, 37, 35, 0.8)',
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
  const hasUserRole = (user?.roles || []).some((r: string) => (r || '').toUpperCase() === 'USER');
  const staffWithoutUser = isStaffOrAdmin && !hasUserRole;

  {
    /* Staff without user role - show registration prompt */
  }
  if (staffWithoutUser) {
    return (
      <View className="flex-1">
        <Background
          width={width}
          height={height}
          style={{ zIndex: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          preserveAspectRatio="none"
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
                backgroundColor: 'rgba(202, 37, 35, 0.2)',
                borderWidth: 3,
                borderColor: '#CA2523',
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
              <Ionicons name="information-circle-outline" size={60} color="#CA2523" />
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
              REGISTER TO CUSTOMIZE
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Inter',
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                marginBottom: 20,
                lineHeight: 24,
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              You’re signed in as staff, but you haven’t registered as an attendee. Register for the
              event to unlock profile customization. If you already registered, try logging out and
              back in. If issues persist, reinstall the app and sign in again.
            </Text>

            <View className="w-full max-w-[320px] mt-2 space-y-4">
              <TouchableOpacity
                onPress={handleBackPress}
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
                  marginBottom: 12,
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
                  Go Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                activeOpacity={0.8}
                style={{
                  backgroundColor: 'rgba(202, 37, 35, 0.8)',
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
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Background
        width={width}
        height={height}
        style={{ zIndex: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        preserveAspectRatio="none"
      />

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View
          style={{
            opacity: backButtonAnim,
            top: '10%',
            left: 20,
            zIndex: 99,
            transform: [
              {
                scale: backButtonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            onPress={handleBackPress}
            style={{
              backgroundColor: themeColor,
              borderRadius: 20,
              padding: 8,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <View className="p-5" style={{ position: 'relative' }}>
            <LSeparator zIndex={-1} />
            {isStaffOrAdmin ? (
              <StaffTeamBadge team={staffMe?.team || 'FULL TEAM'} />
            ) : (
              <ProfileHeader points={attendee!.points} />
            )}
            <ImageCarousel />
            <Separator />
            <UserInfo
              name={{
                first: user?.displayName?.split(' ')[0] || '',
                last: user?.displayName?.split(' ').slice(1).join(' ') || '',
              }}
              roles={user?.roles || []}
            />

            <Separator />

            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
              pointerEvents="box-none"
            >
              <ColorPicker />
              {isStaffOrAdmin ? (
                <StaffRolesList roles={user?.roles || []} />
              ) : (
                <>
                  <TagSelector />
                </>
              )}
              <Animated.View
                style={{
                  marginTop: 10,
                  opacity: notificationAnim,
                  transform: [
                    {
                      translateX: notificationAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                }}
                pointerEvents="box-none"
              >
                <View
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    paddingVertical: 20,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                  pointerEvents="box-none"
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: '700',
                        fontFamily: 'ProRacing',
                        marginBottom: 6,
                        textShadowColor: 'rgba(0, 0, 0, 0.5)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2,
                      }}
                    >
                      NOTIFICATIONS
                    </Text>
                    <Text
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: 12,
                        fontFamily: 'Inter',
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 1,
                      }}
                    >
                      Stay up to date at each turn!
                    </Text>
                  </View>
                  <NotificationToggle />
                </View>
              </Animated.View>

              {/* Haptics toggle */}
              <Animated.View
                style={{
                  marginTop: 10,
                  opacity: notificationAnim,
                  transform: [
                    {
                      translateX: notificationAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                }}
                pointerEvents="box-none"
              >
                <View
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    paddingVertical: 20,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                  pointerEvents="box-none"
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: '700',
                        fontFamily: 'ProRacing',
                        marginBottom: 6,
                        textShadowColor: 'rgba(0, 0, 0, 0.5)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2,
                      }}
                    >
                      HAPTICS
                    </Text>
                    <Text
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: 12,
                        fontFamily: 'Inter',
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 1,
                      }}
                    >
                      Feel the roar of the engines!
                    </Text>
                  </View>
                  <AnimatedSwitch
                    value={hapticsEnabled}
                    onValueChange={() => dispatch(toggleHaptics())}
                    width={60}
                    height={36}
                    onColor="#EDE053"
                    offColor="rgba(255, 255, 255, 0.4)"
                    thumbColor="#fff"
                    thumbOnIcon={<MaterialCommunityIcons name="vibrate" size={20} color="black" />}
                    thumbOffIcon={
                      <MaterialCommunityIcons name="vibrate-off" size={20} color="grey" />
                    }
                    iconAnimationType="rotate"
                    style={{}}
                  />
                </View>
              </Animated.View>

              {/* Logout button */}
              <Animated.View
                style={{
                  marginTop: 10,
                  paddingBottom: 20,
                  opacity: notificationAnim,
                  transform: [
                    {
                      translateX: notificationAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  onPress={handleLogout}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: 'rgba(220, 53, 69, 0.9)',
                    paddingVertical: 18,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    alignItems: 'center',
                    borderWidth: 2,
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
                      fontSize: 18,
                      fontWeight: '700',
                      fontFamily: 'ProRacing',
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    LOG OUT
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
