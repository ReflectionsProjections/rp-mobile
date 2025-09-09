import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SuccessModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({ visible, message, onClose }: SuccessModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={onClose}>
        <LinearGradient
          colors={['#ffffff20', '#ffffff05']}
          className="rounded-xl p-[1px] mx-6 max-w-sm w-[85%]"
        >
          <View className="bg-[#111] p-6 rounded-xl border border-white/10">
            <Text className="text-[#00adb5] text-xl font-bold text-center mb-2">✓ Success!</Text>
            <Text className="text-white text-center">{message}</Text>
            <TouchableOpacity className="bg-[#00adb5] mt-4 py-2 rounded-lg" onPress={onClose}>
              <Text className="text-white text-center font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Pressable>
    </Modal>
  );
}
