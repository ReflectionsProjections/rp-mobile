import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Event } from '@/api/types';

interface EventSelectorProps {
  events: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  onEventSelect: () => void;
}

export default function EventSelector({
  events,
  selectedEvent,
  isLoading,
  onEventSelect,
}: EventSelectorProps) {
  if (isLoading) {
    return (
      <View className="px-4 py-2">
        <LinearGradient
          colors={['#ffffff10', '#ffffff05']}
          className="rounded-xl p-[1px]"
        >
          <View className="rounded-xl p-3 bg-[#121212] border border-white/10 flex-row items-center justify-center">
            <ActivityIndicator size="small" color="#00adb5" />
            <Text className="text-white/60 ml-2">Loading events...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="px-4 py-0.5">
      <LinearGradient
        colors={['#ffffff10', '#ffffff05']}
        className="rounded-xl p-[1px]"
      >
        <TouchableOpacity
          className="rounded-xl p-3 bg-[#121212] border border-white/10 flex-row items-center justify-between"
          onPress={onEventSelect}
          activeOpacity={0.8}
        >
          <Text className="text-white font-magistralMedium" numberOfLines={1} style={{ maxWidth: '80%' }}>
            {selectedEvent?.name || 'Select an event'}
          </Text>
          <Text className="text-white/60 text-xs">Change</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
