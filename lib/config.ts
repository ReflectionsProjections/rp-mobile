import Constants from 'expo-constants';

export const API_CONFIG = {
  BASE_URL: Constants.expoConfig?.extra?.apiUrl || 'https://api.reflectionsprojections.org',
  TIMEOUT: 10000,
};
