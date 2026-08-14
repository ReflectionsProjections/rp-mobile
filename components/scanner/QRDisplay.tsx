import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Module colors from the Figma "qr scan" design (1943:6343): purple -> cyan
// diagonal gradient. Both ends stay bright against the #181818 panel so the
// code keeps enough contrast to scan reliably.
const QR_GRADIENT: [string, string] = ['#B44FBF', '#5CE1E6'];

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

  if (loading && !qrValue) {
    return (
      <View className="items-center justify-center" style={{ width: qrSize, height: qrSize }}>
        <ActivityIndicator size="large" color="#ff4ccc" />
        <Text
          className="text-white text-sm mt-2"
          style={{ fontFamily: 'ShareTechMono', color: 'rgba(255,255,255,0.7)' }}
        >
          Loading QR Code...
        </Text>
        {retryCount > 0 && (
          <Text className="text-yellow-400 text-xs mt-1">
            Retry attempt {retryCount}/{MAX_RETRY_ATTEMPTS}
          </Text>
        )}
      </View>
    );
  }

  if (error && !qrValue) {
    return (
      <View className="items-center justify-center" style={{ width: qrSize, height: qrSize }}>
        <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={onManualRefresh}
          disabled={loading}
          style={{
            backgroundColor: '#150935',
            borderWidth: 2,
            borderColor: '#ff4ccc',
            borderRadius: 10,
            paddingHorizontal: 24,
            paddingVertical: 10,
          }}
        >
          <Text className="text-white" style={{ fontFamily: 'ShareTechMono', fontSize: 14 }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (qrValue) {
    return (
      <QRCode
        value={qrValue}
        size={qrSize}
        backgroundColor="transparent"
        enableLinearGradient
        linearGradient={QR_GRADIENT}
      />
    );
  }

  return null;
};

export default QRDisplay;
