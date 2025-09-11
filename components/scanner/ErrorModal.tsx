import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({ visible, message, onClose }: ErrorModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={() => {}}>
        <LinearGradient
          colors={['#ff3b30', '#b00020']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-xl p-[1px] mx-6 max-w-sm w-[85%]"
        >
          <View className="bg-[#1a0b0b] p-6 rounded-xl border border-white/10">
            <Text className="text-red-200 text-xl font-bold text-center mb-4">Oops!</Text>
            <Text className="text-white text-center mb-6">{message}</Text>
            <TouchableOpacity className="bg-red-600/90 px-6 py-3 rounded-lg" onPress={onClose}>
              <Text className="text-white text-center font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Pressable>
    </Modal>
  );
}
