// screens/PointsScreen.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Background from '../../assets/pointshop/point_background.svg';
import { PointsGauge } from '@/components/pointshop/PointsGuage';

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

      <View style={{ position: 'absolute', left: width * 0.13, bottom: height * 0.18, zIndex: 10 }}>
        <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold', marginTop: 30, marginLeft: 100 }}>x15</Text>
      </View>
      <View style={{ position: 'absolute', left: width * 0.13, bottom: height * 0.35, zIndex: 10 }}>
        <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold', marginLeft: 2 }}>x50</Text>
      </View>
      <View style={{ position: 'absolute', left: width * 0.35, bottom: height * 0.60, zIndex: 10 }}>
        <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold', marginLeft: 8 }}>x100</Text>
      </View>

      <Text
        className="absolute z-10 text-[16px] font-bold text-black font-proRacing"
        style={{
          top: height * 0.7,
          left: width * 0.65,
          width: width * 0.35,
        }}
      >
        Attend events to earn points and unlock prizes!
      </Text>
    </View>
  );
}
