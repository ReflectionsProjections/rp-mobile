import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import Background from '@/assets/background/dottedBackground2.svg';

const { width, height } = Dimensions.get('window');

const LeaderboardGuestScreen = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations immediately
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
    ]);

    animationSequence.start();

    // Pulse animation for register button
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
  }, []);

  const handleRegisterPress = () => {
    router.push('/(auth)/sign-in');
    WebBrowser.openBrowserAsync('https://reflectionsprojections.org/register');
  };

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
          {/* Leaderboard themed icon */}
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
            <Ionicons name="podium-outline" size={60} color="#CA2523" />
          </View>

          {/* Main message */}
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
            JOIN THE LEADERBOARD!
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
            Register for R|P to secure your spot on the podium!
          </Text>

          {/* Register button */}
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

          {/* Return to sign in page */}
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/sign-in')}
            activeOpacity={0.7}
            style={{
              marginTop: 10,
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
};

export default LeaderboardGuestScreen;
