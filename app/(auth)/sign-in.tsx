import '@/global.css';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import { api } from '@/api/api';
import { path } from '@/api/types';
import * as WebBrowser from 'expo-web-browser';
import { ThemedText } from '@/components/themed/ThemedText';
import { SlantedButton } from '@/components/auth/SlantedButton';
import { SlantedButtonGroup } from '@/components/auth/SlantedButtonGroup';
import ReflectionsProjections from '@/assets/images/rp_2025.svg';
import LoginIcon from '@/assets/icons/logos/rp_signin_logo.svg';
import Background from '@/assets/background/rp_background.svg';
import { googleAuth } from '@/lib/auth';
import { OAUTH_CONFIG } from '@/lib/config';

const { width, height } = Dimensions.get('window');

export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.9)).current;
  const cardSlideAnim = useRef(new Animated.Value(50)).current;
  const handleEmailLogin = async () => {
    try {
      setIsLoading(true);

      const redirectUri = AuthSession.makeRedirectUri({
        scheme:
          Platform.OS === 'android'
            ? OAUTH_CONFIG.ANDROID_REDIRECT_SCHEME
            : OAUTH_CONFIG.IOS_REDIRECT_SCHEME,
        path: OAUTH_CONFIG.REDIRECT_PATH,
      });

      const authResult = await googleAuth();
      if (!authResult || authResult.result.type !== 'success') {
        throw new Error('Authentication was cancelled or failed');
      }
      const { result, codeVerifier } = authResult;

      const response = await api.post(path('/auth/login/:platform', { platform: Platform.OS }), {
        code: result.params.code,
        redirectUri: redirectUri,
        codeVerifier: codeVerifier,
      });

      await SecureStore.setItemAsync('jwt', response.data.token);
      const roles = await api.get('/auth/info').then((res) => res.data.roles);
      if (roles.length > 0) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Make sure to register for the event first!');
        await SecureStore.deleteItemAsync('jwt');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login. Please try again.',
        [{ text: 'OK' }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    router.replace('/(tabs)/home');
  };

  useEffect(() => {
    // Start animations on mount
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
        Animated.timing(cardSlideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animationSequence.start();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <Background className="absolute inset-0 justify-center z-0" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 items-center justify-center"
      >
        <View className="flex-1 items-center justify-center px-5 w-full">
          <Animated.View
            className="relative bottom-10 items-center"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: logoScaleAnim }],
            }}
          >
            <ReflectionsProjections width={300} height={32} />
          </Animated.View>

          <View className="w-full max-w-[340px] items-center">
            <Animated.View
              className="items-center z-10"
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <LoginIcon width={250} height={140} />
            </Animated.View>

            <Animated.View
              className="w-full bg-[#A3A3A3FF] rounded-2xl p-6 py-10 mt-[-30px]"
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: cardSlideAnim }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <Text
                className="font-proRacing text-3xl text-center mt-5 mb-6 z-10"
                style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}
              >
                LOGIN
              </Text>

              {/* <LottieView
                source={require('@/assets/lottie/rp_animation.json')}
                autoPlay
                loop
                style={{
                  position: 'absolute',
                  width: width * 4.5,
                  height: height * 1.12,
                  zIndex: 0,
                  alignSelf: 'center',
                  top: -height * 0.36
                }}
                speed={1.5}
              /> */}

              <View className="relative">
                <SlantedButtonGroup>
                  <SlantedButton onPress={handleEmailLogin} disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Login with Google'}
                  </SlantedButton>
                  <View className="h-px bg-white" />
                  <SlantedButton onPress={handleGuestLogin}>Continue as Guest</SlantedButton>
                </SlantedButtonGroup>
              </View>

              <View className="flex-row items-center my-6 w-full">
                <View className="flex-1 h-[2px] bg-gray-300" />
                <ThemedText
                  variant="h3"
                  className="mx-4 text-black-600"
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    fontFamily: 'Magistral',
                  }}
                >
                  OR
                </ThemedText>
                <View className="flex-1 h-[2px] bg-gray-300" />
              </View>

              <View className="flex-row items-baseline justify-center">
                <ThemedText
                  variant="body"
                  className="text-black-600"
                  style={{
                    fontSize: 18,
                    fontFamily: 'Magistral',
                  }}
                >
                  Register for R|P
                </ThemedText>
                <Pressable
                  onPress={() => {
                    WebBrowser.openBrowserAsync('https://reflectionsprojections.org/register');
                  }}
                  style={{
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                  }}
                >
                  <ThemedText
                    variant="body-bold"
                    className="underline text-black"
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      fontFamily: 'Magistral',
                      color: '#CA2523',
                    }}
                  >
                    here!
                  </ThemedText>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
