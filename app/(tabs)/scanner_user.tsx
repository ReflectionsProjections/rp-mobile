import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Dimensions, Text, ActivityIndicator } from 'react-native';
import BackgroundSvg from '@/assets/images/qrbackground.svg';
import QRCode from 'react-native-qrcode-svg';
import { api } from '@/api/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const QR_SIZE = SCREEN_WIDTH * 0.6;

export default function ScannerScreen() {
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/attendee/qr');
        setQrValue(res.data.qrCode);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        {loading && <ActivityIndicator size="large" color="#fff" />}

        {!loading && error && <Text className="text-red-500 text-base">{error}</Text>}

        {!loading && qrValue && (
          <View
            className="transform rotate-[12.5deg] justify-center items-center rounded-[12px] p-5"
            style={{ width: QR_SIZE + 40, height: QR_SIZE + 40 }}
          >
            <QRCode value={qrValue} size={QR_SIZE} backgroundColor="transparent" color="#000" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
