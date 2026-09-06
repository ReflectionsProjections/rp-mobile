import React, { useEffect } from 'react';
import { View, Dimensions, Text, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Brightness from 'expo-brightness';
import { useQRCode } from '@/hooks/useQRCode';
import QRDisplay from '@/components/scanner/QRDisplay';
import { useAppSelector } from '@/lib/store';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import PhotoBracketTop from '@/assets/qr/photo_bracket_top.svg';
import PhotoBracketBottom from '@/assets/qr/photo_bracket_bottom.svg';
import { Header } from '@/components/home/Header';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Measurements from the Figma "qr scan" frame (1943:247), authored at 390pt wide.
const K = SCREEN_WIDTH / 390;
const PANEL_SIZE = 224 * K;
const PANEL_PADDING = 30.9 * K;
const QR_SIZE = 162 * K;
const BRACKET_SIZE = 25.75 * K;
const BRACKET_INSET = 14.16 * K;
const BRACKET_WIDTH = 2.575;
const BRACKET_RADIUS = 5.15;
const BRACKET_COLOR = '#ff4ccc';
const PHOTO_BOX_W = 111.95;
const PHOTO_BOX_H = 109.15;
const PHOTO_SIZE = 103.6;
const CITY_HEIGHT = SCREEN_WIDTH * (728 / 390);

function CornerBracket({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const top = corner === 'tl' || corner === 'tr';
  const left = corner === 'tl' || corner === 'bl';
  return (
    <View
      style={{
        position: 'absolute',
        width: BRACKET_SIZE,
        height: BRACKET_SIZE,
        top: top ? BRACKET_INSET : undefined,
        bottom: top ? undefined : BRACKET_INSET,
        left: left ? BRACKET_INSET : undefined,
        right: left ? undefined : BRACKET_INSET,
        borderColor: BRACKET_COLOR,
        borderTopWidth: top ? BRACKET_WIDTH : 0,
        borderBottomWidth: top ? 0 : BRACKET_WIDTH,
        borderLeftWidth: left ? BRACKET_WIDTH : 0,
        borderRightWidth: left ? 0 : BRACKET_WIDTH,
        borderTopLeftRadius: corner === 'tl' ? BRACKET_RADIUS : 0,
        borderTopRightRadius: corner === 'tr' ? BRACKET_RADIUS : 0,
        borderBottomLeftRadius: corner === 'bl' ? BRACKET_RADIUS : 0,
        borderBottomRightRadius: corner === 'br' ? BRACKET_RADIUS : 0,
      }}
    />
  );
}

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let isMounted = true;
    let previousBrightness: number | null = null;

    const maximizeBrightness = async () => {
      try {
        const currentBrightness = await Brightness.getBrightnessAsync();
        if (!isMounted) return;

        previousBrightness = currentBrightness;
        await Brightness.setBrightnessAsync(1);
      } catch (error) {
        console.warn('Unable to maximize screen brightness:', error);
      }
    };

    void maximizeBrightness();

    return () => {
      isMounted = false;
      if (previousBrightness !== null) {
        void Brightness.setBrightnessAsync(previousBrightness).catch((error) => {
          console.warn('Unable to restore screen brightness:', error);
        });
      }
    };
  }, []);

  const {
    qrValue,
    loading,
    error,
    retryCount,
    timeUntilExpiry,
    shouldShowManualRefresh,
    handleManualRefresh,
  } = useQRCode();

  const profile = useAppSelector((state) => state.user.profile);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0f062d', '#24114c']}
        locations={[0, 0.6]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Image
        source={require('@/assets/qr/city_skyline.png')}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: SCREEN_WIDTH,
          height: CITY_HEIGHT,
        }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.65)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: SCREEN_HEIGHT * 0.55,
        }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View
          style={{ position: 'absolute', top: insets.top, left: 0, right: 0, zIndex: 20 }}
        >
          <Header bigText={false} />
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {/* Profile block */}
          <View
            style={{
              marginTop: 84,
              width: PHOTO_BOX_W,
              height: PHOTO_BOX_H,
              alignItems: 'center',
            }}
          >
            <ProfileAvatar
              size={PHOTO_SIZE}
              borderRadius={2.33}
              style={{ position: 'absolute', top: 2.33 }}
            />
            <View style={{ position: 'absolute', top: 0, transform: [{ scaleY: -1 }] }}>
              <PhotoBracketTop width={PHOTO_BOX_W} height={19.55} />
            </View>
            <View style={{ position: 'absolute', top: 89.6 }}>
              <PhotoBracketBottom width={PHOTO_BOX_W} height={19.55} />
            </View>
          </View>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              marginTop: 10,
              maxWidth: SCREEN_WIDTH - 48,
              fontFamily: 'Ethnocentric',
              fontSize: 18,
              color: '#ffffff',
              letterSpacing: 2.5,
              textAlign: 'center',
              textShadowColor: 'rgba(180, 79, 191, 0.8)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 14,
            }}
          >
            {profile?.displayName ?? ''}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              marginTop: 10,
              fontFamily: 'ShareTechMono',
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {profile?.email ?? ''}
          </Text>

          {/* QR panel */}
          <View
            style={{
              marginTop: 14,
              width: PANEL_SIZE,
              height: PANEL_SIZE,
              borderRadius: 16,
              backgroundColor: '#181818',
              alignItems: 'center',
              justifyContent: 'center',
              padding: PANEL_PADDING,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.45,
              shadowRadius: 12,
              elevation: 10,
            }}
          >
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
            <CornerBracket corner="tl" />
            <CornerBracket corner="tr" />
            <CornerBracket corner="bl" />
            <CornerBracket corner="br" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
