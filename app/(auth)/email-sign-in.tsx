import '@/global.css';
import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  Alert,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/api/api';
import Background from '@/assets/background/rp_background.svg';
import { LinearGradient } from 'expo-linear-gradient';

const BUTTON_COLOR = '#FF4CCC';
const BORDER_WIDTH = 7;
const BUTTON_HEIGHT = 66;

export default function EmailSignInScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendLink = async () => {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    try {
      setIsLoading(true);
      await api.post('/auth/magic-links', {
        email: trimmed,
        client: 'mobile',
        intent: 'login',
      });
      setSent(true);
    } catch (error: any) {
      console.error('Magic link request error:', error);
      Alert.alert(
        'Request Failed',
        error.message || 'Could not send the sign-in link. Please try again.',
        [{ text: 'OK' }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const trimmedCode = code.trim();
    if (!/^\d{6}$/.test(trimmedCode)) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code from the email.');
      return;
    }
    try {
      setIsVerifying(true);
      const response = await api.post('/auth/magic-links/verify-code', {
        email: email.trim(),
        code: trimmedCode,
        client: 'mobile',
      });
      await SecureStore.setItemAsync('jwt', response.data.token);

      const roles = await api.get('/auth/info').then((res) => res.data.roles);
      if (roles.length > 0) {
        router.replace('/(auth)/loading');
      } else {
        await SecureStore.deleteItemAsync('jwt');
        Alert.alert('Make sure to register for the event first!');
      }
    } catch (error: any) {
      const invalidCode = error?.response?.status === 401;
      Alert.alert(
        'Sign-In Failed',
        invalidCode
          ? 'This code is incorrect, expired, or already used. Check the newest email or request a new one.'
          : error.message || 'An error occurred during sign-in. Please try again.',
        [{ text: 'OK' }],
      );
    } finally {
      setIsVerifying(false);
    }
  };

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
          className="flex-1 items-center justify-center"
        >
          <View className="w-full items-center px-6" style={{ maxWidth: width * 0.85 }}>
            {sent ? (
              <>
                <Text
                  style={{
                    color: '#FFF',
                    fontFamily: 'Ethnocentric',
                    fontSize: 18,
                    letterSpacing: 1,
                    textAlign: 'center',
                    marginBottom: 16,
                  }}
                >
                  CHECK YOUR EMAIL
                </Text>
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 14,
                    textAlign: 'center',
                    marginBottom: 28,
                  }}
                >
                  If an account exists for {email.trim()}, a sign-in link and a 6-digit code are on
                  their way. Tap the link on this device, or enter the code below.
                </Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="123456"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  maxLength={6}
                  style={{
                    width: '100%',
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: '#FFF',
                    paddingHorizontal: 16,
                    fontSize: 18,
                    letterSpacing: 8,
                    textAlign: 'center',
                    marginBottom: 24,
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
                    onPress={handleVerifyCode}
                    disabled={isVerifying}
                    activeOpacity={0.85}
                    style={{
                      height: BUTTON_HEIGHT,
                      borderRadius: 18,
                      backgroundColor: BUTTON_COLOR,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isVerifying ? 0.7 : 1,
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFF',
                        fontFamily: 'Ethnocentric',
                        fontSize: 18,
                        letterSpacing: 1,
                      }}
                    >
                      {isVerifying ? 'VERIFYING...' : 'SIGN IN WITH CODE'}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </>
            ) : (
              <>
                <Text
                  style={{
                    color: '#FFF',
                    fontFamily: 'Ethnocentric',
                    fontSize: 18,
                    letterSpacing: 1,
                    textAlign: 'center',
                    marginBottom: 16,
                  }}
                >
                  SIGN IN WITH EMAIL
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  autoComplete="email"
                  style={{
                    width: '100%',
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: '#FFF',
                    paddingHorizontal: 16,
                    fontSize: 16,
                    marginBottom: 24,
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
                    onPress={handleSendLink}
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
                      style={{
                        color: '#FFF',
                        fontFamily: 'Ethnocentric',
                        fontSize: 18,
                        letterSpacing: 1,
                      }}
                    >
                      {isLoading ? 'SENDING...' : 'SEND SIGN-IN LINK'}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </>
            )}
            <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24 }}>
              <Text style={{ color: '#FFF', fontSize: 14, textDecorationLine: 'underline' }}>
                Back to sign-in
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
