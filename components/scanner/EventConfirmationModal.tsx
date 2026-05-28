import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/lib/theme';
import { formatDate } from 'date-fns';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_WIDTH = SCREEN_WIDTH * 0.9;

interface EventConfirmationModalProps {
  visible: boolean;
  eventName: string;
  eventTime?: string;
  eventLocation?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const EventConfirmationModal: React.FC<EventConfirmationModalProps> = ({
  visible,
  eventName,
  eventTime,
  eventLocation,
  onConfirm,
  onClose,
}) => {
  const themeColor = useThemeColor();

  // Convert hex color to rgba with transparency
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFillObject} />

        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: hexToRgba(themeColor, 0.1) }]}>
            <View style={styles.headerContent}>
              <FontAwesome name="check-circle" size={24} color={themeColor} />
              <Text style={[styles.headerTitle, { color: themeColor }]}>
                Confirm Event
              </Text>
            </View>
            <View style={[styles.titleUnderline, { backgroundColor: themeColor }]} />
          </View>

          {/* Content */}
          <View style={styles.contentWrapper}>
            <View style={styles.contentContainer}>
              <Text style={styles.confirmationText}>
                You are now scanning for:
              </Text>
              
              <View style={[styles.eventCard, { borderColor: hexToRgba(themeColor, 0.3) }]}>
                <Text style={[styles.eventName, { color: themeColor }]}>
                  {eventName}
                </Text>
                
                {eventTime && (
                  <View style={styles.eventDetail}>
                    <FontAwesome name="clock-o" size={16} color="#666" style={styles.icon} />
                    <Text style={styles.eventDetailText}>{formatDate(new Date(eventTime), 'MM/dd/yyyy hh:mm a')}</Text>
                  </View>
                )}
                
                {eventLocation && (
                  <View style={styles.eventDetail}>
                    <FontAwesome name="map-marker" size={16} color="#666" style={styles.icon} />
                    <Text style={styles.eventDetailText}>{eventLocation}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.warningText}>
                Please confirm this is the correct event before scanning QR codes.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: themeColor }]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: MODAL_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    fontFamily: 'ProRacing',
  },
  titleUnderline: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },
  contentWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  contentContainer: {
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Magistral',
  },
  eventCard: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Magistral',
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    width: 16,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    fontFamily: 'Magistral',
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Magistral',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    fontFamily: 'Magistral',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Magistral',
  },
});
