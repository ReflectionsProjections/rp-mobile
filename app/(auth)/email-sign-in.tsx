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
  const [isLoading, setIsLoading] = useState(false);
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
                  If an account exists for {email.trim()}, a sign-in link is on its way. Tap the
                  link on this device to sign in.
                </Text>
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
