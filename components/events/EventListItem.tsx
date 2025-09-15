import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatAMPM } from '@/lib/utils';
import { Event } from '@/api/types';
import { Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ReanimatedAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
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
  const themeColor = useThemeColor();

  const start = new Date(item.startTime);
  const end = new Date(item.endTime);
  const startStr = formatAMPM(start);
  const endStr = formatAMPM(end);

  const triggerFlagAndReset = () => {
    if (onFlag) {
      runOnJS(onFlag)(item.eventId);
    }
    translateX.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
  };

  const maxSwipe = Math.max(60, width * 0.9);
  const triggerThreshold = 80;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, maxSwipe);
      }
    })
    .onEnd((event) => {
      if (event.translationX > triggerThreshold || event.velocityX > 500) {
        translateX.value = withTiming(width * 0.4, { duration: 150 }, () => {
          runOnJS(triggerFlagAndReset)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Red overlay while swiping
  const animatedBgStyle = useAnimatedStyle(() => ({
    width: translateX.value,
    opacity: translateX.value > 0 ? 1 : 0,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, triggerThreshold], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [0, triggerThreshold],
          [-30, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const animatedTitleTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, triggerThreshold], [1, 0.85], Extrapolation.CLAMP),
  }));

  const animatedSubtitleTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, triggerThreshold], [1, 0.7], Extrapolation.CLAMP),
  }));

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY }] }}>
      <View className="mb-3 relative">
        {/* Red overlay shown only while swiping */}
        <ReanimatedAnimated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: 'red',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              pointerEvents: 'none',
            },
            animatedBgStyle,
          ]}
        >
          <ReanimatedAnimated.View
            style={[
              {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 6,
              },
              animatedContentStyle,
            ]}
          >
            <MaterialCommunityIcons
              name={isFlagged ? 'flag' : 'flag-outline'}
              size={20}
              color="white"
            />
            <Text className="text-white text-[10px] font-bold mt-1">
              {isFlagged ? 'UNFLAG' : 'FLAG'}
            </Text>
          </ReanimatedAnimated.View>
        </ReanimatedAnimated.View>

        {/* Main content */}
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
                  borderLeftWidth: isFlagged ? 6 : 0,
                  borderLeftColor: isFlagged ? 'red' : 'transparent',
                }}
              >
                <View className="flex-row flex-1 h-full py-0" style={{ transform: [{ skewX: '8deg' }] }}>
                  <View className="justify-center items-center w-12">
                    <Text className="text-white text-xl font-extrabold italic font-proRacingSlant">
                      {index + 1}
                    </Text>
                  </View>
                  <View className="flex-1 justify-center pl-2 pr-2">
                    <ReanimatedAnimated.Text
                      className="text-white text-base font-extrabold font-magistralMedium "
                      numberOfLines={2}
                      style={animatedTitleTextStyle}
                    >
                      {item.name}
                    </ReanimatedAnimated.Text>
                    <ReanimatedAnimated.Text
                      className="text-white/80 text-xs font-magistral"
                      numberOfLines={1}
                      style={animatedSubtitleTextStyle}
                    >
                      {item.location}
                    </ReanimatedAnimated.Text>
                  </View>
                  <View className="justify-center items-end w-34 pr-2">
                    <Text className="text-white text-lg font-bold font-magistralMedium">
                      {startStr}
                    </Text>
                    <Text className="text-white text-sm opacity-80 font-magistralMedium">
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
