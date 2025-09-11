import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRDisplayProps {
  qrValue: string | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  timeUntilExpiry: number;
  shouldShowManualRefresh: boolean;
  onManualRefresh: () => void;
  qrSize: number;
}

const QRDisplay: React.FC<QRDisplayProps> = ({
  qrValue,
  loading,
  error,
  retryCount,
  onManualRefresh,
  qrSize,
}) => {
  const MAX_RETRY_ATTEMPTS = 3;

  if (loading) {
    return (
      <View className="items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white text-sm mt-2">Loading QR Code...</Text>
        {retryCount > 0 && (
          <Text className="text-yellow-400 text-xs mt-1">
            Retry attempt {retryCount}/{MAX_RETRY_ATTEMPTS}
          </Text>
        )}
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center">
        <Text className="text-red-500 text-base text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={onManualRefresh}
          disabled={loading}
          className="bg-[#EDE053] px-6 py-3 rounded-lg"
        >
          <Text className="text-[#E66300] font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (qrValue) {
    return (
      <View className="items-center">
        <View
          className="transform rotate-[12.5deg] justify-center items-center rounded-[12px] p-5"
          style={{ width: qrSize + 0, height: qrSize - 60 }}
        >
          <QRCode value={qrValue} size={qrSize} backgroundColor="transparent" color="#000" />
        </View>
      </View>
    );
  }

  return null;
};

export default QRDisplay;
