import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';

const SignInScreen = () => {
    const handleLogin = () => {
        console.log('Login pressed');
        // Add navigation to login screen
    };

    const handleRegister = () => {
        console.log('Register pressed');
        // Add navigation to register screen
    };

    const handleGuest = () => {
        console.log('Continue as Guest pressed');
        // Add navigation to main app as guest
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Logo and welcome section */}
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/150' }}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.welcomeText}>Welcome to App Name</Text>
                <Text style={styles.subText}>Sign in to continue</Text>
            </View>

            {/* Buttons section */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.primaryButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleRegister}
                >
                    <Text style={styles.secondaryButtonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.ghostButton}
                    onPress={handleGuest}
                >
                    <Text style={styles.ghostButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        justifyContent: 'space-between',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    buttonContainer: {
        padding: 20,
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#4361ee',
        borderRadius: 8,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#4361ee',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    secondaryButtonText: {
        color: '#4361ee',
        fontSize: 16,
        fontWeight: '600',
    },
    ghostButton: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ghostButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
});

export default SignInScreen;