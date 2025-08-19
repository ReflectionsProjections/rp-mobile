import '@/global.css';
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Pressable, Text, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import LottieView from 'lottie-react-native';
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

export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { width, height } = Dimensions.get('window');
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
    <SafeAreaView className="flex-1">
      <Background className="absolute inset-0 justify-center z-0" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 items-center justify-center"
      >
        <View className="flex-1 items-center justify-center px-5 w-full">
          <View className="relative bottom-10 items-center">
            <ReflectionsProjections width={300} height={32} />
          </View>

          <View className="w-full max-w-[340px] items-center">
            <View className="items-center z-10">
              <LoginIcon width={250} height={140} />
            </View>

            <View className="w-full bg-[#A3A3A3FF] rounded-2xl p-6 py-10 mt-[-30px]">
              <Text className="font-proRacing text-3xl text-center mt-5 mb-6 z-10">LOGIN</Text>
              
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

              <View className="flex-row items-center my-4 w-full">
                <View className="flex-1 h-[4px] bg-gray-200" />
                <ThemedText variant="h3" className="mx-2 text-black-600">
                  OR
                </ThemedText>
                <View className="flex-1 h-[4px] bg-gray-200" />
              </View>

              <View className="flex-row items-center justify-center">
                <ThemedText variant="body" className="text-black-600">
                  Learn more{' '}
                </ThemedText>
                <Pressable
                  onPress={() => {
                    WebBrowser.openBrowserAsync('https://reflectionsprojections.org');
                  }}
                >
                  <ThemedText variant="body-bold" className="underline text-black">
                    here!
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
