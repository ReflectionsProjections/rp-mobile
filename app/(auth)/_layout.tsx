import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // hides the header for all screens in (auth)
                animation: 'fade',
            }}
        >
            {/* Optional: Explicit config for sign-in screen if needed */}
            {/* <Stack.Screen 
                name="sign-in" 
                options={{ headerShown: false }} 
            /> */}
        </Stack>
    );
}
