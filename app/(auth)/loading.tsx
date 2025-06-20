import { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';

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
        setTimeout(() => {
          router.replace('/(auth)/sign-in');
        }, 2000);
      } catch (error) {
        console.error('Error checking auth status:', error);
        router.replace('/(auth)/sign-in');
      }
    };

    checkAuthStatus();
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
