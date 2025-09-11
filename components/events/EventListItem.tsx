import React, { useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatAMPM } from '@/lib/utils';
import { Event } from '@/api/types';
import { Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ReanimatedAnimated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS, Easing, interpolate, Extrapolation } from 'react-native-reanimated';
import { useThemeColor } from '@/lib/theme';

const typeColors = {
  SPECIAL: '#4caf50ff',
  SPEAKER: '#4caf50ff',
  CORPORATE: '#ff9800ff',
  MEALS: '#f44336ff',
  PARTNERS: '#9c27b0ff',
  CHECKIN: '#607d8bff',
  DEFAULT: '#388e3cff',
};

type Props = {
  item: Event;
  index: number;
  width: number;
  anim: Animated.Value;
  onPress: () => void;
  onFlag?: (eventId: string) => void;
  isFlagged?: boolean;
};

export const EventListItem: React.FC<Props> = ({
  item,
  index,
  width,
  anim,
  onPress,
  onFlag,
  isFlagged = false,
}) => {
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const translateX = useSharedValue(0);
  const flagOpacity = useSharedValue(0);
  const themeColor = useThemeColor();

  const start = new Date(item.startTime);
  const end = new Date(item.endTime);
  const startStr = formatAMPM(start);
  const endStr = formatAMPM(end);

  const triggerFlagAndReset = () => {
    if (onFlag) {
      onFlag(item.eventId);
    }
    
    setTimeout(() => {
      translateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
      flagOpacity.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }, 800);
  };

  const maxSwipe = Math.max(60, width * 0.9);
  const triggerThreshold = 80;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        const capped = Math.min(event.translationX, maxSwipe);
        translateX.value = capped;
      }
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;

      if (translationX > triggerThreshold || velocityX > 500) {
        translateX.value = withTiming(Math.min(width * 0.6, maxSwipe), { duration: 220, easing: Easing.out(Easing.cubic) });
        flagOpacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) }, () => {
          runOnJS(triggerFlagAndReset)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
        flagOpacity.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.cubic) });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedBgStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value,
      opacity: translateX.value > 0 ? 1 : 0,
    };
  });

  const animatedTitleTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, triggerThreshold], [1, 0.85], Extrapolation.CLAMP),
      transform: [
        { translateX: interpolate(translateX.value, [0, triggerThreshold], [0, 6], Extrapolation.CLAMP) },
        { scale: interpolate(translateX.value, [0, triggerThreshold], [1, 0.98], Extrapolation.CLAMP) },
      ],
    };
  });

  const animatedSubtitleTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, triggerThreshold], [1, 0.7], Extrapolation.CLAMP),
      transform: [
        { translateX: interpolate(translateX.value, [0, triggerThreshold], [0, 8], Extrapolation.CLAMP) },
      ],
    };
  });

  const animatedBgContentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, triggerThreshold], [1, 0.85], Extrapolation.CLAMP),
      transform: [
        { translateX: interpolate(translateX.value, [0, triggerThreshold], [-40, 0], Extrapolation.CLAMP) },
      ],
      scale: interpolate(translateX.value, [0, triggerThreshold], [1, 0.2], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY }] }}>
      <View className="mb-3 relative">
        {/* Flag indicator background (stretches with swipe) */}
        <ReanimatedAnimated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: themeColor,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ skewX: '-20deg' }],
              overflow: 'hidden',
              pointerEvents: 'none',
            },
            animatedBgStyle,
          ]}
        >
          <ReanimatedAnimated.View
            style={[
              {
                transform: [{ skewX: '8deg' }],
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 12,
                minWidth: 50,
              },
              animatedBgContentStyle,
            ]}
          >
            <MaterialCommunityIcons
              name={isFlagged ? 'flag' : 'flag-outline'}
              size={24}
              color="white"
            />
            <Text className="text-white text-xs font-bold mt-1">
              {isFlagged ? 'UNFLAG' : 'FLAG'}
            </Text>
          </ReanimatedAnimated.View>
        </ReanimatedAnimated.View>

        {/* Main content with swipe gesture */}
        <GestureDetector gesture={panGesture}>
          <ReanimatedAnimated.View style={animatedCardStyle}>
            <TouchableOpacity onPress={onPress}>
              <LinearGradient
                colors={[
                  '#FFFFFF00',
                  typeColors[(item.eventType as keyof typeof typeColors) || 'DEFAULT'],
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0 }}
                className="rounded-lg flex-row items-center h-16 overflow-hidden shadow-lg shadow-black/40"
                style={{ 
                  width, 
                  transform: [{ skewX: '-20deg' }],
                  borderLeftWidth: isFlagged ? 8 : 0,
                  borderLeftColor: isFlagged ? themeColor : 'transparent',
                }}
              >
                <View className="flex-row flex-1 h-full" style={{ transform: [{ skewX: '8deg' }] }}>
                  <View className="justify-center items-center w-12">
                    <Text className="text-white text-xl font-extrabold italic font-proRacingSlant">
                      {index + 1}
                    </Text>
                  </View>
                  <View className="flex-1 justify-center pl-2 pr-2">
                    <View className="flex-row items-center">
                      <ReanimatedAnimated.Text
                        className="text-white text-base font-extrabold font-magistralMedium flex-1" 
                        numberOfLines={1}
                        style={animatedTitleTextStyle}
                      >
                        {item.name}
                      </ReanimatedAnimated.Text>
                      {/* Star indicator for flagged events */}
                      {isFlagged && (
                        <MaterialCommunityIcons
                          name="star"
                          size={16}
                          color={themeColor}
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </View>
                    <ReanimatedAnimated.Text className="text-white/80 text-xs font-magistral" numberOfLines={1} style={animatedSubtitleTextStyle}>
                      {item.location}
                    </ReanimatedAnimated.Text>
                  </View>
                  <View className="justify-center items-end w-34 pr-2">
                    <Text className="text-white text-lg font-bold font-magistralMedium">
                      {startStr}
                    </Text>
                    <Text
                      className="text-white text-sm opacity-80 font-magistralMedium"
                      style={{ marginTop: -2 }}
                    >
                      {endStr}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </ReanimatedAnimated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
};
