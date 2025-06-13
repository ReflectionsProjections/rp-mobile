// pages/MyScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Asset } from 'expo-asset';
import { SvgUri } from 'react-native-svg';

// require the local asset
const bg = require('../../assets/svg/pointBackground.svg');

export default function MyScreen() {
  const [uri, setUri] = useState<string|null>(null);

  useEffect(() => {
    // load it into the device's cache (so we get a file:// uri)
    Asset.fromModule(bg)
      .downloadAsync()
      .then(module => setUri(module.localUri!));
  }, []);

  if (!uri) return null; // still loading

  return (
    <View style={styles.container}>
      <SvgUri
        width="100%"
        height="100%"
        uri={uri}
        style={StyleSheet.absoluteFill}    // fill the screen
      />
      <View style={styles.content}>
        {/* …all your page content here… */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { flex: 1, /* add padding, background overlays, etc… */ },
});
