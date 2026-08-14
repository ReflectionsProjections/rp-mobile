import '@/global.css';
import React, { useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  useWindowDimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Background from '@/assets/background/rp_background.svg';
import { LinearGradient } from 'expo-linear-gradient';

const BUTTON_COLOR = '#FF4CCC';
const BORDER_WIDTH = 7;
const BUTTON_HEIGHT = 66;
export default function SignInScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(50)).current;
  const handleEmailLogin = () => {
    router.push('/(auth)/email-sign-in');
  };

  const handleGuestLogin = () => {
    router.replace('/(tabs)/home');
  };

  useEffect(() => {
    // Start animations on mount
    const animationSequence = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start();
  }, []);

  return (
    <View className="flex-1">
      <Background
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        preserveAspectRatio="none"
        pointerEvents="none"
      />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 items-center justify-center"
        >
          <Animated.View
            className="w-full items-center px-6"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: cardSlideAnim }],
              maxWidth: width * 0.85,
              marginTop: 80,
            }}
          >
            <View
              style={{
                width: '100%',
                marginBottom: 28,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  width: '92%',
                  height: BUTTON_HEIGHT,
                  borderRadius: 20,
                  backgroundColor: '#FF4CCC',
                  opacity: 0.95,
                  shadowColor: '#FF4CCC',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.9,
                  shadowRadius: 30,

                  elevation: 20,
                }}
              />

              <LinearGradient
                colors={['#373792', '#F52DBC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  width: '100%',
                  height: BUTTON_HEIGHT + BORDER_WIDTH * 2,
                  borderRadius: 20,
                  padding: BORDER_WIDTH,
                }}
              >
                <TouchableOpacity
                  onPress={handleEmailLogin}
                  activeOpacity={0.85}
                  style={{
                    height: BUTTON_HEIGHT,
                    borderRadius: 18,
                    backgroundColor: BUTTON_COLOR,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFF',
                      fontFamily: 'Ethnocentric',
                      fontSize: 18,
                      letterSpacing: 1,
                    }}
                  >
                    SIGN IN WITH EMAIL
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <View
              style={{
                width: '100%',
                marginTop: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  width: '92%',
                  height: BUTTON_HEIGHT,
                  borderRadius: 20,
                  backgroundColor: '#FF4CCC',
                  opacity: 0.95,
                  shadowColor: '#FF4CCC',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.9,
                  shadowRadius: 30,

                  elevation: 20,
                }}
              />

              <LinearGradient
                colors={['#373792', '#F52DBC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  width: '100%',
                  height: BUTTON_HEIGHT + BORDER_WIDTH * 2,
                  borderRadius: 20,
                  padding: BORDER_WIDTH,
                }}
              >
                <TouchableOpacity
                  onPress={handleGuestLogin}
                  activeOpacity={0.85}
                  style={{
                    height: BUTTON_HEIGHT,
                    borderRadius: 18,
                    backgroundColor: BUTTON_COLOR,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'Ethnocentric',
                      fontSize: 18,
                      letterSpacing: 1,
                    }}
                  >
                    CONTINUE AS GUEST
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
