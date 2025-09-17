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
  const QR_ROTATION_DEG = '12.5deg'; // Rotation for the QR code and its placement
  // These multipliers will need to be fine-tuned to fit YOUR specific SVG flag
  // The 'qrSize' prop is typically the ideal square size for the QR code itself.
  // The container needs to be slightly larger to account for the flag's visual size.
  const containerWidthMultiplier = 1.05; // Adjust to visually fit the flag's width
  const containerHeightMultiplier = 0.9; // Adjust to visually fit the flag's height
  const qrCodeSizeMultiplier = 0.8; // Adjust QR code size relative to the flag container
  const containerPadding = 15; // Padding inside the flag where the QR code sits

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
        {/*
          This View now simply positions the QR code, applying the tilt.
          It does NOT have its own background color, allowing the SVG flag
          to show through.
          The width, height, and padding are crucial for alignment with your SVG.
        */}
        <View
          style={{
            width: qrSize * containerWidthMultiplier,
            height: qrSize * containerHeightMultiplier,
            justifyContent: 'center',
            alignItems: 'center',
            // NO backgroundColor here, so the SVG flag shows through
            // borderRadius: 12, // Remove if you don't want visible rounded corners on the transparent area
            padding: containerPadding, // This creates an invisible "border"
            transform: [{ rotate: QR_ROTATION_DEG }], // Tilt the QR code
            // You might want to remove the shadow too if the SVG provides its own
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 4 },
            // shadowOpacity: 0.3,
            // shadowRadius: 6,
            // elevation: 8,
          }}
        >
          <QRCode
            value={qrValue}
            size={qrSize * qrCodeSizeMultiplier} // Size relative to the container and its padding
            backgroundColor="transparent" // Keep QR background transparent
            color="#000"
          />
        </View>
      </View>
    );
  }

  return null;
};

export default QRDisplay;