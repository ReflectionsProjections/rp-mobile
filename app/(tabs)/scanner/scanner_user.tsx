import React from 'react';
import { SafeAreaView, View, Dimensions, Text } from 'react-native';
import BackgroundSvg from '@/assets/images/qrbackground.svg';
import { useQRCode } from '@/hooks/useQRCode';
import QRDisplay from '@/components/scanner/QRDisplay';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const QR_SIZE = SCREEN_WIDTH * 0.67;

export default function ScannerScreen() {
  const {
    qrValue,
    loading,
    error,
    retryCount,
    timeUntilExpiry,
    shouldShowManualRefresh,
    handleManualRefresh,
  } = useQRCode();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <BackgroundSvg
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        className="absolute top-0 left-0"
        preserveAspectRatio="none"
      />

      <View className="w-full h-[85px] bg-[#EDE053] justify-center items-center">
        <Text className="text-[#E66300] text-[35px] font-bold" style={{ fontFamily: 'ProRacing' }}>
          FOOD WAVE: 1
        </Text>
      </View>

      <View className="flex-1 items-center pt-[160px] px-5">
        <QRDisplay
          qrValue={qrValue}
          loading={loading}
          error={error}
          retryCount={retryCount}
          timeUntilExpiry={timeUntilExpiry}
          shouldShowManualRefresh={shouldShowManualRefresh}
          onManualRefresh={handleManualRefresh}
          qrSize={QR_SIZE}
        />
      </View>
    </SafeAreaView>
  );
}
