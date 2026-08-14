export const API_CONFIG = {
  BASE_URL:
    //Constants.expoConfig?.extra?.apiUrl ||
    process.env.API_URL || 'https://api.reflectionsprojections.org',
  TIMEOUT: 10000,
};
