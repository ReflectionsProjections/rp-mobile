import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatAMPM } from '@/lib/utils';
import { Event } from '@/api/types';
import { Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
};

export const EventListItem: React.FC<Props> = ({ item, index, width, anim, onPress }) => {
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const start = new Date(item.startTime);
  const end = new Date(item.endTime);
  const startStr = formatAMPM(start);
  const endStr = formatAMPM(end);
  const proximityWidth = useMemo(() => {
    const now = new Date();
    const windowMs = 12 * 60 * 60 * 1000;
    let proximity = 0;
    if (start > now) {
      proximity = Math.max(0, 1 - (start.getTime() - now.getTime()) / windowMs);
    } else if (end > now) {
      proximity = 1;
    } else {
      proximity = 1;
    }
    return Math.max(6, Math.min(100, Math.round(proximity * 100)));
  }, [item.startTime, item.endTime]);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY }] }}>
      <TouchableOpacity onPress={onPress} className="mb-3">
        <LinearGradient
          colors={[
            '#FFFFFF00',
            typeColors[(item.eventType as keyof typeof typeColors) || 'DEFAULT'],
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 0 }}
          className="rounded-lg flex-row items-center h-16 overflow-hidden shadow-lg shadow-black/40"
          style={{ width, transform: [{ skewX: '-20deg' }] }}
        >
          <View className="flex-row flex-1 h-full" style={{ transform: [{ skewX: '8deg' }] }}>
            <View className="justify-center items-center w-12">
              <Text className="text-white text-xl font-extrabold italic font-proRacingSlant">
                {index + 1}
              </Text>
            </View>
            <View className="flex-1 justify-center pl-2 pr-2">
              <Text
                className="text-white text-base font-extrabold font-magistralMedium"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text className="text-white/80 text-xs font-magistral" numberOfLines={1}>
                {item.location}
              </Text>
              <View className="mt-1 h-[10px] bg-white/20 rounded-full overflow-hidden relative">
                <View className="h-full bg-[#CA2523]/80" style={{ width: `${proximityWidth}%` }} />
                <View style={{ position: 'absolute', top: -8, left: 0, width: '100%', height: 0 }}>
                  <MaterialCommunityIcons
                    name="car-sports"
                    color="#e3e3e3"
                    size={24}
                    style={{
                      position: 'absolute',
                      left: `${proximityWidth}%`,
                      transform: [{ translateX: -8 }],
                    }}
                  />
                </View>
              </View>
            </View>
            <View className="justify-center items-end w-34 pr-2">
              <Text className="text-white text-lg font-bold font-magistralMedium">{startStr}</Text>
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
    </Animated.View>
  );
};
