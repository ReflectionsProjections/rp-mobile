// THIS IS THE STAFF SCANNER SCREN
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { api } from '../../../api/api';
import { Event } from '../../../api/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCAN_BOX_SIZE = SCREEN_WIDTH * 0.7;
const SCAN_BOX_TOP_OFFSET = SCREEN_HEIGHT * 0.15; // Position box in upper-middle area

const DEMO_ACCOUNT_ID = 'demoacct-bd2c-6535-89b7-reflect12334';

const parseQrCode = (qrData: string): { userId: string; expTime: number; isValid: boolean; error?: string } => {
  try {
    const parts = qrData.split('#');
    
    if (parts.length !== 3) {
      return {
        userId: '',
        expTime: 0,
        isValid: false,
        error: 'Invalid QR code format. Expected: hash#expTime#userId'
      };
    }

    const [, expTimeStr, userId] = parts;
    const expTime = parseInt(expTimeStr, 10);

    if (isNaN(expTime)) {
      return {
        userId: '',
        expTime: 0,
        isValid: false,
        error: 'Invalid expiration time in QR code'
      };
    }

    if (Date.now() / 1000 > expTime) {
      return {
        userId,
        expTime,
        isValid: false,
        error: 'QR code has expired'
      };
    }

    return {
      userId,
      expTime,
      isValid: true
    };
  } catch (error) {
    return {
      userId: '',
      expTime: 0,
      isValid: false,
      error: 'Failed to parse QR code'
    };
  }
};

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [scanned, setScanned] = useState(false);
  const [scanReady, setScanReady] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');
  const [scanDisabled, setScanDisabled] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cameraRef = useRef<CameraView>(null);
  const isProcessingRef = useRef(false);
  const lastScannedCodeRef = useRef<string>('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
        if (res.data.length) setSelectedEvent({eventId: res.data[0].eventId, name: res.data[0].name});
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Failed to load events');
      }
    })();
  }, []);

  useEffect(() => {
    return () => {
      setScanned(false);
      setLoading(false);
      setShowSuccess(false);
      setScanReady(false);
      setLastScannedCode('');
      setScanDisabled(false);
      setErrorOccurred(false);
      setErrorMessage('');
      isProcessingRef.current = false;
      lastScannedCodeRef.current = '';
    };
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (errorOccurred || isProcessingRef.current) {
      return;
    }
    
    if (data === lastScannedCodeRef.current) {
      return;
    }
    
    if (loading || scanned || !scanReady || scanDisabled) {
      return;
    }

    isProcessingRef.current = true;
    lastScannedCodeRef.current = data;
    setLastScannedCode(data);
    setScanned(true);
    setLoading(true);
    
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

      if (parsedQr.userId === DEMO_ACCOUNT_ID) {
        setSuccessMessage(`Successfully checked in demo user into ${selectedEvent.name}!`);
        setShowSuccess(true);
        setTimeout(resetScan, 2000);
        return;
      }

      await api.post('/checkin/scan/staff', {
        eventId: selectedEvent.eventId,
        qrCode: data,
      });
      
      setSuccessMessage(`Successfully checked in user into ${selectedEvent.name}!`);
      setShowSuccess(true);
      setTimeout(resetScan, 2000);
      
    } catch (err: any) {
      console.error('Scan error:', err);
      
      let errorMsg = 'Scan failed';
      
      if (err.response?.status === 401) {
        errorMsg = 'QR code has expired';
      } else if (err.response?.status === 403 && err.response?.data?.error === 'IsDuplicate') {
        errorMsg = 'User has already been checked in to this event';
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setErrorMessage(errorMsg);
      setErrorOccurred(true);
      setScanDisabled(true);
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setScanned(false);
    setShowSuccess(false);
    setScanReady(false);
    setLoading(false);
    setLastScannedCode('');
    setScanDisabled(false);
    setErrorOccurred(false);
    setErrorMessage('');
    // Reset refs
    isProcessingRef.current = false;
    lastScannedCodeRef.current = '';
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#00adb5" />
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center px-6">
        <Text className="text-white text-lg text-center mb-4">
          Camera access is required to scan QR codes
        </Text>
        <TouchableOpacity className="bg-[#00adb5] px-6 py-3 rounded-lg" onPress={requestPermission}>
          <Text className="text-white font-semibold">Continue</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-4 py-2">
        <Text className="text-white font-bold text-lg mt-10 mb-2">Selected Event:</Text>
        <TouchableOpacity
          className="bg-[#333] rounded-lg p-3"
          onPress={() => setPickerVisible(true)}
        >
          <Text className="text-white">
            {selectedEvent.name || 'Select an event'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 relative">
        {!errorOccurred ? (
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={scanReady && !scanned && !loading && !scanDisabled ? handleBarCodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
        ) : (
          <View className="flex-1 bg-black justify-center items-center">
            <Text className="text-white text-lg text-center">Scanner disabled due to error</Text>
          </View>
        )}
        
        {/* Status overlay */}
        {!loading && !scanned && (
          <View className="absolute top-20 left-0 right-0 items-center z-10 px-4">
            {scanReady && (
              <View className="bg-black/50 rounded-lg px-4 py-2">
                <Text className="text-white text-lg font-bold text-center">
                  Ready to scan
                </Text>
              </View>
            )}
          </View>
        )}

        {loading && (
          <View className="absolute inset-0 justify-center items-center bg-black/60 z-20">
            <ActivityIndicator size="large" color="#00adb5" />
            <Text className="text-white mt-4 text-center">Processing...</Text>
          </View>
        )}

        {/* Scan box overlay */}
        <View 
          className="absolute items-center justify-center"
          style={{ 
            top: SCAN_BOX_TOP_OFFSET,
            left: 0,
            right: 0,
            width: '100%'
          }}
        >
          <TouchableWithoutFeedback onPress={() => setScanReady(true)}>
            <View className="relative" style={{ width: SCAN_BOX_SIZE, height: SCAN_BOX_SIZE }}>
              {/* Corner indicators */}
              <View className="absolute top-0 left-0 w-12 h-12">
                <View className="absolute top-0 left-0 w-8 h-1 bg-[#00adb5]" />
                <View className="absolute top-0 left-0 w-1 h-8 bg-[#00adb5]" />
              </View>
              <View className="absolute top-0 right-0 w-12 h-12">
                <View className="absolute top-0 right-0 w-8 h-1 bg-[#00adb5]" />
                <View className="absolute top-0 right-0 w-1 h-8 bg-[#00adb5]" />
              </View>
              <View className="absolute bottom-0 left-0 w-12 h-12">
                <View className="absolute bottom-0 left-0 w-8 h-1 bg-[#00adb5]" />
                <View className="absolute bottom-0 left-0 w-1 h-8 bg-[#00adb5]" />
              </View>
              <View className="absolute bottom-0 right-0 w-12 h-12">
                <View className="absolute bottom-0 right-0 w-8 h-1 bg-[#00adb5]" />
                <View className="absolute bottom-0 right-0 w-1 h-8 bg-[#00adb5]" />
              </View>
              
              {/* Scan status indicator */}
              {scanReady && (
                <View className="absolute inset-0 items-center justify-center">
                  <View className="bg-[#00adb5]/20 rounded-full p-2">
                    <View className="w-4 h-4 bg-[#00adb5] rounded-full" />
                  </View>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Instructions */}
        <View className="absolute bottom-40 left-0 right-0 px-6">
          <View className="bg-black/50 rounded-lg p-4">
            <Text className="text-white text-center text-base font-semibold mb-2">
              Attendee Check-in Scanner
            </Text>
            <Text className="text-white text-center text-sm opacity-80">
              {scanReady ? 'Align QR code within the box' : 'Tap the scan box to begin'}
            </Text>
          </View>
        </View>

      </View>

      <Modal visible={showSuccess} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={resetScan}>
          <View className="bg-[#333] p-6 rounded-lg mx-6 max-w-sm">
            <Text className="text-[#00adb5] text-xl font-bold text-center mb-2">✓ Success!</Text>
            <Text className="text-white text-center">{successMessage}</Text>
            <TouchableOpacity className="bg-[#00adb5] mt-4 py-2 rounded-lg" onPress={resetScan}>
              <Text className="text-white text-center font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={errorOccurred} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={() => {}}>
          <View className="bg-red-900/90 p-6 rounded-lg mx-6 max-w-sm min-w-[200px]">
            <Text className="text-red-200 text-xl font-bold text-center mb-4">Oops!</Text>
            <Text className="text-white text-center mb-6">{errorMessage}</Text>
            <TouchableOpacity 
              className="bg-red-600 px-6 py-3 rounded-lg" 
              onPress={resetScan}
            >
              <Text className="text-white text-center font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
          <View className="flex-1 bg-black/50 justify-center">
            <TouchableWithoutFeedback>
              <View className="mx-8 bg-[#222] rounded-lg p-4">
                <Picker
                  selectedValue={selectedEvent.eventId}
                  onValueChange={(val) => {
                    setSelectedEvent({eventId: val, name: events.find((e) => e.eventId === val)?.name || ''});
                    setPickerVisible(false);
                  }}
                  style={{ color: 'white' }}
                  dropdownIconColor="white"
                >
                  {events.map((e) => (
                    <Picker.Item key={e.eventId} label={e.name} value={e.eventId} color="white" />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}