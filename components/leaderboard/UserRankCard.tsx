import React from 'react';
import { View, Text } from 'react-native';
import RpLeaderboardCar from '@/assets/images/leaderboard/rpcar.svg';
import { useThemeColor } from '@/lib/theme';

interface UserRankCardProps {
  rank: number;
  points: number;
}

export const UserRankCard = ({ rank, points }: UserRankCardProps) => {
  const themeColor = useThemeColor();

  return (
    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 5 }}>
      <RpLeaderboardCar />

      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Text
          style={{
            color: themeColor,
            fontWeight: 'bold',
            fontSize: 24,
          }}
        >
          You are #{rank}
        </Text>
        <Text
          style={{
            color: themeColor,
            fontSize: 14,
            fontWeight: '500',
            marginTop: 2,
          }}
        >
          +{points} LAP POINTS
        </Text>
      </View>
    </View>
  );
};
