import dotenv from 'dotenv';

dotenv.config();

export default {
  "expo": {
    "name": "reflectionsprojections",
    "slug": "reflectionsprojections",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "reflectionsprojections",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.reflectionsprojections",
      config: {
        usesNonExemptEncryption: false
      },
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              "reflectionsprojections",
              "com.googleusercontent.apps.693438449476-tmppq76n7cauru3l0gvk32mufrd7eoq0"
            ]
          }
        ]
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.reflectionsprojections"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "expo-font"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "googleClientId": process.env.OAUTH_GOOGLE_CLIENT_ID,
      "apiUrl": process.env.API_URL || "https://api.reflectionsprojections.org",
    }
  }
}
