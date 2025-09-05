// components/pointshop/PointsGauge.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Speedometer from '../../assets/pointshop/speedometer.svg';

const { width: SCREEN_W } = Dimensions.get('window');
const ASPECT = 144.63 / 280.07;
{
  /* idk wtf this is chat decided this*/
}
const DEFAULT_WIDTH = SCREEN_W;

export type PointsGaugeProps = {
  tier: number | string;
  width?: number;
};

export function PointsGauge({ tier, width = DEFAULT_WIDTH }: PointsGaugeProps) {
  const height = width * ASPECT;

  return (
    <View className="relative" style={{ width: width * 1.2, height: height }}>
      <Speedometer width={width * 1.2} height={height} className="absolute inset-0 z-0" preserveAspectRatio="none" />

      <Text className="absolute inset-x-0 bottom-10 text-white text-[17px] font-proRacing text-center">
        CURRENT TIER: {tier}
      </Text>
    </View>
  );
}
