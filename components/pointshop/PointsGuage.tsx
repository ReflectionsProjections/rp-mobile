// components/pointshop/PointsGauge.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Speedometer from '../../assets/pointshop/speedometer.svg';

const { width: SCREEN_W } = Dimensions.get('window');
const ASPECT = 144.63 / 280.07; {/* idk wtf this is chat decided this*/}
const DEFAULT_WIDTH = SCREEN_W * 0.7;

export type PointsGaugeProps = {
  points: number | string;
  width?: number;
};

export function PointsGauge({
  points,
  width = DEFAULT_WIDTH,
}: PointsGaugeProps) {
  const height = width * ASPECT;

  return (
    <View className="relative" style={{ width, height }}>
      <Speedometer
        width={width}
        height={height}
        className="absolute inset-0 z-0"
      />

      <Text className="absolute inset-x-0 bottom-10 text-white text-[18px] font-proRacing text-center">
        YOUR POINTS: {points}
      </Text>
    </View>
  );
}
