import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import React, { useLayoutEffect, useRef } from 'react';
import { Alert, Linking, Platform, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import toastConfig from '@/components/toast/ToastConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppProvider from '@/app-provider';
import { checkVersion } from 'react-native-check-version';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useFirebaseNotifications } from '@/hooks/useFirebaseNotifications';
import { AutoRefreshProvider } from '@/components/AutoRefreshProvider';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

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
  const versionCheckedRef = useRef(false);
  
  const [loaded] = useFonts({
    RacingSansOne: require('../assets/fonts/RacingSansOne-Regular.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ProRacing: require('../assets/fonts/ProRacing-Regular.otf'),
    ProRacingSlant: require('../assets/fonts/ProRacingSlant.otf'),
    Magistral: require('../assets/fonts/magistral-light.ttf'),
    MagistralMedium: require('../assets/fonts/magistral-medium.ttf'),
  });

  const handleUpdate = async () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/us/app/r-p-2025/id6744465190');
    } else {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.reflectionsprojections');
    }
    
    // Don't save timestamp here - let the user come back and see the prompt again
    // until they actually update the app
  };

  // Helper function to clear update prompt history (for testing)
  const clearUpdatePromptHistory = async () => {
    try {
      await AsyncStorage.removeItem('update_prompt_shown');
      console.log('Update prompt history cleared');
    } catch (error) {
      console.error('Error clearing update prompt history:', error);
    }
  };

  useEffect(() => {
    if (loaded && !versionCheckedRef.current) {
      SplashScreen.hideAsync();
      versionCheckedRef.current = true;
      
      // Check for app updates only once after fonts are loaded
      const checkAppVersion = async () => {
        try {
          const version = await checkVersion();
          console.log('Version check result:', version);
          
          if (version.needsUpdate) {
            const lastShown = await AsyncStorage.getItem('update_prompt_shown');
            const now = Date.now();
            const oneDayMs = 24 * 60 * 60 * 1000; // 24 hours
            const isMajorUpdate = version.updateType === 'major';
            const shouldShowPrompt = isMajorUpdate || 
                                   !lastShown || 
                                   (now - parseInt(lastShown, 10)) > oneDayMs;
            
            if (shouldShowPrompt) {
              const isForced = isMajorUpdate;
              
              Alert.alert(
                isForced ? 'Update Required' : 'Update Available',
                isForced 
                  ? 'This update is required to continue using the app. Please update now.'
                  : 'Please update to the latest version of the app.',
                isForced 
                  ? [
                      { text: 'Update Now', onPress: () => handleUpdate() }
                    ]
                    : [
                        { text: 'Later', style: 'cancel', onPress: () => {
                          // Only save timestamp when user dismisses (not when they click Update)
                          AsyncStorage.setItem('update_prompt_shown', now.toString());
                        }},
                        { text: 'Update', onPress: () => handleUpdate() }
                      ]
              );
            }
          }
        } catch (error) {
          console.error('Failed to check app version:', error);
        }
      };
      
      setTimeout(checkAppVersion, 1000);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <AutoRefreshProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen
                  name="(auth)"
                  options={{
                    headerShown: false,
                    animation: 'ios_from_left',
                  }}
                />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="screens/profile" options={{ headerShown: false }} />
              </Stack>
            </BottomSheetModalProvider>
            <StatusBar style="light" />
            <Toast config={toastConfig as any} />
          </ThemeProvider>
        </AutoRefreshProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
