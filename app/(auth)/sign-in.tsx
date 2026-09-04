import '@/global.css';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
  useWindowDimensions,
  Animated,
  TextInput,
  ScrollView,
} from 'react-native';
import { TouchableOpacity } from '@/components/ui/HapticControls';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '@/api/api';
import Background from '@/assets/background/rp_background.svg';
import { LinearGradient } from 'expo-linear-gradient';

const BUTTON_COLOR = '#FF4CCC';
const BORDER_WIDTH = 7;
const BUTTON_HEIGHT = 66;
export default function SignInScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { width, height } = useWindowDimensions();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(50)).current;
  const handleEmailLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      Alert.alert('Enter your email', 'We need an email address to send your sign-in link.');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/auth/magic-links', {
        email: normalizedEmail,
        client: 'mobile',
        intent: 'login',
      });
      Alert.alert('Check your email', 'Tap the link we sent to finish signing in.');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Could not send link',
        error.response?.data?.details || 'Please check your email address and try again.',
        [{ text: 'OK' }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    router.replace({ pathname: '/(auth)/loading', params: { guest: '1' } });
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
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: Math.max(20, Math.min(32, width * 0.06)),
              paddingVertical: 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={{
                width: '100%',
                maxWidth: 480,
                alignItems: 'center',
                opacity: fadeAnim,
                transform: [{ translateY: cardSlideAnim }],
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
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#6B7280"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                editable={!isLoading}
                style={{
                  width: '100%',
                  marginBottom: 16,
                  borderRadius: 18,
                  backgroundColor: '#FFFFFF',
                  color: '#111827',
                  fontSize: 17,
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                }}
              />
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
                  disabled={isLoading}
                  activeOpacity={0.85}
                  style={{
                    height: BUTTON_HEIGHT,
                    borderRadius: 18,
                    backgroundColor: BUTTON_COLOR,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                    style={{
                      color: '#FFF',
                      fontFamily: 'Ethnocentric',
                      fontSize: 18,
                      letterSpacing: 1,
                    }}
                  >
                    {isLoading ? 'SENDING LINK...' : 'SIGN IN WITH A MAGIC LINK'}
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
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
