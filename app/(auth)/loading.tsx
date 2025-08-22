import { useEffect, useRef } from 'react';
import { View, Text, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { validateAuthToken } from '@/lib/auth';
import { api } from '@/api/api';

export default function LoadingScreen() {
  const router = useRouter();
  const loadingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(loadingAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const checkAuthStatus = async () => {
      try {
        const jwt = await SecureStore.getItemAsync('jwt');

        if (jwt) {
          const isValid = await validateAuthToken();

          if (isValid) {
            const roles = await api.get('/auth/info').then((res) => res.data.roles);
            if (roles.length > 0) {
              router.replace('/(tabs)/home');
            } else {
              Alert.alert('Make sure to register for the event first!');
              router.replace('/(auth)/sign-in');
            }
          } else {
            await SecureStore.deleteItemAsync('jwt');
            router.replace('/(auth)/sign-in');
          }
        } else {
          router.replace('/(auth)/sign-in');
        }
      } catch (error) {
        router.replace('/(auth)/sign-in');
      }
    };

    setTimeout(() => {
      checkAuthStatus();
    }, 2000);
  }, [router, loadingAnimation]);

  const width = loadingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="flex-1 justify-center items-center bg-white p-5">
      <Text className="text-center font-proRacing mb-10">
        <Text className="text-[32px] font-bold text-black tracking-[2px]">reflections</Text>
        {'\n'}
        <Text className="text-[32px] font-bold text-[#F0363D] tracking-[2px]">projections</Text>
      </Text>

      <View className="w-4/5 h-3 bg-[#EEEEEE] rounded-md overflow-hidden mb-4">
        <Animated.View className="h-full bg-[#F0363D] rounded-md" style={{ width }} />
      </View>
      <Text className="text-[#F0363D] text-sm font-bold font-proRacing tracking-wider">
        REVVING ENGINES...
      </Text>
    </View>
  );
}
