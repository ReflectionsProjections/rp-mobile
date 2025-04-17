import { Redirect } from 'expo-router';

export default function AuthIndex() {
    // Redirect to the loading screen when accessing the auth route directly
    return <Redirect href="/(auth)/loading" />;
}