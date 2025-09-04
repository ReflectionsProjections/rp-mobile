import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import ProfileHeader from '@/components/profile/Header';
import ImageCarousel from '@/components/profile/ImageCarousel';
import UserInfo from '@/components/profile/UserInfo';
import ColorPicker from '@/components/profile/ColorPicker';
import { api } from '@/api/api';
import { RoleObject } from '@/api/types';
import { logout } from '@/lib/auth';
import { router } from 'expo-router';
import { AnimatedSwitch } from '@/components/switch/AnimatedSwitch';
import { Ionicons } from '@expo/vector-icons';

import Background from '@/assets/images/profile_background.svg';
import LottieView from 'lottie-react-native';

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
  const [user, setUser] = useState<RoleObject | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const backButtonAnim = useRef(new Animated.Value(0)).current;
  const notificationAnim = useRef(new Animated.Value(0)).current;
  const logoutAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
            const success = await logout();
            if (success) {
              router.replace('/(auth)/sign-in');
            } else {
              router.replace('/(auth)/sign-in');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    // Here you would typically call an API to update notification preferences
    console.log('Notifications:', value ? 'enabled' : 'disabled');
  };

  const handleBackPress = () => {
    router.back();
  };

  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.timing(backButtonAnim, {
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
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoutAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    setTimeout(() => {
      pulseAnimation.start();
    }, 2000);

    let timeoutId: ReturnType<typeof setTimeout>;
    const fetchAttendee = async () => {
      const start = Date.now();
      try {
        const response = await api.get('/auth/info');
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user info');
      } finally {
        const elapsed = Date.now() - start;
        const remaining = 500 - elapsed;
        timeoutId = setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
      }
    };

    const fetchPoints = async () => {
      try {
        const response = await api.get('/attendee/points');
        setPoints(response.data.points || 0);
      } catch (err) {
        console.error('Failed to fetch points:', err);
      }
    };

    fetchAttendee();
    fetchPoints();
    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
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

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-500 justify-center items-center">
        <Text className="text-xl text-white text-center px-6">
          Make sure to register for R|P first!
        </Text>
      </SafeAreaView>
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
              backgroundColor: '#CA2523',
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="p-5" style={{ position: 'relative' }}>
            <LSeparator zIndex={-1} />
            <ProfileHeader points={points} />
            <ImageCarousel />
            <Separator />
            <UserInfo
              name={{
                first: user?.displayName?.split(' ')[0] || '',
                last: user?.displayName?.split(' ').slice(1).join(' ') || '',
              }}
              roles={user?.roles || []}
            />
            {/* <ColorPicker /> */}

            <Separator />

            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Animated.View
                style={{
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
                <View
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    paddingVertical: 20,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    marginTop: 20,
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
                      Receive updates about events and merch
                    </Text>
                  </View>
                  <AnimatedSwitch
                    value={notificationsEnabled}
                    onValueChange={handleNotificationToggle}
                    width={60}
                    height={36}
                    onColor="#4CD964"
                    offColor="rgba(255, 255, 255, 0.4)"
                    thumbColor="#fff"
                    thumbOffIcon={<Ionicons name="notifications-off" size={20} color="grey" />}
                    thumbOnIcon={<Ionicons name="notifications" size={20} color="black" />}
                    iconAnimationType="fade"
                  />
                </View>
              </Animated.View>

              <Animated.View
                style={{
                  opacity: logoutAnim,
                  transform: [
                    {
                      translateY: logoutAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  onPress={handleLogout}
                  style={{
                    backgroundColor: 'rgba(220, 53, 69, 0.9)',
                    paddingVertical: 18,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    marginTop: 16,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                    zIndex: 100,
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
