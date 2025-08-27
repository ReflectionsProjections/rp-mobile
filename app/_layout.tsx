import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import React, { useLayoutEffect } from 'react';
import { Text } from 'react-native';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useFirebaseNotifications } from '@/hooks/useFirebaseNotifications';

SplashScreen.preventAutoHideAsync();

(React as any).useInsertionEffect = useLayoutEffect;

const RNText = Text as any;
RNText.defaultProps = {
  ...(RNText.defaultProps || {}),
  style: {
    ...(RNText.defaultProps?.style || {}),
    fontFamily: 'ProRacing',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useFirebaseNotifications();
  const [loaded] = useFonts({
    RacingSansOne: require('../assets/fonts/RacingSansOne-Regular.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ProRacing: require('../assets/fonts/ProRacing-Regular.otf'),
    ProRacingSlant: require('../assets/fonts/ProRacingSlant.otf'),
    Magistral: require('../assets/fonts/magistral-light.ttf'),
    MagistralMedium: require('../assets/fonts/magistral-medium.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: 'ios_from_left',
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
