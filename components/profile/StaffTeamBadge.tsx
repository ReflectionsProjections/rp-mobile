import React from 'react';
import { View, Text } from 'react-native';
import { useAppSelector } from '@/lib/store';

type Props = { team: string };

export default function StaffTeamBadge({ team }: Props) {
  const themeColor = useAppSelector((s) => s.attendee.themeColor);
  return (
    <View className="flex-row justify-end items-center pr-5 mt-2">
      <View className="items-end">
        <Text
          style={{
            color: themeColor,
            fontSize: 28,
            fontFamily: 'ProRacingSlant',
            textAlign: 'center',
          }}
        >
          {team}
        </Text>
        <View
          style={{
            width: 100,
            height: 3,
            backgroundColor: themeColor,
            borderRadius: 2,
            marginTop: 10,
          }}
        />
      </View>
    </View>
  );
}
