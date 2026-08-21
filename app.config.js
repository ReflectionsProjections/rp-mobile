import dotenv from 'dotenv';

dotenv.config();

export default {
  expo: {
    name: 'reflectionsprojections',
    slug: 'reflectionsprojections',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/rp_app_icon_2026.png',
    scheme: 'reflectionsprojections',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.reflectionsprojections',
      associatedDomains: ['applinks:reflectionsprojections.org'],
      config: {
        usesNonExemptEncryption: false,
      },
      googleServicesFile: './googleServices/GoogleService-Info-RP.plist',
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: ['reflectionsprojections'],
          },
        ],
        UIBackgroundModes: ['remote-notification'],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/rp_app_icon_2026.png',
        backgroundColor: '#000000',
      },
      package: 'com.reflectionsprojections',
      googleServicesFile: './googleServices/google-services.json',
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'reflectionsprojections.org',
              pathPrefix: '/auth/mobile/login',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/rp_app_icon_2026.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/rp_app_icon_2026.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#000000',
        },
      ],
      'expo-font',
      '@react-native-firebase/app',
      '@react-native-firebase/messaging',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl: process.env.API_URL || 'https://api.reflectionsprojections.org',
      eas: {
        projectId: '31b01df4-91df-45dc-9131-17913e919c8a',
      },
    },
  },
};
