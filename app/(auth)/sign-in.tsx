import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { googleAuth } from './auth';
import LoginIcon from '../../assets/images/login.svg';
import ReflectionsProjections from '../../assets/images/rp_2025.svg';
import { LinearGradient } from 'expo-linear-gradient';

// import { VITE_GOOGLE_OAUTH_CLIENT_ID } from '@env';

const VITE_GOOGLE_OAUTH_CLIENT_ID = "" // todo: replace with google auth id 

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignIn = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        setIsLoading(true);
        setError('');
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            router.replace('/(tabs)/explore');
        }, 1000);
    };


    const openLink = async () => {
        await WebBrowser.openBrowserAsync(googleAuth(VITE_GOOGLE_OAUTH_CLIENT_ID, true));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.outerContainer}
        >

            <View style={{ marginTop: 77, marginLeft: 57 }}>
                <ReflectionsProjections width={280} height={46} />
            </View>
            <View style={styles.card}>
                <LoginIcon width={150} height={150} />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#222"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#222"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleSignIn}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'STARTING ENGINES...' : 'LOGIN'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openLink}>
                    <Text style={{ color: '#4285F4', fontWeight: 'bold', marginBottom: 10 }}>Sign in with Google</Text>
                </TouchableOpacity>
                <View style={styles.dividerRow}>
                    <View style={styles.divider} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.divider} />
                </View>
                <View style={styles.signupRow}>
                    <Text style={styles.signupText}>Don't have an account? </Text>

                </View>
            </View>
        </KeyboardAvoidingView>
    );
}



const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    keyboardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'RacingSansOne',
        marginTop: 40,
        marginBottom: 20,
        letterSpacing: 3,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 3 },
        textShadowRadius: 6,
        textAlign: 'center',
    },

    card: {

        width: 339,
        height: 374,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },

    errorText: {
        color: '#F0363D',
        fontWeight: 'bold',
        marginBottom: 12,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
    },
    inputWrapper: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        height: 52,
        fontSize: 16,
        color: '#111',
        fontFamily: 'Inter-Regular',
        paddingHorizontal: 16,
    },
    button: {
        width: '100%',
        height: 52,
        backgroundColor: '#111',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#888',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'RacingSansOne',
        letterSpacing: 2,
    },
    googleButton: {
        marginBottom: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    googleButtonText: {
        color: '#4285F4',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 12,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    orText: {
        marginHorizontal: 16,
        color: '#888',
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
        fontSize: 14,
    },
    signupRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    signupText: {
        color: '#666',
        fontFamily: 'Inter-Regular',
        fontSize: 15,
    },
    signupLink: {
        color: '#111',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontFamily: 'Inter-Bold',
        fontSize: 15,
    },
});


