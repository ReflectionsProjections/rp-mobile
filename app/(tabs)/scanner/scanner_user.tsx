import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import BackgroundSvg from '@/assets/images/qrbackground.svg';
import { useQRCode } from '@/hooks/useQRCode';
import QRDisplay from '@/components/scanner/QRDisplay';
import { useAppSelector } from '@/lib/store';
import { getWeekday } from '@/lib/utils';
import { Attendee } from '@/api/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const QR_SIZE = SCREEN_WIDTH * 0.67;

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

  useEffect(() => {
    const date = new Date();
    const key = `hasPriority${getWeekday(date.toISOString()).substring(0, 3)}`;
    setWeekdayShort(key as keyof Attendee);
  }, []);

  const handleRefreshWithCooldown = useCallback(() => {
    if (isRefreshing || isRefreshCooldown) return;
    
    setIsRefreshing(true);
    handleManualRefresh();
    
    // Set cooldown for 3 seconds after a brief delay
    setTimeout(() => {
      setIsRefreshing(false);
      setIsRefreshCooldown(true);
      
      setTimeout(() => {
        setIsRefreshCooldown(false);
      }, 3000);
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
          <Text style={{ 
            fontSize: 18, 
            color: isRefreshing || isRefreshCooldown ? '#999999' : '#E66300', 
            fontWeight: '600', 
            fontFamily: 'Magistral'
          }}>
            {isRefreshing ? 'Loading' : isRefreshCooldown ? 'On cooldown' : 'Refresh QR'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
