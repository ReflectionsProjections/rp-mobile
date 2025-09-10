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
import { logout as clearAuthTokens } from '@/lib/auth';
import { useLogout } from '@/api/tanstack/user';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Background from '@/assets/images/profile_background.svg';
import LottieView from 'lottie-react-native';
import { useAppSelector } from '@/lib/store';
import { RootState, useAppDispatch } from '@/lib/store';
import { useDataInitialization } from '@/hooks/useDataInitialization';
import * as WebBrowser from 'expo-web-browser';
import { NotificationToggle } from '@/components/misc/NotificationToggle';
import { api } from '@/api/api';
import { setAttendeeProfile } from '@/lib/slices/attendeeSlice';

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
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const logout = useLogout();
  const dispatch = useAppDispatch();

  // const day1Points = attendee?.pointsDay1 || 0;
  // const day2Points = attendee?.pointsDay2 || 0;
  // const day3Points = attendee?.pointsDay3 || 0;
  // const day4Points = attendee?.pointsDay4 || 0;
  // const day5Points = attendee?.pointsDay5 || 0;
  // const totalPoints = day1Points + day2Points + day3Points + day4Points + day5Points;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const backButtonAnim = useRef(new Animated.Value(0)).current;
  const notificationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
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
            logout();

            await clearAuthTokens();

            router.replace('/(auth)/sign-in');
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleRegisterPress = () => {
    router.push('/(auth)/sign-in');
    WebBrowser.openBrowserAsync('https://reflectionsprojections.org/register');
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    console.log('Notifications:', value ? 'enabled' : 'disabled');
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

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );

    setTimeout(() => {
      pulseAnimation.start();
    }, 2000);

    const fetchAttendeeData = async () => {
      try {
        const response = await api.get('/attendee');

        if (response.data) {
          dispatch(setAttendeeProfile(response.data));
        }
      } catch (error: any) {
        Alert.alert('Error response data:', error.message);
      }
    };

    fetchAttendeeData();
  }, []);

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
              Make sure to register for R|P to track your points and unlock exclusive rewards!
            </Text>

            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
            >
              <TouchableOpacity
                onPress={handleRegisterPress}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#CA2523',
                  paddingVertical: 18,
                  paddingHorizontal: 40,
                  borderRadius: 12,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 12,
                  minWidth: 220,
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
                  REGISTER NOW
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Guest continue option */}
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={{
                marginTop: 20,
                paddingVertical: 12,
                paddingHorizontal: 24,
              }}
            >
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 14,
                  fontFamily: 'Inter',
                  textAlign: 'center',
                  textDecorationLine: 'underline',
                }}
              >
                Continue as Guest
              </Text>
            </TouchableOpacity>

            {/* Go back to sign in */}
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/sign-in')}
              activeOpacity={0.7}
              style={{
                marginTop: 20,
                paddingVertical: 12,
                paddingHorizontal: 24,
              }}
            >
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 14,
                  fontFamily: 'Inter',
                  textAlign: 'center',
                  textDecorationLine: 'underline',
                }}
              >
                Return to Sign In Page
              </Text>
            </TouchableOpacity>
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

      <SafeAreaView style={{ position: 'absolute', top: 90, left: 20, zIndex: 10 }}>
        <Animated.View
          style={{
            opacity: backButtonAnim,
            transform: [
              {
                scale: Animated.multiply(
                  backButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                  pulseAnim,
                ),
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
      </SafeAreaView>

      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 300 }} style={{ paddingBottom: 100 }}>
          <View className="p-5" style={{ position: 'relative' }}>
            <LSeparator zIndex={-1} />
            <ProfileHeader points={attendee?.points || 0} />
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
              <TagSelector />
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
                      Receive updates about events
                    </Text>
                  </View>
                  <NotificationToggle />
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
