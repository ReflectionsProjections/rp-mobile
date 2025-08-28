import React from 'react';
import { View, Text } from 'react-native';
import RpLeaderboardCar from '@/assets/images/leaderboard/rpcar.svg';

interface UserRankCardProps {
  rank: number;
  points: number;
}

export const UserRankCard = ({ rank, points }: UserRankCardProps) => (
  <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 5 }}>
    <RpLeaderboardCar />

    <View style={{ alignItems: 'center', marginTop: 8 }}>
      <Text
        style={{
          color: '#F5B44C',
          fontWeight: 'bold',
          fontSize: 24,
        }}
      >
        You are #{rank}
      </Text>
      <Text
        style={{
          color: '#F5B44C',
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
