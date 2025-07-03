import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { OAUTH_CONFIG } from './config';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

export async function validateAuthToken(): Promise<boolean> {
  try {
    const response = await fetch('https://api.reflectionsprojections.org/auth/info', {
      method: 'GET',
      headers: {
        'Authorization': await SecureStore.getItemAsync('jwt') || '',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

export async function clearAuth(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('jwt');
    await SecureStore.deleteItemAsync('codeVerifier');
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
}

export async function googleAuth(): Promise<{result: AuthSession.AuthSessionResult, codeVerifier: string} | null> {
  try {
    const discovery = {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
      revocationEndpoint: "https://accounts.google.com/o/oauth2/revoke",
    };

    const redirectUri = AuthSession.makeRedirectUri({
      scheme: OAUTH_CONFIG.REDIRECT_SCHEME,
      path: OAUTH_CONFIG.REDIRECT_PATH,
    });

    const request = new AuthSession.AuthRequest({
      clientId: OAUTH_CONFIG.IOS_GOOGLE_CLIENT_ID,
      scopes: ['openid', 'email', 'profile'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    });

    await request.makeAuthUrlAsync(discovery);

    const result = await request.promptAsync(discovery);

    return {result, codeVerifier: request.codeVerifier!};
  } catch (error) {
    console.error('Google OAuth error:', error);
    return null;
  }
}
