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
import { api } from '../../api/api';
import { Event } from '../../api/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCAN_BOX_SIZE = SCREEN_WIDTH * 0.7;

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const cameraRef = useRef<any>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
        if (response.data.length > 0) {
          setSelectedEventId(response.data[0].eventId);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        Alert.alert('Error', 'Failed to load events');
      }
    };
    fetchEvents();
  }, []);

  const handleBarCodeScanned = async ({ data }: any) => {
    if (scanned) return;
    setScanned(true); // Set immediately to prevent double scans
    setLoading(true);

    try {
      if (!selectedEventId) {
        Alert.alert('Error', 'Please select an event first');
        return;
      }

      const response = await api.post('/checkin/scan/staff', {
        eventId: selectedEventId,
        qrCode: data,
      });

      setSuccessMessage(response.data);
      setShowSuccess(true);

      setTimeout(() => {
        setScanned(false);
        setShowSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error('Scan error:', error);
      Alert.alert('Scan Failed', error.response?.data?.message || 'Failed to process QR code');
      setScanned(false);
      setShowSuccess(false); // Ensure success modal is reset on scan failure
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setScanned(false);
    setShowSuccess(false);
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
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-4 py-2">
        <Text className="text-white text-xl font-bold">QR Scanner</Text>
      </View>

      <View className="px-4 py-2">
        <Text className="text-white text-sm mb-2">Selected Event:</Text>
        <TouchableOpacity
          className="bg-[#333] rounded-lg p-3"
          onPress={() => setPickerVisible(true)}
          activeOpacity={0.7}
        >
          <Text className="text-white">
            {events.find((e) => e.eventId === selectedEventId)?.name || 'Select an event'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 relative">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          {!scanned && !loading && (
            <View className="absolute px-4 inset-0 justify-center items-center bg-black/40 z-10">
              <Text className="text-green-500 text-lg font-bold">Ready to Scan!</Text>
            </View>
          )}
          {loading && (
            <View className="absolute px-4 inset-0 justify-center items-center bg-black/60 z-20">
              <ActivityIndicator size="large" color="#00adb5" />
              <Text className="text-white mt-4 text-center">Processing...</Text>
            </View>
          )}
          <View className="flex-1 items-center top-20">
            <View className="relative" style={{ width: SCAN_BOX_SIZE, height: SCAN_BOX_SIZE }}>
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
            </View>

            <View className="relative top-20 left-0 right-0 px-6">
              <Text className="text-white text-center text-base font-semibold mb-2">
                Attendee Check-in Scanner
              </Text>
              <Text className="text-white text-center text-sm opacity-80">
                Scan an attendee's QR code to check them into the selected event
              </Text>
            </View>
          </View>
        </CameraView>

        {scanned && !loading && (
          <View className="absolute inset-0 justify-center items-center bg-black/40 z-20">
            <Text className="text-white text-lg font-bold mb-4">Scan Complete</Text>
            <TouchableOpacity
              className="bg-[#00adb5] px-6 py-3 rounded-lg"
              onPress={resetScan}
            >
              <Text className="text-white font-semibold">Scan Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={showSuccess} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowSuccess(false)}
        >
          <View className="bg-[#333] p-6 rounded-lg mx-6 max-w-sm">
            <Text className="text-[#00adb5] text-xl font-bold text-center mb-2">✓ Success!</Text>
            <Text className="text-white text-center">{successMessage}</Text>
            <TouchableOpacity
              className="bg-[#00adb5] mt-4 py-2 rounded-lg"
              onPress={() => {
                setShowSuccess(false);
                setScanned(false); // <-- ensure you can scan again
              }}
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
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
            <TouchableWithoutFeedback>
              <View className="mx-8 bg-[#222] rounded-lg p-4">
                <Picker
                  selectedValue={selectedEventId}
                  onValueChange={(itemValue: string) => {
                    setSelectedEventId(itemValue);
                    setPickerVisible(false);
                  }}
                  style={{ color: 'white' }}
                  dropdownIconColor="white"
                >
                  {events.map((event) => (
                    <Picker.Item
                      key={event.eventId}
                      label={event.name}
                      value={event.eventId}
                      color="white"
                    />
                  ))}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default ScannerScreen;
