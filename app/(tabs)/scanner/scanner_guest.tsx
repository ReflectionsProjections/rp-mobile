import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ScannerGuestScreen = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

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
  }, []);

  return (
    <View className="flex-1">
      {/* <Background
        width={width}
        height={height}
        style={{ zIndex: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        preserveAspectRatio="none"
      /> */}
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
          {/* QR Code themed icon */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderWidth: 3,
              borderColor: 'rgba(255, 255, 255, 0.94)',
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
            <Ionicons name="qr-code-outline" size={60} color="#ffffff" />
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
            SCAN TO EARN!
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
            Sign in to get your QR code and start earning points at events!
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
};

export default ScannerGuestScreen;
