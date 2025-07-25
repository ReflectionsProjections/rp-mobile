import React from 'react';
import { Modal, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed/ThemedText';
import { CardType } from './types';
import { BlurView } from 'expo-blur';


interface EventModalProps {
  visible: boolean;
  event: CardType | null;
  isFlagged: boolean;
  onClose: () => void;
  onToggleFlag: (id: string) => void;
}

const FULL_SCREEN: View['props']['style'] = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

const { width, height } = Dimensions.get('window');
const MODAL_WIDTH = width * 0.8;
const MODAL_MAX_HEIGHT = height * 0.8;

export const EventModal: React.FC<EventModalProps> = ({
  visible,
  event,
  isFlagged,
  onClose,
  onToggleFlag,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        className="flex-1 bg-black/40 justify-center items-center"
        activeOpacity={1}
        onPress={onClose}
      >

      <BlurView intensity={80} tint="dark" style={FULL_SCREEN} />

        <TouchableOpacity
          // className="bg-[#dbdbdb] rounded-2xl p-5 w-[80%] h-[50%]"
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={{
          width: MODAL_WIDTH,
          maxHeight: MODAL_MAX_HEIGHT,
          backgroundColor: '#dbdbdb',
          borderRadius: 16,
          padding: 16,
        }}
        >
          {event && (
            <>
              <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={true}> 
                <ThemedText className="text-2xl font-bold font">{event.title}</ThemedText>
                <ThemedText className="mb-1">{event.time}</ThemedText>
                <ThemedText className="mb-4 text-[#666]">{event.location}</ThemedText>
                {event.description && (
                  <ThemedText className="mb-4 leading-5">{event.description}</ThemedText>
                )}
                <View className="mb-4 self-end bg-black rounded-xl px-2 py-1">
                  <ThemedText className="text-white">{event.pts} PTS</ThemedText>
                </View>
              </ScrollView>

              <TouchableOpacity
                className="absolute top-4 right-4"
                onPress={() => onToggleFlag(event.id)}
              >
                <FontAwesome
                  name={isFlagged ? 'flag' : 'flag-o'}
                  size={24}
                  color={isFlagged ? 'tomato' : '#333'}
                />
              </TouchableOpacity>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
