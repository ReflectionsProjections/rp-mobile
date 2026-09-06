// THIS IS THE STAFF SCANNER SCREN
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  AppState,
} from 'react-native';
import { TouchableOpacity } from '@/components/ui/HapticControls';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/api/api';
import { useEvents } from '@/api/tanstack/events';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import {
  fetchRedemptionInfo,
  redeemTier,
  getMerchandiseItems,
  hasRedeemedTshirt,
  type RedemptionInfo,
  type MerchandiseItem,
} from '@/lib/redemptionUtils';
import ModeSwitch from '@/components/scanner/ModeSwitch';
import EventSelector from '@/components/scanner/EventSelector';
import GeneralCheckinModal from '@/components/scanner/GeneralCheckinModal';
import TshirtRedemptionModal from '@/components/scanner/TshirtRedemptionModal';
import EventPickerModal from '@/components/scanner/EventPickerModal';
import ErrorModal from '@/components/scanner/ErrorModal';
import TicketConfirmationModal from '@/components/scanner/TicketConfirmationModal';
import { EventConfirmationModal } from '@/components/scanner/EventConfirmationModal';
import BracketTopLeft from '@/assets/scanner/bracket_top_left.svg';
import BracketTopRight from '@/assets/scanner/bracket_top_right.svg';
import BracketBottomLeft from '@/assets/scanner/bracket_bottom_left.svg';
import BracketBottomRight from '@/assets/scanner/bracket_bottom_right.svg';

const BRACKET_INSET = 18;
const BRACKET_SIZE = 76;
const READY_COLOR = '#22c55e';
const IDLE_COLOR = '#ffffff';

const DEMO_ACCOUNT_ID = 'demoacct-bd2c-6535-89b7-reflect12334';
const GENERAL_CHECKIN_EVENT_ID = 'af789f27-0792-49b0-9db8-65fc5ffff1d9';

const parseQrCode = (
  qrData: string,
): { userId: string; expTime: number; isValid: boolean; error?: string } => {
  try {
    const parts = qrData.split('#');

    if (parts.length !== 3) {
      return {
        userId: '',
        expTime: 0,
        isValid: false,
        error: 'Invalid QR code format. Expected: hash#expTime#userId',
      };
    }

    const [, expTimeStr, userId] = parts;
    const expTime = parseInt(expTimeStr, 10);

    if (isNaN(expTime)) {
      return {
        userId: '',
        expTime: 0,
        isValid: false,
        error: 'Invalid expiration time in QR code',
      };
    }

    if (Date.now() / 1000 > expTime) {
      return {
        userId,
        expTime,
        isValid: false,
        error: 'QR code has expired',
      };
    }

    return {
      userId,
      expTime,
      isValid: true,
    };
  } catch (error) {
    return {
      userId: '',
      expTime: 0,
      isValid: false,
      error: 'Failed to parse QR code',
    };
  }
};

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Record<string, any>>({});
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<{ name: string; points: number | null } | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanReady, setScanReady] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [_, setLastScannedCode] = useState<string>('');
  const [scanDisabled, setScanDisabled] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [merchModalVisible, setMerchModalVisible] = useState(false);
  const [merchProcessing, setMerchProcessing] = useState(false);
  const merchUserIdRef = useRef<string>('');
  const [generalCheckinModalVisible, setGeneralCheckinModalVisible] = useState(false);
  const [redemptionInfo, setRedemptionInfo] = useState<RedemptionInfo | null>(null);
  const [merchandiseItems, setMerchandiseItems] = useState<MerchandiseItem[]>([]);
  const [isGeneralCheckinMode, setIsGeneralCheckinMode] = useState(true); // Default to General Check-in
  const [eventConfirmationVisible, setEventConfirmationVisible] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<{ eventId: string; name: string } | null>(null);
  const [hasShownInitialConfirmation, setHasShownInitialConfirmation] = useState(false);
  const [lastSuccessfulScan, setLastSuccessfulScan] = useState<{ eventId: string; qrCode: string } | null>(null);
  const [undoing, setUndoing] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const isProcessingRef = useRef(false);
  const lastScannedCodeRef = useRef<string>('');

  // Filter events by selected day
  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => {
        if (!e.startTime) return false;
        if (e.eventType === 'CHECKIN') return false;
        const d = new Date(e.startTime);
        return d.getDay() === selectedDay;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [events, selectedDay]);

  useEffect(() => {
    if (!isGeneralCheckinMode && filteredEvents.length && !selectedEvent.eventId) {
      const now = new Date();
      const bufferMs = 5 * 60 * 1000; // 10 minutes in milliseconds
      
      // Find events that are currently active (within 10 minutes of start/end)
      const activeEvents = filteredEvents.filter((event) => {
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);
        
        // Event is active if current time is within 10 minutes of start or end
        const isNearStart = Math.abs(now.getTime() - startTime.getTime()) <= bufferMs;
        const isNearEnd = Math.abs(now.getTime() - endTime.getTime()) <= bufferMs;
        const isDuringEvent = now >= startTime && now <= endTime;
        
        return isNearStart || isNearEnd || isDuringEvent;
      });
      
      let chosen = null;
      
      if (activeEvents.length > 0) {
        // If there are active events, choose the one with the earliest start time
        chosen = activeEvents.reduce((earliest, current) => {
          const earliestStart = new Date(earliest.startTime);
          const currentStart = new Date(current.startTime);
          
          return currentStart < earliestStart ? current : earliest;
        });
      } else {
        // If no active events, choose the next upcoming event
        const upcomingEvents = filteredEvents
          .filter((e) => new Date(e.startTime) > now)
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        
        chosen = upcomingEvents[0];
      }
      
      if (chosen) {
        const newEvent = { eventId: chosen.eventId, name: chosen.name };
        setSelectedEvent(newEvent);
        
        // Show confirmation modal when event changes (but not on initial load)
        if (hasShownInitialConfirmation) {
          console.log('Auto event change - showing confirmation modal for:', newEvent.name);
          setPendingEvent(newEvent);
          setEventConfirmationVisible(true);
        }
      }
    }
  }, [filteredEvents, selectedEvent.eventId, isGeneralCheckinMode, hasShownInitialConfirmation]);

  // Handle app focus to show confirmation modal
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && !isGeneralCheckinMode && selectedEvent.eventId && hasShownInitialConfirmation) {
        console.log('App focus - showing confirmation modal for:', selectedEvent.name);
        setPendingEvent({ eventId: selectedEvent.eventId, name: selectedEvent.name });
        setEventConfirmationVisible(true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isGeneralCheckinMode, selectedEvent.eventId, hasShownInitialConfirmation]);

  // Show initial confirmation modal when first event is selected
  useEffect(() => {
    if (!isGeneralCheckinMode && selectedEvent.eventId && !hasShownInitialConfirmation) {
      console.log('Initial event selection - showing confirmation modal for:', selectedEvent.name);
      setPendingEvent({ eventId: selectedEvent.eventId, name: selectedEvent.name });
      setEventConfirmationVisible(true);
    }
  }, [isGeneralCheckinMode, selectedEvent.eventId, hasShownInitialConfirmation]);

  useEffect(() => {
    return () => {
      setScanned(false);
      setLoading(false);
      setTicket(null);
      setScanReady(false);
      setLastScannedCode('');
      setScanDisabled(false);
      setErrorOccurred(false);
      setErrorMessage('');
      setGeneralCheckinModalVisible(false);
      setRedemptionInfo(null);
      setMerchandiseItems([]);
      isProcessingRef.current = false;
      lastScannedCodeRef.current = '';
    };
  }, []);

  const pointsForEvent = (eventId: string): number | null => {
    const evt = events.find((e) => e.eventId === eventId);
    return evt?.points ?? null;
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (errorOccurred || isProcessingRef.current || loading || scanned || !scanReady || scanDisabled) {
      return;
    }

    if (data === lastScannedCodeRef.current) {
      return;
    }

    isProcessingRef.current = true;
    lastScannedCodeRef.current = data;
    setLastScannedCode(data);
    setScanned(true);
    setLoading(true);
    setScanReady(false); // Disable scanning while processing

    try {
      if (!selectedEvent) {
        setErrorMessage('Please select an event first');
        setErrorOccurred(true);
        setScanDisabled(true);
        return;
      }

      const parsedQr = parseQrCode(data);

      if (!parsedQr.isValid) {
        setErrorMessage(parsedQr.error || 'QR code is invalid');
        setErrorOccurred(true);
        setScanDisabled(true);
        return;
      }

      const handlePostCheckInFlow = async (userId: string) => {
        if (isGeneralCheckinMode) {
          await handleGeneralCheckinFlow(userId);
        } else {
          const openedModal = await promptTshirtRedemption(userId);
          if (!openedModal) {
            setTimeout(resetScan, 2000);
          }
        }
      };

      if (parsedQr.userId === DEMO_ACCOUNT_ID) {
        const eventName = isGeneralCheckinMode ? 'General Check-in' : selectedEvent.name;
        const targetEventId = isGeneralCheckinMode ? GENERAL_CHECKIN_EVENT_ID : selectedEvent.eventId;

        setTicket({ name: eventName, points: pointsForEvent(targetEventId) });
        setLastSuccessfulScan({
          eventId: targetEventId,
          qrCode: data,
        });
        await handlePostCheckInFlow(parsedQr.userId);
        return;
      }

      if (isGeneralCheckinMode) {
        await api.post('/checkin/scan/staff', {
          eventId: GENERAL_CHECKIN_EVENT_ID,
          qrCode: data,
        });
      } else {
        if (!selectedEvent.eventId) {
          setErrorMessage('Please select an event first');
          setErrorOccurred(true);
          setScanDisabled(true);
          return;
        }
        await api.post('/checkin/scan/staff', {
          eventId: selectedEvent.eventId,
          qrCode: data,
        });
      }

      const eventName = isGeneralCheckinMode ? 'General Check-in' : selectedEvent.name;
      const targetEventId = isGeneralCheckinMode ? GENERAL_CHECKIN_EVENT_ID : selectedEvent.eventId;

      setLastSuccessfulScan({
        eventId: targetEventId,
        qrCode: data,
      });

      if (!isGeneralCheckinMode) {
        setTicket({ name: eventName, points: pointsForEvent(targetEventId) });
      }
      await handlePostCheckInFlow(parsedQr.userId);
    } catch (err: any) {
      console.error('Scan error:', err);

      let errorMsg = 'Scan failed';

      if (err.response?.status === 401) {
        // Treat as expired but auto-reset quickly
        errorMsg = 'QR code has expired';
      } else if (err.response?.status === 403 && err.response?.data?.error === 'IsDuplicate') {
        // For duplicates: if general check-in, still open modal; otherwise, show info toast
        if (isGeneralCheckinMode) {
          try {
            const parsed = parseQrCode(lastScannedCodeRef.current);
            if (parsed.userId) {
              await handleGeneralCheckinFlow(parsed.userId);
              setTicket(null);
              return;
            }
          } catch {}
        }
        errorMsg = 'User has already been checked in to this event';
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }

      if (
        isGeneralCheckinMode &&
        err.response?.status === 403 &&
        err.response?.data?.error === 'IsDuplicate'
      ) {
        // do not block scanning UI; modal flow handled above
        setLoading(false);
        isProcessingRef.current = false;
      } else {
        setErrorMessage(errorMsg);
        setErrorOccurred(true);
        setScanDisabled(true);
        isProcessingRef.current = false;
      }
    } finally {
      setLoading(false);
      // Always reset processing state
      if (!isProcessingRef.current) {
        // Only reset if not already reset above
        isProcessingRef.current = false;
      }
    }
  };

  const handleModeChange = (isGeneralCheckin: boolean) => {
    // Reset scanner state when switching modes
    resetScan();
    setIsGeneralCheckinMode(isGeneralCheckin);
    if (isGeneralCheckin) {
      setSelectedEvent({ eventId: '', name: '' });
    }
  };

  const handleEventConfirmation = () => {
    console.log('Event confirmed:', pendingEvent?.name);
    setEventConfirmationVisible(false);
    setPendingEvent(null);
    setHasShownInitialConfirmation(true);
  };

  const handleEventConfirmationCancel = () => {
    console.log('Event confirmation cancelled');
    setEventConfirmationVisible(false);
    setPendingEvent(null);
  };

  const handleGeneralCheckinFlow = async (userId: string): Promise<void> => {
    try {
      const redemptionData = await fetchRedemptionInfo(userId);
      setRedemptionInfo(redemptionData);
      setMerchandiseItems(getMerchandiseItems(redemptionData));
      merchUserIdRef.current = userId;
      setGeneralCheckinModalVisible(true);
    } catch (e: any) {
      console.error('Failed to fetch redemption info:', e);
      // Don't show error toast for demo account
      if (userId !== DEMO_ACCOUNT_ID) {
        Toast.show({
          type: 'error',
          text1: 'Unable to load redemption info',
          text2: e?.message || 'Please try again',
          position: 'top',
          topOffset: 50,
        });
      }
      setTimeout(resetScan, 2000);
    }
  };

  const promptTshirtRedemption = async (userId: string): Promise<boolean> => {
    try {
      const redemptionData = await fetchRedemptionInfo(userId);
      const hasRedeemed = hasRedeemedTshirt(redemptionData);
      if (hasRedeemed) {
        Toast.show({
          type: 'info',
          text1: 'Already redeemed',
          text2: 'User already received t-shirt',
          position: 'top',
        });
        return false;
      }
      merchUserIdRef.current = userId;
      setMerchModalVisible(true);
      return true;
    } catch (e: any) {
      return false;
    }
  };

  const redeemMerchandise = async (tier: string) => {
    try {
      setMerchProcessing(true);
      const userId = merchUserIdRef.current;
      await redeemTier(userId, tier as any);
      Toast.show({ type: 'success', text1: `${tier} redeemed`, position: 'top' });

      const updatedRedemptionData = await fetchRedemptionInfo(userId);
      setRedemptionInfo(updatedRedemptionData);
      setMerchandiseItems(getMerchandiseItems(updatedRedemptionData));
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to redeem merchandise',
        text2: e?.message,
        position: 'top',
        topOffset: 50,
      });
    } finally {
      setMerchProcessing(false);
    }
  };

  const redeemTshirt = async () => {
    try {
      setMerchProcessing(true);
      const userId = merchUserIdRef.current;
      await redeemTier(userId, 'TIER1');
      Toast.show({ type: 'success', text1: 'T-shirt redeemed', position: 'top' });
      setMerchModalVisible(false);
      resetScan();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to redeem t-shirt',
        text2: e?.message,
        position: 'top',
      });
    } finally {
      setMerchProcessing(false);
    }
  };

  const resetScan = () => {
    setScanned(false);
    setTicket(null);
    setScanReady(true); // Always ready for next scan
    setLoading(false);
    setLastScannedCode('');
    setScanDisabled(false);
    setErrorOccurred(false);
    setErrorMessage('');
    setGeneralCheckinModalVisible(false);
    setRedemptionInfo(null);
    setMerchandiseItems([]);
    isProcessingRef.current = false;
    lastScannedCodeRef.current = '';
    
    // Force camera to reset by briefly disabling and re-enabling scanning
    setTimeout(() => {
      if (cameraRef.current) {
        // This helps reset the camera's internal state
        setScanReady(false);
        setTimeout(() => setScanReady(true), 100);
      }
    }, 100);
  };

  const handleUndoScan = async () => {
    if (!lastSuccessfulScan || undoing) return;
    setUndoing(true);
    try {
      await api.post('/checkin/scan/staff/undo', {
        eventId: lastSuccessfulScan.eventId,
        qrCode: lastSuccessfulScan.qrCode,
      });
      Alert.alert('Success', 'Successfully undone last scan!');
      setLastSuccessfulScan(null);
    } catch (err: any) {
      console.error('Undo failed:', err);
      let errorMsg = 'Undo failed';
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      Alert.alert('Error', errorMsg);
    } finally {
      setUndoing(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-[#0f062d] justify-center items-center">
        <ActivityIndicator size="large" color="#ff4ccc" />
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-[#0f062d] justify-center items-center px-6">
        <Text className="text-white text-lg text-center mb-4">
          Camera access is required to scan QR codes
        </Text>
        <TouchableOpacity className="bg-[#ff4ccc] px-6 py-3 rounded-lg" onPress={requestPermission}>
          <Text className="text-white font-semibold">Continue</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const bracketColor = scanReady && !scanDisabled ? READY_COLOR : IDLE_COLOR;

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#0f062d', '#24114c']}
        locations={[0.2, 0.56]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <SafeAreaView className="flex-1" edges={['top']}>
      <ModeSwitch isGeneralCheckinMode={isGeneralCheckinMode} onModeChange={handleModeChange} />

      {!isGeneralCheckinMode && (
        <EventSelector
          events={filteredEvents}
          selectedEvent={
            selectedEvent.eventId
              ? ({ eventId: selectedEvent.eventId, name: selectedEvent.name } as any)
              : null
          }
          isLoading={eventsLoading}
          onEventSelect={() => setPickerVisible(true)}
        />
      )}

      {/* Camera panel */}
      <TouchableWithoutFeedback onPress={() => setScanReady(true)}>
        <View
          className="flex-1 mx-4 mt-3 rounded-[20px] overflow-hidden"
          style={{ backgroundColor: '#262626' }}
        >
          {!errorOccurred ? (
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing="back"
              onBarcodeScanned={
                scanReady && !scanned && !loading && !scanDisabled ? handleBarCodeScanned : undefined
              }
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white text-lg text-center">Scanner disabled due to error</Text>
            </View>
          )}

          {/* Corner brackets - green when ready to scan */}
          <View
            pointerEvents="none"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <BracketTopLeft
              width={BRACKET_SIZE}
              height={BRACKET_SIZE * 1.05}
              color={bracketColor}
              style={{ position: 'absolute', top: BRACKET_INSET, left: BRACKET_INSET }}
            />
            <BracketTopRight
              width={BRACKET_SIZE}
              height={BRACKET_SIZE * 1.05}
              color={bracketColor}
              style={{ position: 'absolute', top: BRACKET_INSET, right: BRACKET_INSET }}
            />
            <BracketBottomLeft
              width={BRACKET_SIZE * 1.05}
              height={BRACKET_SIZE}
              color={bracketColor}
              style={{ position: 'absolute', bottom: BRACKET_INSET, left: BRACKET_INSET }}
            />
            <BracketBottomRight
              width={BRACKET_SIZE}
              height={BRACKET_SIZE}
              color={bracketColor}
              style={{ position: 'absolute', bottom: BRACKET_INSET, right: BRACKET_INSET }}
            />
          </View>

          {loading && (
            <View
              className="justify-center items-center bg-black/70 z-20"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <ActivityIndicator size="large" color="#ff4ccc" />
              <Text className="text-white/90 mt-4 text-center">Processing...</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* Instructions */}
      <View className="px-6 py-4">
        {lastSuccessfulScan && (
          <TouchableOpacity
            onPress={handleUndoScan}
            disabled={undoing}
            className={`mb-3 mx-auto px-6 py-2 rounded-full flex-row items-center border border-[#ff4ccc] bg-[#150935]/90 ${undoing ? 'opacity-50' : 'opacity-100'}`}
          >
            <Text className="text-white font-bold">Undo Last Scan</Text>
          </TouchableOpacity>
        )}
        <View className="bg-black rounded-xl px-8 py-5">
          <Text
            className="text-white text-center"
            style={{ fontFamily: 'ShareTechMono', fontSize: 14, lineHeight: 19 }}
          >
            {'Place QR inside frame to scan!\nGreen corners = ready to scan!'}
          </Text>
        </View>
      </View>

      <TicketConfirmationModal
        visible={ticket != null}
        eventName={ticket?.name ?? ''}
        points={ticket?.points ?? null}
        onClose={resetScan}
      />

      <GeneralCheckinModal
        visible={generalCheckinModalVisible}
        redemptionInfo={redemptionInfo}
        merchandiseItems={merchandiseItems}
        merchProcessing={merchProcessing}
        onRedeem={redeemMerchandise}
        onClose={() => {
          setGeneralCheckinModalVisible(false);
          resetScan();
        }}
      />

      <TshirtRedemptionModal
        visible={merchModalVisible}
        processing={merchProcessing}
        onRedeem={redeemTshirt}
        onClose={() => {
          setMerchModalVisible(false);
          resetScan();
        }}
      />

      <ErrorModal visible={errorOccurred} message={errorMessage} onClose={resetScan} />

      <EventPickerModal
        visible={pickerVisible}
        events={filteredEvents}
        selectedEventId={selectedEvent.eventId}
        onEventSelect={(val) => {
          const evt = events.find((e) => e.eventId === val);
          if (evt?.startTime) {
            const d = new Date(evt.startTime);
            setSelectedDay(d.getDay());
          }
          const newEvent = {
            eventId: val,
            name: events.find((e) => e.eventId === val)?.name || '',
          };
          setSelectedEvent(newEvent);
          setPickerVisible(false);
          
        // Show confirmation modal when manually selecting an event
        console.log('Manual event selection - showing confirmation modal for:', newEvent.name);
        setPendingEvent(newEvent);
        setEventConfirmationVisible(true);
        }}
        onClose={() => setPickerVisible(false)}
      />

      <EventConfirmationModal
        visible={eventConfirmationVisible}
        eventName={pendingEvent?.name || ''}
        eventTime={pendingEvent ? events.find(e => e.eventId === pendingEvent.eventId)?.startTime : undefined}
        eventLocation={pendingEvent ? events.find(e => e.eventId === pendingEvent.eventId)?.location : undefined}
        onConfirm={handleEventConfirmation}
        onClose={handleEventConfirmationCancel}
      />
      </SafeAreaView>
    </View>
  );
}
