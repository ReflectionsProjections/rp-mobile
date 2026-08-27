import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/lib/store';
import ScannerGuestScreen from '../(tabs)/scanner/scanner_guest';
import ScannerStaffScreen from '../(tabs)/scanner/scanner_staff';
import ScannerUserScreen from '../(tabs)/scanner/scanner_user';

// Stack-pushed scanner screen (reached from the profile page's QR button).
// Unlike the scanner tab, this is reached by tapping *your own* QR button, so
// attendees who are also staff should still see their own QR code / profile
// pic here rather than the staff camera scanner.
export default function ScannerScreen() {
  const profile = useAppSelector((state) => state.user.profile);

  let content: React.ReactNode;
  if (!profile || !profile.roles || profile.roles.length === 0) {
    content = <ScannerGuestScreen />;
  } else if (profile.roles.includes('USER')) {
    content = <ScannerUserScreen />;
  } else if (profile.roles.includes('STAFF')) {
    content = <ScannerStaffScreen />;
  } else {
    content = <ScannerGuestScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {content}
      <SafeAreaView
        style={{ position: 'absolute', top: 0, left: 0 }}
        edges={['top']}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginLeft: 20,
            marginTop: 16,
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: '#ff4ccc',
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
