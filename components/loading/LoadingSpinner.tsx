import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Lightweight loading state for screens that can flash in/out often (tab
// switches). Deliberately has no custom animation — see the boot screen at
// app/(auth)/loading.tsx for the branded one-time launch animation.
export function LoadingSpinner() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0F062D' }}>
      <LinearGradient colors={['#0F062D', '#24114C']} style={StyleSheet.absoluteFill} />
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF4CCC" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;
