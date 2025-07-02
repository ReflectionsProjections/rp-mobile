import '@/global.css';
import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Pressable, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/api/api';

import { ThemedText } from '@/components/themed/ThemedText';
import { SlantedButton } from '@/components/auth/SlantedButton';
import { SlantedButtonGroup } from '@/components/auth/SlantedButtonGroup';
import ReflectionsProjections from '@/assets/images/rp_2025.svg';
import LoginIcon from '@/assets/icons/logos/racingLogo.svg';
import { OAUTH_CONFIG } from '@/app/lib/config';

export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: OAUTH_CONFIG.IOS_GOOGLE_CLIENT_ID
    });
  }, []);

  const handleEmailLogin = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const response = await api.post('/auth/login/mobile', {
        idToken: userInfo.data?.idToken || '',
      });
      await SecureStore.setItemAsync('jwt', response.data.token);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 items-center justify-center bg-gray-500"
    >
      <View className="flex-1 items-center justify-center px-5 w-full">
        <View className="relative bottom-10 items-center">
          <ReflectionsProjections width={300} height={32} />
        </View>

        <View className="w-full max-w-[340px] items-center">
          <View className="items-center z-10">
            <LoginIcon width={240} height={120} />
          </View>

          <View className="w-full bg-white rounded-2xl p-6 py-10 mt-[-30px]">
            <Text className="font-proRacing text-3xl text-center mt-5 mb-6">LOGIN</Text>

            <SlantedButtonGroup>
              <SlantedButton 
                onPress={handleEmailLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Continue with Email'}
              </SlantedButton>
              <View className="h-px bg-white" />
              <SlantedButton onPress={handleGuestLogin}>Continue as Guest</SlantedButton>
            </SlantedButtonGroup>

            <View className="flex-row items-center my-4 w-full">
              <View className="flex-1 h-[4px] bg-gray-200" />
              <ThemedText variant="h3" className="mx-2 text-gray-600">
                OR
              </ThemedText>
              <View className="flex-1 h-[4px] bg-gray-200" />
            </View>

            <View className="flex-row items-center justify-center">
              <ThemedText variant="body" className="text-gray-600">
                Don't have an account?{' '}
              </ThemedText>
              <Pressable
                onPress={() => {
                  /* Navigate to Sign Up */
                }}
              >
                <ThemedText variant="body-bold" className="underline text-black">
                  Register
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
