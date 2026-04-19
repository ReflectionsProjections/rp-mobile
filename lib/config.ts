import Constants from 'expo-constants';

export const OAUTH_CONFIG = {
  IOS_GOOGLE_CLIENT_ID:
    Constants.expoConfig?.extra?.iosGoogleClientId ||
    process.env.IOS_OAUTH_GOOGLE_CLIENT_ID ||
    'YOUR_GOOGLE_CLIENT_ID',

  ANDROID_GOOGLE_CLIENT_ID:
    Constants.expoConfig?.extra?.androidGoogleClientId ||
    process.env.ANDROID_OAUTH_GOOGLE_CLIENT_ID ||
    'YOUR_GOOGLE_CLIENT_ID',

  IOS_REDIRECT_SCHEME: 'com.googleusercontent.apps.693438449476-tmppq76n7cauru3l0gvk32mufrd7eoq0',
  ANDROID_REDIRECT_SCHEME:
    'com.googleusercontent.apps.693438449476-ggdmrch475gd9otkn76uo71cm0h5q2sf',

  REDIRECT_PATH: '/(auth)/callback',
};

export const API_CONFIG = {
  BASE_URL:
    //Constants.expoConfig?.extra?.apiUrl ||
    process.env.API_URL || 'https://api.reflectionsprojections.org',
  TIMEOUT: 10000,
};

export function validateEnvironment() {
  const requiredVars = ['OAUTH_GOOGLE_CLIENT_ID'];

  const missing = requiredVars.filter((varName) => {
    const value = Constants.expoConfig?.extra?.[varName.toLowerCase()] || process.env[varName];
    return !value || value === `YOUR_${varName}`;
  });

  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('Please check your .env file and ensure all required variables are set.');
    return false;
  }

  return true;
}
