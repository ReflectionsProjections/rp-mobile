// import { useEffect, useState } from 'react';
// import FirebaseService from '../lib/firebase';

// export const useFirebaseNotifications = () => {
//   const [fcmToken, setFcmToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const initializeNotifications = async () => {
//       try {
//         setIsLoading(true);
//         const firebaseService = FirebaseService.getInstance();

//         // Check notification status on startup
//         const startupStatus = await firebaseService.checkNotificationStatusOnStartup();
//         if (startupStatus.needsAttention && startupStatus.showGuidance) {
//           firebaseService.showNotificationGuidance();
//         }

//         // Get FCM token
//         const token = await firebaseService.getFCMToken();
//         setFcmToken(token);

//         // Set up notification handlers
//         const unsubscribeMessage = await firebaseService.onMessageReceived((message) => {
//           console.log('Foreground message received:', message);
//           // Handle foreground messages here
//         });

//         firebaseService.onNotificationOpenedApp((message) => {
//           console.log('App opened from notification:', message);
//           // Handle notification taps here
//         });

//         const unsubscribeTokenRefresh = await firebaseService.onTokenRefresh((token) => {
//           console.log('Token refreshed:', token);
//           setFcmToken(token);
//           // Send new token to your server here
//         });

//         setIsLoading(false);

//         // Cleanup function
//         return () => {
//           unsubscribeMessage();
//           unsubscribeTokenRefresh();
//         };
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Unknown error');
//         setIsLoading(false);
//       }
//     };

//     initializeNotifications();
//   }, []);

//   const registerForNotifications = async (token: string) => {
//     try {
//       // Send the FCM token to your backend server to register
//       console.log('Registering token with server:', token);
//       // Example:
//       // await api.post('/notifications/register', { token });
//     } catch (err) {
//       console.error('Error registering token with server:', err);
//     }
//   };

//   const unregisterFromNotifications = async () => {
//     try {
//       const firebaseService = FirebaseService.getInstance();
//       await firebaseService.unregisterForNotifications();
//       console.log('Unregistered from notifications');
//       // Example:
//       // await api.post('/notifications/unregister');
//     } catch (err) {
//       console.error('Error unregistering from notifications:', err);
//     }
//   };

//   return {
//     fcmToken,
//     isLoading,
//     error,
//     registerForNotifications,
//     unregisterFromNotifications,
//   };
// };
