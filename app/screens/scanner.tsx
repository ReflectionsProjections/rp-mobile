import React from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/lib/store';
import ScannerGuestScreen from '../(tabs)/scanner/scanner_guest';
import ScannerStaffScreen from '../(tabs)/scanner/scanner_staff';
import ScannerUserScreen from '../(tabs)/scanner/scanner_user';

// Stack-pushed scanner screen (reached from the profile page's QR button).
// Mirrors the role routing of the scanner tab in app/(tabs)/_layout.tsx.
export default function ScannerScreen() {
  const profile = useAppSelector((state) => state.user.profile);

  let content: React.ReactNode;
  if (!profile || !profile.roles || profile.roles.length === 0) {
    content = <ScannerGuestScreen />;
  } else if (profile.roles.includes('STAFF')) {
    content = <ScannerStaffScreen />;
  } else if (profile.roles.includes('USER')) {
    content = <ScannerUserScreen />;
  } else {
    content = <ScannerGuestScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {content}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0 }} pointerEvents="box-none">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginLeft: 20,
            marginTop: 8,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(24, 24, 24, 0.7)',
            borderWidth: 1,
            borderColor: '#373792',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
