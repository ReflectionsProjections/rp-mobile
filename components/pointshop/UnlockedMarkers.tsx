import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { TierMappedType, TierType } from '@/api/types';
import { QuestionMarker } from '@/components/pointshop/QuestionMarker';
import BeanieSvg from '@/assets/images/merch/beanie.svg';
import KeyChainSvg from '@/assets/images/merch/keychain.svg';
import SquishSvg from '@/assets/images/merch/squish2.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  mappedTier: TierMappedType;
  width: number;
  height: number;
};

export const UnlockedMarkers: React.FC<Props> = ({ mappedTier, width, height }) => {
  const hasTier1 = mappedTier === 'TIER1' || mappedTier === 'TIER2' || mappedTier === 'TIER3';
  const hasTier2 = mappedTier === 'TIER2' || mappedTier === 'TIER3';
  const hasTier3 = mappedTier === 'TIER3';

  const [seen, setSeen] = useState<{ TIER1: boolean; TIER2: boolean; TIER3: boolean }>({
    TIER1: false,
    TIER2: false,
    TIER3: false,
  });

  const scaleAnim = useRef({
    TIER1: new Animated.Value(1),
    TIER2: new Animated.Value(1),
    TIER3: new Animated.Value(1),
  }).current;
  const opacityAnim = useRef({
    TIER1: new Animated.Value(1),
    TIER2: new Animated.Value(1),
    TIER3: new Animated.Value(1),
  }).current;

  useEffect(() => {
    const loadSeen = async () => {
      try {
        const [s1, s2, s3] = await Promise.all([
          AsyncStorage.getItem('points_seen_TIER1'),
          AsyncStorage.getItem('points_seen_TIER2'),
          AsyncStorage.getItem('points_seen_TIER3'),
        ]);
        setSeen({ TIER1: s1 === '1', TIER2: s2 === '1', TIER3: s3 === '1' });
      } catch {}
    };
    loadSeen();
  }, []);

  const maybeAnimateUnlock = async (tierKey: 'TIER1' | 'TIER2' | 'TIER3', isUnlocked: boolean) => {
    if (!isUnlocked) return;
    const already = seen[tierKey];
    if (already) return;

    scaleAnim[tierKey].setValue(0.6);
    opacityAnim[tierKey].setValue(0);
    Animated.parallel([
      Animated.spring(scaleAnim[tierKey], { toValue: 1, useNativeDriver: true, friction: 6, tension: 80 }),
      Animated.timing(opacityAnim[tierKey], { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start(async () => {
      try {
        await AsyncStorage.setItem(`points_seen_${tierKey}`, '1');
        setSeen((prev) => ({ ...prev, [tierKey]: true }));
      } catch {}
    });
  };

  useEffect(() => {
    maybeAnimateUnlock('TIER1', hasTier1);
    maybeAnimateUnlock('TIER2', hasTier2);
    maybeAnimateUnlock('TIER3', hasTier3);
  }, [hasTier1, hasTier2, hasTier3]);

  const renderSlot = (
    tierKey: 'TIER1' | 'TIER2' | 'TIER3',
    unlocked: boolean,
    SvgComp: React.ComponentType<any>,
    top: number,
    left: number,
  ) => {
    if (!unlocked) {
      return (
        <View style={{ position: 'absolute', top, left }}>
          <QuestionMarker tier={tierKey as TierType} />
        </View>
      );
    }

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top,
          left,
          transform: [{ scale: scaleAnim[tierKey] }],
          opacity: opacityAnim[tierKey],
        }}
      >
        <View className={`absolute items-end flex-row`.trim()}>
          <SvgComp width={100} height={90} />
          <Text className="text-[22px] font-RacingSansOne italic font-bold text-[#FFFFFF] -ml-7">
            ×{tierKey}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      {renderSlot('TIER3', hasTier3, BeanieSvg, height * 0.32, width * 0.3)}
      {renderSlot('TIER2', hasTier2, SquishSvg, height * 0.60, width * 0.04)}
      {renderSlot('TIER1', hasTier1, KeyChainSvg, height * 0.76, width * 0.52)}
    </>
  );
};

export default UnlockedMarkers;


