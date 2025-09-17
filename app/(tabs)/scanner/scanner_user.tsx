import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import BackgroundSvg from '@/assets/images/qrbackground.svg';
import { useQRCode } from '@/hooks/useQRCode';
import QRDisplay from '@/components/scanner/QRDisplay';
import { useAppSelector } from '@/lib/store';
import { getWeekday } from '@/lib/utils';
import { Attendee } from '@/api/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const QR_SIZE = SCREEN_WIDTH * 0.67;
const REFRESH_COOLDOWN_KEY = 'qr_refresh_cooldown';
const COOLDOWN_DURATION = 3000; // 3 seconds

export default function ScannerScreen() {
  const [weekdayShort, setWeekdayShort] = useState<keyof Attendee | null>(null);
  const [isRefreshCooldown, setIsRefreshCooldown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    qrValue,
    loading,
    error,
    retryCount,
    timeUntilExpiry,
    shouldShowManualRefresh,
    handleManualRefresh,
  } = useQRCode();

  // Check if cooldown is still active on component mount
  useEffect(() => {
    const checkCooldownStatus = async () => {
      try {
        const cooldownEndTime = await AsyncStorage.getItem(REFRESH_COOLDOWN_KEY);
        if (cooldownEndTime) {
          const endTime = parseInt(cooldownEndTime, 10);
          const now = Date.now();
          
          if (now < endTime) {
            // Still in cooldown
            setIsRefreshCooldown(true);
            const remainingTime = endTime - now;
            setTimeout(() => {
              setIsRefreshCooldown(false);
              AsyncStorage.removeItem(REFRESH_COOLDOWN_KEY);
            }, remainingTime);
          } else {
            // Cooldown expired
            AsyncStorage.removeItem(REFRESH_COOLDOWN_KEY);
            setIsRefreshCooldown(false);
          }
        }
      } catch (error) {
        console.error('Error checking cooldown status:', error);
      }
    };

    checkCooldownStatus();
  }, []);

  useEffect(() => {
    const date = new Date();
    const weekday = getWeekday(date.toISOString());
    const key = `hasPriority${weekday.charAt(0)}${weekday.slice(1, 3).toLowerCase()}`;
    setWeekdayShort(key as keyof Attendee);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timeouts when component unmounts
      // This prevents memory leaks
    };
  }, []);

  const handleRefreshWithCooldown = useCallback(async () => {
    if (isRefreshing || isRefreshCooldown) return;

    setIsRefreshing(true);
    handleManualRefresh();

    // Set cooldown for 3 seconds after a brief delay
    setTimeout(async () => {
      setIsRefreshing(false);
      setIsRefreshCooldown(true);

      // Store cooldown end time in AsyncStorage
      const cooldownEndTime = Date.now() + COOLDOWN_DURATION;
      try {
        await AsyncStorage.setItem(REFRESH_COOLDOWN_KEY, cooldownEndTime.toString());
      } catch (error) {
        console.error('Error saving cooldown:', error);
      }

      setTimeout(async () => {
        setIsRefreshCooldown(false);
        try {
          await AsyncStorage.removeItem(REFRESH_COOLDOWN_KEY);
        } catch (error) {
          console.error('Error removing cooldown:', error);
        }
      }, COOLDOWN_DURATION);
    }, 500); // Small delay to prevent flashing
  }, [isRefreshing, isRefreshCooldown, handleManualRefresh]);

  const attendee = useAppSelector((state) => state.attendee.attendee);

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
          {attendee?.[weekdayShort!] ? 'PRIORITY' : 'STANDARD'}
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

      <View
        style={{
          bottom: '25%',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TouchableOpacity
          onPress={handleRefreshWithCooldown}
          disabled={isRefreshing || isRefreshCooldown}
          activeOpacity={0.7}
          style={{
            backgroundColor: isRefreshing || isRefreshCooldown ? '#CCCCCC' : '#EDE053',
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 5,
            zIndex: 1000,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: isRefreshing || isRefreshCooldown ? '#999999' : '#E66300',
              fontWeight: '600',
              fontFamily: 'Magistral',
            }}
          >
            {isRefreshing ? 'Loading' : isRefreshCooldown ? 'On cooldown' : 'Refresh QR'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
