import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Pressable,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed/ThemedText';
import { CardType } from './types';
import { BlurView } from 'expo-blur';
import { useThemeColor } from '@/lib/theme';

interface EventModalProps {
  visible: boolean;
  event: CardType | null;
  isFlagged: boolean;
  onClose: () => void;
  onToggleFlag: (id: string) => void;
}

const FULL_SCREEN: View['props']['style'] = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

const { width, height } = Dimensions.get('window');
const MODAL_WIDTH = width * 0.9;
const MODAL_MIN_HEIGHT = height * 0.5;
const MODAL_MAX_HEIGHT = height * 0.85;

export const EventModal: React.FC<EventModalProps> = ({
  visible,
  event,
  isFlagged,
  onClose,
  onToggleFlag,
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
        <BlurView intensity={80} tint="dark" style={FULL_SCREEN} />

        {/* Background touchable area for closing */}
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

        <View style={styles.modalContainer}>
          {event && (
            <>
              {/* Header with close button */}
              <View style={[styles.header, { backgroundColor: hexToRgba(themeColor, 0.1) }]}>
                <View style={styles.headerContent}>
                  <ThemedText variant="h1" style={styles.eventTitle}>
                    {event.title}
                  </ThemedText>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <FontAwesome name="times" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                <View style={[styles.titleUnderline, { backgroundColor: themeColor }]} />
              </View>

              {/* Content area that can scroll if needed */}
              <View style={styles.contentWrapper}>
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={true}
                  bounces={true}
                  scrollEventThrottle={16}
                >
                  {/* Event Details */}
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <FontAwesome
                        name="clock-o"
                        size={16}
                        color={themeColor}
                        style={styles.icon}
                      />
                      <ThemedText variant="body-bold" style={styles.detailText}>
                        {event.time}
                      </ThemedText>
                    </View>

                    <View style={styles.detailRow}>
                      <FontAwesome
                        name="map-marker"
                        size={16}
                        color={themeColor}
                        style={styles.icon}
                      />
                      <ThemedText variant="body" style={styles.detailText}>
                        {event.location}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Description */}
                  <View style={styles.descriptionContainer}>
                    <ThemedText variant="body-bold" style={styles.descriptionTitle}>
                      DESCRIPTION
                    </ThemedText>
                    <ThemedText variant="body" style={styles.descriptionText}>
                      {event.description}
                    </ThemedText>
                  </View>

                  {/* Points Badge */}
                  <View style={styles.pointsContainer}>
                    <View style={[styles.pointsBadge, { backgroundColor: themeColor }]}>
                      <ThemedText style={styles.pointsText}>{event.pts} PTS</ThemedText>
                    </View>
                  </View>
                </ScrollView>
              </View>

              {/* Flag Button */}
              <TouchableOpacity
                style={[
                  styles.flagButton,
                  isFlagged && {
                    backgroundColor: hexToRgba(themeColor, 0.9), // Slightly transparent theme color
                  },
                ]}
                onPress={() => onToggleFlag(event.id)}
              >
                <FontAwesome
                  name={isFlagged ? 'flag' : 'flag-o'}
                  size={20}
                  color={isFlagged ? '#fff' : '#666'}
                />
                <ThemedText style={[styles.flagText, isFlagged && styles.flagTextActive]}>
                  {isFlagged ? 'FLAGGED' : 'FLAG EVENT'}
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
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
    maxHeight: MODAL_MAX_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    minHeight: MODAL_MIN_HEIGHT,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    flex: 1,
    color: '#000',
    fontSize: 20,
    lineHeight: 28,
    marginRight: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleUnderline: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },
  contentWrapper: {
    flex: 1,
    minHeight: 0, // Important: allows content to shrink
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 20,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
    width: 16,
  },
  detailText: {
    color: '#333',
    fontSize: 16,
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    color: '#000',
    fontSize: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  descriptionText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  pointsContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  pointsBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pointsText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'ProRacing',
    fontWeight: 'bold',
  },
  flagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  flagButtonActive: {
    // backgroundColor will be set dynamically using themeColor
  },
  flagText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'ProRacing',
    fontWeight: 'bold',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  flagTextActive: {
    color: '#fff',
  },
});
