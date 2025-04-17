import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

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

        try {
            setTimeout(() => {
                setIsLoading(false);
                router.replace('/(tabs)/explore');
            }, 1000);
        } catch (err) {
            setIsLoading(false);
            setError('Invalid email or password');
            console.error('Sign in error:', err);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inner}>
                <Text style={styles.titleTop}>reflections</Text>
                <Text style={styles.titleBottom}>projections</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>EMAIL</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholder="you@example.com"
                        placeholderTextColor="#666"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>PASSWORD</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="••••••••"
                        placeholderTextColor="#666"
                    />
                </View>

                <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => console.log('Forgot password')}
                >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleSignIn}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'STARTING ENGINES...' : 'START YOUR ENGINES'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>New to the track? </Text>
                    <TouchableOpacity onPress={() => console.log('Navigate to sign up')}>
                        <Text style={styles.signUpLink}>REGISTER NOW</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* <View style={styles.bottomStripe}></View> */}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    titleTop: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'RacingSansOne',
        letterSpacing: 2,
    },
    titleBottom: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F0363D',
        marginBottom: 40,
        fontFamily: 'RacingSansOne',
        letterSpacing: 2,
    },
    errorText: {
        color: '#F0363D',
        marginBottom: 15,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputLabel: {
        color: '#F0363D',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        letterSpacing: 1,
        fontFamily: 'Inter-Bold',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 2,
        borderColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: 'Inter-Regular',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: '#999',
        fontSize: 12,
        fontFamily: 'Inter-Regular',
    },
    button: {
        width: '100%',
        height: 55,
        backgroundColor: '#F0363D',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    buttonDisabled: {
        backgroundColor: '#5c1417',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily: 'RacingSansOne',
    },
    signUpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signUpText: {
        color: '#999',
        fontFamily: 'Inter-Regular',
    },
    signUpLink: {
        color: '#F0363D',
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
    },

});


// app/(auth)/sign-in.tsx
// import { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
// import { useRouter } from 'expo-router';
// // import RacingCheckeredFlag from '../../components/RacingCheckeredFlag';

// export default function SignInScreen() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');

//     const router = useRouter();

//     const handleSignIn = async () => {
//         if (!email || !password) {
//             setError('Please fill in all fields');
//             return;
//         }

//         setIsLoading(true);
//         setError('');

//         try {
//             // Simulate authentication process
//             setTimeout(() => {
//                 setIsLoading(false);
//                 router.replace('/(tabs)');
//             }, 1000);
//         } catch (err) {
//             setIsLoading(false);
//             setError('Invalid email or password');
//             console.error('Sign in error:', err);
//         }
//     };

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={styles.container}
//         >
//             <View style={styles.inner}>


//                 <View style={{ position: 'absolute', top: 30, right: 20 }}>
//                     {/* <RacingCheckeredFlag size={15} rows={2} columns={4} /> */}
//                 </View>

//                 <Text style={styles.title}>reflections <Text style={styles.accentText}>projections</Text></Text>

//                 {error ? <Text style={styles.errorText}>{error}</Text> : null}

//                 <View style={styles.inputContainer}>
//                     <Text style={styles.inputLabel}>EMAIL</Text>
//                     <TextInput
//                         style={styles.input}
//                         value={email}
//                         onChangeText={setEmail}
//                         autoCapitalize="none"
//                         keyboardType="email-address"
//                         placeholderTextColor="#666"
//                     />
//                 </View>

//                 <View style={styles.inputContainer}>
//                     <Text style={styles.inputLabel}>PASSWORD</Text>
//                     <TextInput
//                         style={styles.input}
//                         value={password}
//                         onChangeText={setPassword}
//                         secureTextEntry
//                         placeholderTextColor="#666"
//                     />
//                 </View>

//                 <TouchableOpacity
//                     style={styles.forgotPassword}
//                     onPress={() => console.log('Forgot password')}
//                 >
//                     <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.button, isLoading && styles.buttonDisabled]}
//                     onPress={handleSignIn}
//                     disabled={isLoading}
//                 >
//                     <Text style={styles.buttonText}>
//                         {isLoading ? 'STARTING ENGINES...' : 'START YOUR ENGINES'}
//                     </Text>
//                 </TouchableOpacity>

//                 <View style={styles.signUpContainer}>
//                     <Text style={styles.signUpText}>New to the track? </Text>
//                     <TouchableOpacity onPress={() => console.log('Navigate to sign up')}>
//                         <Text style={styles.signUpLink}>REGISTER NOW</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <View style={styles.bottomStripe}></View>
//         </KeyboardAvoidingView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FFFFFF',
//     },
//     inner: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     logo: {
//         width: 100,
//         height: 100,
//         marginBottom: 20,
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#000000',
//         marginBottom: 40,
//         fontFamily: 'RacingSansOne', // Using Racing Sans One font
//         letterSpacing: 2,
//     },
//     accentText: {
//         color: '#F0363D',
//     },
//     errorText: {
//         color: '#F0363D',
//         marginBottom: 15,
//         fontWeight: 'bold',
//         fontFamily: 'Inter-Bold', // Using Inter font
//     },
//     inputContainer: {
//         width: '100%',
//         marginBottom: 20,
//     },
//     inputLabel: {
//         color: '#F0363D',
//         fontSize: 12,
//         fontWeight: 'bold',
//         marginBottom: 5,
//         letterSpacing: 1,
//         fontFamily: 'Inter-Bold', // Using Inter font
//     },
//     input: {
//         width: '100%',
//         height: 50,
//         borderWidth: 2,
//         borderColor: '#333',
//         borderRadius: 8,
//         paddingHorizontal: 15,
//         backgroundColor: '#000000',
//         color: '#FFFFFF',
//         fontFamily: 'Inter-Regular', // Using Inter font
//     },
//     forgotPassword: {
//         alignSelf: 'flex-end',
//         marginBottom: 25,
//     },
//     forgotPasswordText: {
//         color: '#999',
//         fontSize: 12,
//         fontFamily: 'Inter-Regular', // Using Inter font
//     },
//     button: {
//         width: '100%',
//         height: 55,
//         backgroundColor: '#F0363D',
//         borderRadius: 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 25,
//     },
//     buttonDisabled: {
//         backgroundColor: '#5c1417',
//     },
//     buttonText: {
//         color: '#FFFFFF',
//         fontSize: 16,
//         fontWeight: 'bold',
//         letterSpacing: 1,
//         fontFamily: 'RacingSansOne', // Racing Sans font
//     },
//     signUpContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     signUpText: {
//         color: '#999',
//         fontFamily: 'Inter-Regular', // Using Inter font
//     },
//     signUpLink: {
//         color: '#F0363D',
//         fontWeight: 'bold',
//         fontFamily: 'Inter-Bold', // Using Inter font
//     },
//     bottomStripe: {
//         height: 10,
//         backgroundColor: '#F0363D',
//     }
// });


// import React from 'react';
// import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';

// const SignInScreen = () => {
//     const handleLogin = () => {
//         console.log('Login pressed');
//         // Add navigation to login screen
//     };

//     const handleRegister = () => {
//         console.log('Register pressed');
//         // Add navigation to register screen
//     };



//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="dark-content" />

//             {/* Logo and welcome section */}
//             <View style={styles.logoContainer}>
//                 <Image
//                     source={{ uri: 'https://via.placeholder.com/150' }}
//                     style={styles.logo}
//                     resizeMode="contain"
//                 />
//                 <Text style={styles.welcomeText}>Welcome to App Name</Text>
//                 <Text style={styles.subText}>Sign in to continue</Text>
//             </View>

//             {/* Buttons section */}
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity
//                     style={styles.primaryButton}
//                     onPress={handleLogin}
//                 >
//                     <Text style={styles.primaryButtonText}>Login</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={styles.secondaryButton}
//                     onPress={handleRegister}
//                 >
//                     <Text style={styles.secondaryButtonText}>Register</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={styles.ghostButton}

//                 >

//                 </TouchableOpacity>
//             </View>

//             {/* Footer */}
//             <View style={styles.footer}>
//                 <Text style={styles.footerText}>
//                     By continuing, you agree to our Terms of Service and Privacy Policy
//                 </Text>
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//         justifyContent: 'space-between',
//     },
//     logoContainer: {
//         alignItems: 'center',
//         marginTop: 60,
//         paddingHorizontal: 20,
//     },
//     logo: {
//         width: 120,
//         height: 120,
//         marginBottom: 20,
//     },
//     welcomeText: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 10,
//     },
//     subText: {
//         fontSize: 16,
//         color: '#666',
//         textAlign: 'center',
//     },
//     buttonContainer: {
//         padding: 20,
//         width: '100%',
//     },
//     primaryButton: {
//         backgroundColor: '#4361ee',
//         borderRadius: 8,
//         height: 56,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 16,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     primaryButtonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     secondaryButton: {
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         height: 56,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 16,
//         borderWidth: 1,
//         borderColor: '#4361ee',
//         elevation: 1,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 2,
//     },
//     secondaryButtonText: {
//         color: '#4361ee',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     ghostButton: {
//         height: 56,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     ghostButtonText: {
//         color: '#666',
//         fontSize: 16,
//         fontWeight: '500',
//     },
//     footer: {
//         padding: 20,
//         alignItems: 'center',
//     },
//     footerText: {
//         fontSize: 12,
//         color: '#999',
//         textAlign: 'center',
//     },
// });

// export default SignInScreen;