// screens/PointsScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, Animated } from 'react-native';
import Background from '../../assets/pointshop/point_background.svg';
import Tier2Background from '../../assets/pointshop/tier2_car2.svg';
import Tier3Background from '../../assets/pointshop/tier3_car2.svg';
import Tier4Background from '../../assets/pointshop/tier4_car.svg';
import { PointsGauge } from '@/components/pointshop/PointsGuage';
import { QuestionMarker } from '@/components/pointshop/QuestionMarker';
import { useAppSelector, RootState } from '@/lib/store';
import { TierMappedType, TierType } from '@/api/types';
import { tierMapping } from '@/constants/tierMapping';

const { width, height } = Dimensions.get('window');
const SPEEDO_WIDTH = width * 0.7;

// Animated background component that fades between tiers
const AnimatedBackground = ({
  currentTier,
  testTier,
}: {
  currentTier?: TierType;
  testTier?: TierMappedType;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const targetTier = testTier || currentTier || 'TIER1'; // this is what the api gives us

  // Define tier progression
  const tierProgression: TierMappedType[] = ['TIER0', 'TIER1', 'TIER2', 'TIER3'];
  const targetIndex = tierProgression.indexOf(tierMapping[targetTier]);

  useEffect(() => {
    // Reset animation to 0 first
    fadeAnim.setValue(0);

    // Animate the fade to the target tier
    Animated.timing(fadeAnim, {
      toValue: targetIndex,
      duration: 2000, // 2 second animation
      useNativeDriver: true, // Opacity animations can use native driver
    }).start();
  }, [targetTier, fadeAnim, targetIndex]);

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Base background (TIER0) */}
      <Background
        width={width}
        height={height}
        className="absolute inset-0 z-0"
        preserveAspectRatio="xMidYMin slice"
      />

      {/* TIER1 background with fade */}
      {targetIndex >= 1 && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1, 2, 3],
              outputRange: [0, 1, 1, 1],
              extrapolate: 'clamp',
            }),
          }}
        >
          <Tier2Background
            width={width}
            height={height}
            className="absolute inset-0 z-0"
            preserveAspectRatio="xMidYMin slice"
          />
        </Animated.View>
      )}

      {/* TIER2 background with fade */}
      {targetIndex >= 2 && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: fadeAnim.interpolate({
              inputRange: [1, 2, 3],
              outputRange: [0, 1, 1],
              extrapolate: 'clamp',
            }),
          }}
        >
          <Tier3Background
            width={width}
            height={height}
            className="absolute inset-0 z-0"
            preserveAspectRatio="xMidYMin slice"
          />
        </Animated.View>
      )}

      {/* TIER3 background with fade */}
      {targetIndex >= 3 && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: fadeAnim.interpolate({
              inputRange: [2, 3],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          }}
        >
          <Tier4Background
            width={width}
            height={height}
            className="absolute inset-0 z-0"
            preserveAspectRatio="xMidYMin slice"
          />
        </Animated.View>
      )}
    </View>
  );
};

export default function PointsScreen() {
  const attendee = useAppSelector((state: RootState) => state.attendee.attendee);

  // For testing - specify which tier to animate to
  // const testTier: TierMappedType = 'TIER2';

  return (
    <View className="flex-1 bg-rpRed relative">
      <AnimatedBackground currentTier={attendee?.currentTier!} /> {/* pass in the API tier */}
      <View className="absolute inset-x-0 top-16 items-center z-10">
        <PointsGauge tier={tierMapping[attendee?.currentTier!]} width={SPEEDO_WIDTH} />
      </View>
      <QuestionMarker
        tier="TIER3"
        className="z-10"
        style={{ top: height * 0.32, left: width * 0.3 }}
      />
      <QuestionMarker
        tier="TIER2"
        className="z-10"
        style={{ top: height * 0.63, left: width * 0.04 }}
      />
      <QuestionMarker
        tier="TIER1"
        className="z-10"
        style={{ top: height * 0.76, left: width * 0.52 }}
      />
      <Text
        className="absolute z-10 text-[16px] font-bold text-white font-RacingSansOne"
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
