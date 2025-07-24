// screens/PointsScreen.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Background from '../../assets/pointshop/point_background.svg';
import { PointsGauge } from '@/components/pointshop/PointsGuage';
import { QuestionMarker } from '@/components/pointshop/QuestionMarker';


const { width, height } = Dimensions.get('window');
const SPEEDO_WIDTH = width * 0.7;

export default function PointsScreen() {
  return (
    <View className="flex-1 bg-rpRed relative">
      <Background
        width={width}
        height={height}
        className="absolute inset-0 z-0"
        preserveAspectRatio="xMidYMin slice"
      />

      <View className="absolute inset-x-0 top-16 items-center z-10">
        <PointsGauge points={20} width={SPEEDO_WIDTH} />
      </View>

      <QuestionMarker
        count={15}
        className="z-10"
        style={{ top: height * 0.32, left: width * 0.3 }}
      />
      <QuestionMarker
        count={50}
        className="z-10"
        style={{ top: height * 0.59, left: width * 0.05 }}
      />
      <QuestionMarker
        count={100}
        className="z-10"
        style={{ top: height * 0.76, left: width * 0.43 }}
      />

      <Text
        className="absolute z-10 text-[16px] font-bold text-black font-RacingSansOne"
        style={{
          top: height * 0.65,
          left: width * 0.64,
          width: width * 0.33,
        }}
      >
        Attend events to earn points and unlock prizes!
      </Text>
    </View>
  );
}
