import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { RedemptionInfo, MerchandiseItem } from '@/lib/redemptionUtils';
import { mapBackendTierToFrontend } from '@/lib/redemptionUtils';

interface GeneralCheckinModalProps {
  visible: boolean;
  redemptionInfo: RedemptionInfo | null;
  merchandiseItems: MerchandiseItem[];
  merchProcessing: boolean;
  onRedeem: (tier: string) => void;
  onClose: () => void;
}

export default function GeneralCheckinModal({
  visible,
  redemptionInfo,
  merchandiseItems,
  merchProcessing,
  onRedeem,
  onClose,
}: GeneralCheckinModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={() => {}}>
        <LinearGradient
          colors={['#ffffff20', '#ffffff05']}
          className="rounded-xl p-[1px] mx-6 max-w-sm w-[95%]"
        >
          <View className="bg-[#111] p-6 rounded-xl border border-white/10 max-h-[80%]">
            <Text className="text-white text-xl font-bold text-center mb-3">General Check-in</Text>
            {redemptionInfo && (
              <View className="mb-4">
                <Text className="text-white/80 text-center mb-2">
                  Current Tier: {mapBackendTierToFrontend(redemptionInfo.currentTier as any)}
                </Text>
                <Text className="text-white/60 text-center text-sm">
                  Redeemed:{' '}
                  {redemptionInfo.redeemedTiers
                    .map((tier) => mapBackendTierToFrontend(tier))
                    .join(', ') || 'None'}
                </Text>
              </View>
            )}

            <Text className="text-white/80 text-center mb-4">Mark merchandise redemptions:</Text>

            <ScrollView
              className="h-full"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="space-y-3">
                {merchandiseItems.map((item) => (
                  <View
                    key={item.tier}
                    className="flex-row items-center justify-between bg-white/5 rounded-lg p-3"
                  >
                    <View className="flex-1">
                      <Text className="text-white font-semibold">{item.name}</Text>
                      <Text className="text-white/60 text-sm">
                        {mapBackendTierToFrontend(item.tier)}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {item.isRedeemed ? (
                        <View className="bg-green-600/20 px-3 py-1 rounded-full">
                          <Text className="text-green-400 text-sm font-semibold">Redeemed</Text>
                        </View>
                      ) : item.isEligible ? (
                        <TouchableOpacity
                          className={`bg-[#00adb5] px-4 py-2 rounded-lg ${merchProcessing ? 'opacity-50' : ''}`}
                          disabled={merchProcessing}
                          onPress={() => onRedeem(item.tier)}
                        >
                          <Text className="text-white text-sm font-semibold">Redeem</Text>
                        </TouchableOpacity>
                      ) : (
                        <View className="bg-gray-600/20 px-3 py-1 rounded-full">
                          <Text className="text-gray-400 text-sm">Not Eligible</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              className="bg-white/10 py-3 rounded-lg border border-white/10 mt-4"
              onPress={onClose}
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Pressable>
    </Modal>
  );
}
