import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <Text className="text-2xl mb-5 text-black dark:text-white">Welcome!</Text>
      <Pressable
        className="bg-blue-600 px-6 py-3 rounded-lg"
        onPress={() => router.push('/(tabs)/home')}
      >
        <Text className="text-white text-base font-semibold">Go to Tabs</Text>
      </Pressable>
    </View>
  );
}