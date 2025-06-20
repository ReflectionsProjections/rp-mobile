import '@/global.css';
import React from 'react';
import { View, KeyboardAvoidingView, Platform, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed/ThemedText';
import { SlantedButton } from '@/components/themed/SlantedButton';
import { SlantedButtonGroup } from '@/components/themed/SlantedButtonGroup';
import ReflectionsProjections from '@/assets/images/rp_2025.svg';
import LoginIcon from '@/assets/icons/logos/racingLogo.svg';

export default function SignInScreen() {
    const router = useRouter();

    const handleEmailLogin = () => {
        router.replace('/(tabs)/home');
    };

    const handleGuestLogin = () => {
        // Navigate directly to the app
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
                        <Text className="font-racing text-3xl text-center mt-5 mb-6">LOGIN</Text>
                        
                        <SlantedButtonGroup>
                            <SlantedButton onPress={handleEmailLogin}>
                                Continue with Email
                            </SlantedButton>
                            <View className="h-px bg-white" />
                            <SlantedButton onPress={handleGuestLogin}>
                                Continue as Guest
                            </SlantedButton>
                        </SlantedButtonGroup>
    
                        <View className="flex-row items-center my-4 w-full">
                            <View className="flex-1 h-[4px] bg-gray-200" />
                            <ThemedText variant="body-bold" className="mx-2 text-gray-600">OR</ThemedText>
                            <View className="flex-1 h-[4px] bg-gray-200" />
                        </View>
                        
                        <View className="flex-row items-center justify-center">
                            <ThemedText variant="body" className="text-gray-600">Don't have an account? </ThemedText>
                            <Pressable onPress={() => { /* Navigate to Sign Up */ }}>
                                <ThemedText variant="body-bold" className="underline text-black">Register</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}


