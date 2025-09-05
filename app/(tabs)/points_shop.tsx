// screens/PointsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Background from '../../assets/pointshop/point_background.svg';
import Tier1Background from '../../assets/pointshop/tier1.svg';
import Tier2Background from '../../assets/pointshop/tier2.svg';
import Tier3Background from '../../assets/pointshop/tier3.svg';
import { PointsGauge } from '@/components/pointshop/PointsGuage';
import { QuestionMarker } from '@/components/pointshop/QuestionMarker';
import { useAppSelector, RootState } from '@/lib/store';
import { Tier } from '@/api/types';

const { width, height } = Dimensions.get('window');
const SPEEDO_WIDTH = width * 0.7;

const getBackground = (tier?: Tier) => {
  switch (tier) {
    case 'TIER1':
      return <Tier1Background width={width} height={height} className="absolute inset-0 z-0" preserveAspectRatio="xMidYMin slice" />;
    case 'TIER2':
      return <Tier2Background width={width} height={height} className="absolute inset-0 z-0" preserveAspectRatio="xMidYMin slice" />;
    case 'TIER3':
      return <Tier3Background width={width} height={height} className="absolute inset-0 z-0" preserveAspectRatio="xMidYMin slice" />;
    default:
      return <Background width={width} height={height} className="absolute inset-0 z-0" preserveAspectRatio="xMidYMin slice" />;
  }
}

export default function PointsScreen() {
  const attendee = useAppSelector((state: RootState) => state.attendee.attendee);

  return (
    <View className="flex-1 bg-rpRed relative">
      { getBackground(attendee?.currentTier) }

      <View className="absolute inset-x-0 top-16 items-center z-10">
        <PointsGauge tier={attendee ? attendee.currentTier : 'N/A'} width={SPEEDO_WIDTH} /> 
      </View>

      <QuestionMarker
        count={100}
        className="z-10"
        style={{ top: height * 0.32, left: width * 0.3 }}
      />
      <QuestionMarker
        count={50}
        className="z-10"
        style={{ top: height * 0.63, left: width * 0.04 }}
      />
      <QuestionMarker
        count={15}
        className="z-10"
        style={{ top: height * 0.76, left: width * 0.52 }}
      />

      <Text
        className="absolute z-10 text-[16px] font-bold text-black font-RacingSansOne"
        style={{
          top: height * 0.63,
          left: width * 0.64,
          width: width * 0.33,
        }}
      >
        {!attendee
          ? 'Make sure to register for R|P to track your points!'
          : 'Attend events to earn points and unlock prizes!'}
      </Text>
    </View>
  );
}
