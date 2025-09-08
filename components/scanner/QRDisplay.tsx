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
  timeUntilExpiry,
  shouldShowManualRefresh,
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

        {/* QR Code Status */}
        <View className="mt-4 items-center">
          <View className="flex-row items-center">
            <Text className="text-white text-sm">QR Code expires in: {timeUntilExpiry}s</Text>
            {shouldShowManualRefresh && (
              <TouchableOpacity
                onPress={onManualRefresh}
                disabled={loading}
                className="ml-3 px-2 py-1 rounded"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <Text className="text-white text-xs">{loading ? '⟳' : '↻'}</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-gray-400 text-xs mt-1">
            {shouldShowManualRefresh
              ? 'Auto-refresh may be delayed'
              : 'Auto-refreshing every 10 seconds'}
          </Text>
        </View>
      </View>
    );
  }

  return null;
};

export default QRDisplay;
