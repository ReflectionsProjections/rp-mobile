import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import SideDiscLeft from '@/assets/pointshop/side_disc_left.svg';
import SideDiscRight from '@/assets/pointshop/side_disc_right.svg';
import type { TierType } from '@/api/types';
import CdPlayerSvg from '@/components/pointshop/CdPlayerSvg';
import DiscLabelSvg from '@/components/pointshop/DiscLabelSvg';
import MilestoneBarSvg from '@/components/pointshop/MilestoneBarSvg';
import { getPointShopProgressWidth, POINT_SHOP_MILESTONES } from '@/lib/pointShopProgress';
import { getTierDisplayName } from '@/lib/redemptionUtils';
import { fetchAttendeePoints } from '@/lib/slices/attendeeSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/lib/store';

const DESIGN_WIDTH = 402;
const DESIGN_HEIGHT = 874;
const DISC_IMAGE = require('../../assets/pointshop/disc.png');
const POINT_SHOP_ITEMS = (
  [
    ['TIER1', POINT_SHOP_MILESTONES[0]],
    ['TIER2', POINT_SHOP_MILESTONES[1]],
    ['TIER3', POINT_SHOP_MILESTONES[2]],
    ['TIER4', POINT_SHOP_MILESTONES[3]],
  ] as const satisfies readonly (readonly [TierType, number])[]
).map(([tier, pointCost]) => ({ tier, pointCost, name: getTierDisplayName(tier) }));

export default function PointsShopScreen() {
  const dispatch = useAppDispatch();
  const attendee = useAppSelector((state: RootState) => state.attendee.attendee);
  const isSignedIn = Boolean(attendee);
  const { width, height } = useWindowDimensions();
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const points = Math.max(0, attendee?.points ?? 0);
  const selectedItem = POINT_SHOP_ITEMS[selectedItemIndex];
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const canvasWidth = DESIGN_WIDTH * scale;
  const canvasHeight = DESIGN_HEIGHT * scale;
  const canvasLeft = (width - canvasWidth) / 2;

  const discEntry = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const previousPoints = useRef(points);
  const continuousRotation = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      if (isSignedIn) {
        dispatch(fetchAttendeePoints());
      }
    }, [dispatch, isSignedIn]),
  );

  useEffect(() => {
    discEntry.value = 0;
    progressWidth.value = 0;

    discEntry.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    progressWidth.value = withTiming(getPointShopProgressWidth(points), {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });
    continuousRotation.value = 0;
    continuousRotation.value = withRepeat(
      withTiming(360, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(discEntry);
      cancelAnimation(progressWidth);
      cancelAnimation(continuousRotation);
    };
    // This is deliberately entry-only. Point changes are handled below without replaying the fly-in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const oldPoints = previousPoints.current;
    if (points === oldPoints) return;

    progressWidth.value = withTiming(getPointShopProgressWidth(points), {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    previousPoints.current = points;
  }, [points, progressWidth]);

  const rollingDiscStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(discEntry.value, [0, 1], [-300 * scale, 0]) },
      {
        rotate: `${-900 * (1 - discEntry.value)}deg`,
      },
    ],
  }));
  const continuousSpinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${continuousRotation.value}deg` }],
  }));
  const cycleItem = (direction: -1 | 1) => {
    setSelectedItemIndex(
      (currentIndex) =>
        (currentIndex + direction + POINT_SHOP_ITEMS.length) % POINT_SHOP_ITEMS.length,
    );
  };

  return (
    <LinearGradient colors={['#0F062D', '#24114C']} style={styles.page}>
      <View style={[styles.canvas, { width: canvasWidth, height: canvasHeight, left: canvasLeft }]}>
        <Text
          style={[
            styles.title,
            {
              top: 69 * scale,
              width: canvasWidth,
              fontSize: 29 * scale,
              lineHeight: 38 * scale,
            },
          ]}
        >
          POINT SHOP
        </Text>

        <View
          accessible
          accessibilityRole="text"
          accessibilityLabel={`Current points: ${points}`}
          style={[
            styles.pointsCard,
            {
              left: 28 * scale,
              top: 140 * scale,
              width: 346 * scale,
              height: 64 * scale,
              borderRadius: 14 * scale,
            },
          ]}
        >
          <LinearGradient
            colors={['#373792', '#F52DBC']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.pointsBorder, { borderRadius: 14 * scale, padding: 4 * scale }]}
          >
            <View
              style={[
                styles.pointsInner,
                { borderRadius: 10 * scale, paddingHorizontal: 19 * scale },
              ]}
            >
              <Text
                style={[styles.pointsLabel, { fontSize: 14 * scale, letterSpacing: 1.3 * scale }]}
              >
                {attendee ? 'current points' : 'sign in to track points'}
              </Text>
              <View style={[styles.pointsAmount, { gap: 11 * scale }]}>
                <Text style={[styles.pointsNumber, { fontSize: 22 * scale }]}>{points}</Text>
                <Text style={[styles.pointsUnit, { fontSize: 11 * scale }]}>pts</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View
          style={[
            styles.sideDisc,
            { left: -233 * scale, top: 289 * scale, width: 254 * scale, height: 254 * scale },
          ]}
        >
          <SideDiscLeft width={254 * scale} height={254 * scale} />
        </View>
        <View
          style={[
            styles.sideDisc,
            { left: 381 * scale, top: 289 * scale, width: 254 * scale, height: 254 * scale },
          ]}
        >
          <SideDiscRight width={254 * scale} height={254 * scale} />
        </View>

        <View
          style={[
            styles.player,
            {
              top: 212.5 * scale,
              width: 402 * scale,
              height: 480 * scale,
            },
          ]}
        >
          <CdPlayerSvg width={402 * scale} height={480 * scale} />
          <Text
            pointerEvents="none"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            style={[
              styles.playerItemName,
              {
                left: 54 * scale,
                top: 388.5 * scale,
                width: 69 * scale,
                fontSize: 14 * scale,
                lineHeight: 16 * scale,
              },
            ]}
          >
            {selectedItem.name}
          </Text>
          <View
            pointerEvents="none"
            style={[
              styles.playerCost,
              {
                left: 278.106 * scale,
                top: 373.899 * scale,
                width: 70.476 * scale,
                height: 70.476 * scale,
              },
            ]}
          >
            <Text
              style={[styles.playerCostNumber, { fontSize: 16 * scale, lineHeight: 18 * scale }]}
            >
              {String(selectedItem.pointCost).padStart(2, '0')}
            </Text>
            <Text style={[styles.playerCostUnit, { fontSize: 9 * scale, lineHeight: 11 * scale }]}>
              PTS
            </Text>
          </View>
          <Pressable
            onPress={() => cycleItem(-1)}
            accessibilityRole="button"
            accessibilityLabel="Previous shop item"
            hitSlop={8}
            style={[
              styles.playerArrowButton,
              {
                left: 249 * scale,
                top: 390 * scale,
                width: 34 * scale,
                height: 38 * scale,
              },
            ]}
          />
          <Pressable
            onPress={() => cycleItem(1)}
            accessibilityRole="button"
            accessibilityLabel="Next shop item"
            hitSlop={8}
            style={[
              styles.playerArrowButton,
              {
                left: 344 * scale,
                top: 390 * scale,
                width: 34 * scale,
                height: 38 * scale,
              },
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.rollingDisc,
            {
              left: 101.31 * scale,
              top: 317.53 * scale,
              width: 199 * scale,
              height: 199 * scale,
            },
            rollingDiscStyle,
          ]}
        >
          <Animated.View style={continuousSpinStyle}>
            <Image
              source={DISC_IMAGE}
              resizeMode="contain"
              style={{ width: 199 * scale, height: 199 * scale }}
            />
            <DiscLabelSvg
              itemName={selectedItem.name}
              width={199 * scale}
              height={199 * scale}
              style={styles.discLabel}
            />
          </Animated.View>
        </Animated.View>

        <View
          style={[
            styles.milestone,
            {
              left: 20 * scale,
              top: 717.06 * scale,
              width: 363 * scale,
              height: 51 * scale,
            },
          ]}
        >
          <MilestoneBarSvg
            points={points}
            progressWidth={progressWidth}
            width={363 * scale}
            height={51 * scale}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    overflow: 'hidden',
  },
  canvas: {
    position: 'absolute',
    top: 0,
  },
  title: {
    position: 'absolute',
    color: '#FFFFFF',
    fontFamily: 'Ethnocentric',
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.72)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 13,
  },
  pointsCard: {
    position: 'absolute',
    zIndex: 6,
    overflow: 'hidden',
  },
  pointsBorder: {
    flex: 1,
  },
  pointsInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#150935',
  },
  pointsLabel: {
    color: '#FFFFFF',
    fontFamily: 'ShareTechMono',
  },
  pointsAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsNumber: {
    color: '#FFFFFF',
    fontFamily: 'ShareTechMono',
  },
  pointsUnit: {
    color: '#FFFFFF',
    fontFamily: 'ShareTechMono',
  },
  sideDisc: {
    position: 'absolute',
    zIndex: 1,
  },
  player: {
    position: 'absolute',
    left: 0,
    zIndex: 2,
  },
  playerItemName: {
    position: 'absolute',
    color: '#FFFFFF',
    fontFamily: 'ShareTechMono',
    textAlign: 'center',
    zIndex: 2,
  },
  playerCost: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  playerCostNumber: {
    color: '#FFFFFF',
    fontFamily: 'Ethnocentric',
    textAlign: 'center',
  },
  playerCostUnit: {
    color: '#FFFFFF',
    fontFamily: 'Ethnocentric',
    textAlign: 'center',
    marginTop: -2,
  },
  playerArrowButton: {
    position: 'absolute',
    zIndex: 3,
  },
  rollingDisc: {
    position: 'absolute',
    zIndex: 4,
  },
  discLabel: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  milestone: {
    position: 'absolute',
    zIndex: 5,
  },
});
