import React from 'react';
import { View, Text } from 'react-native';
import { useAppSelector } from '@/lib/store';
type Props = { roles: string[] };

export default function StaffRolesList({ roles }: Props) {
  if (!roles || roles.length === 0) return null;
  const themeColor = useAppSelector((s) => s.attendee.themeColor);
  return (
    <View
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginTop: 10,
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: '700',
          fontFamily: 'ProRacing',
          marginBottom: 6,
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}
      >
        ROLES
      </Text>
      <Text
        style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 12,
          fontFamily: 'Inter',
          marginBottom: 10,
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 1,
        }}
      >
        Roles assigned to your account
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {roles.map((r, idx) => (
          <View key={r} style={{ paddingVertical: 10 }}>
            <View
              style={{
                backgroundColor: themeColor,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 14,
              }}
            >
              <Text style={{ color: '#fff', fontFamily: 'Magistral', fontSize: 18 }}>{r}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
