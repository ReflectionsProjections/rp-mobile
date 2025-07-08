import '@/global.css';
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Pressable, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import { api } from '@/api/api';
import { path } from '@/api/types';

import { ThemedText } from '@/components/themed/ThemedText';
import { SlantedButton } from '@/components/auth/SlantedButton';
import { SlantedButtonGroup } from '@/components/auth/SlantedButtonGroup';
import ReflectionsProjections from '@/assets/images/rp_2025.svg';
import LoginIcon from '@/assets/icons/logos/racingLogo.svg';
import { googleAuth } from '@/app/lib/auth';

export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async () => {
    try {
      setIsLoading(true);

      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'com.googleusercontent.apps.693438449476-tmppq76n7cauru3l0gvk32mufrd7eoq0',
        path: '/(auth)/callback',
      });

      const authResult = await googleAuth();
      if (!authResult || authResult.result.type !== 'success') {
        throw new Error('Authentication was cancelled or failed');
      }
      const { result, codeVerifier } = authResult;

      const response = await api.post(path('/auth/login/:platform', { platform: 'ios' }), {
        code: result.params.code,
        redirectUri: redirectUri,
        codeVerifier: codeVerifier,
      });

      await SecureStore.setItemAsync('jwt', response.data.token);

      router.replace('/(tabs)/home');
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
              <SlantedButton onPress={handleEmailLogin} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
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
