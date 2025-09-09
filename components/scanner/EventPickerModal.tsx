import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Event } from '@/api/types';

interface EventPickerModalProps {
  visible: boolean;
  events: Event[];
  selectedEventId: string;
  onEventSelect: (eventId: string) => void;
  onClose: () => void;
}

export default function EventPickerModal({
  visible,
  events,
  selectedEventId,
  onEventSelect,
  onClose,
}: EventPickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center">
          <TouchableWithoutFeedback>
            <View className="mx-6 bg-[#121212] rounded-xl border border-[#00adb5]/20 max-h-[70%]">
              <LinearGradient
                colors={['#00adb520', '#00adb510']}
                className="rounded-t-xl p-[1px]"
              >
                <View className="bg-[#121212] rounded-t-xl p-4 border-b border-[#00adb5]/20">
                  <Text className="text-[#00adb5] text-lg font-semibold text-center">
                    Select Event
                  </Text>
                </View>
              </LinearGradient>
              
              <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
                {events.filter(event => event.eventType !== 'CHECKIN').map((event) => (
                  <TouchableOpacity
                    key={event.eventId}
                    className={`p-4 border-b border-white/5 ${
                      selectedEventId === event.eventId ? 'bg-[#00adb5]/10' : ''
                    }`}
                    onPress={() => {
                      onEventSelect(event.eventId);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text 
                      className={`text-sm font-medium ${
                        selectedEventId === event.eventId ? 'text-[#00adb5]' : 'text-white'
                      }`}
                    >
                      {event.name}
                    </Text>
                    {event.startTime && (
                      <Text className="text-white/60 text-xs mt-1">
                        {new Date(event.startTime).toLocaleString()}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity
                className="p-4 border-t border-white/5"
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text className="text-white/60 text-center text-sm font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
