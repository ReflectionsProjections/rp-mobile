import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TshirtRedemptionModalProps {
  visible: boolean;
  processing: boolean;
  onRedeem: () => void;
  onClose: () => void;
}

export default function TshirtRedemptionModal({
  visible,
  processing,
  onRedeem,
  onClose,
}: TshirtRedemptionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={() => {}}>
        <LinearGradient
          colors={['#ffffff20', '#ffffff05']}
          className="rounded-xl p-[1px] mx-6 max-w-sm w-[90%]"
        >
          <View className="bg-[#111] p-6 rounded-xl border border-white/10">
            <Text className="text-white text-xl font-bold text-center mb-3">
              T-shirt Redemption
            </Text>
            <Text className="text-white/80 text-center">
              Would you like to redeem the attendee's t-shirt now?
            </Text>
            <View className="flex-row gap-3 mt-5">
              <TouchableOpacity
                className={`flex-1 bg-[#00adb5] py-3 rounded-lg ${processing ? 'opacity-50' : ''}`}
                disabled={processing}
                onPress={onRedeem}
              >
                <Text className="text-white text-center font-semibold">Redeem T-shirt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-white/10 py-3 rounded-lg border border-white/10"
                onPress={onClose}
              >
                <Text className="text-white text-center font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Modal>
  );
}
