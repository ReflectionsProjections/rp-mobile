import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoadingScreen() {
    const router = useRouter();
    const loadingAnimation = useRef(new Animated.Value(0)).current;
    const [loadingComplete, setLoadingComplete] = useState(false);

    useEffect(() => {
        Animated.timing(loadingAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
        }).start();

        const checkAuthStatus = async () => {
            try {
                setTimeout(() => {
                    setLoadingComplete(true);
                    router.replace('/(auth)/sign-in');
                }, 2000);
            } catch (error) {
                console.error('Error checking auth status:', error);
                router.replace('/(auth)/sign-in');
            }
        };

        checkAuthStatus();
    }, []);

    const width = loadingAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <Text style={styles.titleContainer}>
                <Text style={styles.titleTop}>reflections</Text>
                {'\n'}
                <Text style={styles.titleBottom}>projections</Text>
            </Text>

            <View style={styles.loadingContainer}>
                <Animated.View style={[styles.loadingProgress, { width }]} />
            </View>
            <Text style={styles.loadingText}>REVVING ENGINES...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 40,
        fontFamily: 'RacingSansOne',
        letterSpacing: 2,
    },
    accentText: {
        color: '#F0363D',
    },
    loadingContainer: {
        width: '80%',
        height: 12,
        backgroundColor: '#EEEEEE',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 15,
    },
    loadingProgress: {
        height: '100%',
        backgroundColor: '#F0363D',
        borderRadius: 6,
    },
    loadingText: {
        color: '#F0363D',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'RacingSansOne', // Changed to RacingSansOne font
        letterSpacing: 1,
    },

    titleContainer: {
        textAlign: 'center',
        fontFamily: 'RacingSansOne',
        marginBottom: 40,
    },
    titleTop: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
        letterSpacing: 2,
    },
    titleBottom: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F0363D',
        letterSpacing: 2,
    },
});