// apps/tabs/home.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SwipeDeck from '@/components/SwipeDeck';
import { AppText } from '@/components/AppText';

import { fetchAllEvents } from '../../api/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 100;
const STACK_SEPARATION = 6;
const DOTS_HEIGHT = 24;
const STACK_SIZE = 3;
const MODAL_SIZE = width * 0.8;

interface CardType {
  id: string;
  title: string;
  time: string;
  location: string;
  pts: number;
  description?: string;
}

interface CarouselSectionProps {
  title: string;
  data: CardType[];
  flaggedIds: Set<string>;
  onToggleFlag(id: string): void;
  onCardPress(item: CardType): void;
  /* Maximum number of cards to display */
  limit?: number;
}

export default function HomeScreen() {
  // fetched cards
  const [cards, setCards]       = useState<CardType[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string|null>(null);

  // flags + modal state
  const [flaggedIds, setFlaggedIds]     = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CardType|null>(null);

  const toggleFlag = (id: string) => {
    setFlaggedIds(prev => {
      const next = new Set(prev);
      prev.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const openEvent  = (evt: CardType) => {
    setSelectedEvent(evt);
    setModalVisible(true);
  };
  const closeEvent = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  // fetch once on mount
  useEffect(() => {
    fetchAllEvents()
      .then(setCards)
      .catch((e) => setError(e.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  // loading / error states
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#00adb5" />
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <AppText style={styles.errorText}>Error: {error}</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Image source={require('../../assets/images/rp-logo.png')}
                 style={styles.logo} />
          <FontAwesome name="user-circle-o" size={28} color="#fff" />
        </View>

        {/* Title */}
        <AppText style={styles.mainTitle}>RIP 2025</AppText>

        {/* Progress */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFg, { width: `40%` }]} />
        </View>

        {/* NEXT LAP */}
        <CarouselSection
          title="NEXT LAP"
          data={cards}
          flaggedIds={flaggedIds}
          onToggleFlag={toggleFlag}
          onCardPress={openEvent}
          limit={5}
        />

        {/* RECOMMENDED */}
        <CarouselSection
          title="RECOMMENDED"
          data={cards}
          flaggedIds={flaggedIds}
          onToggleFlag={toggleFlag}
          onCardPress={openEvent}
          limit={5}
        />

        {/* FLAGGED */}
        <CarouselSection
          title="FLAGGED"
          data={cards.filter(c => flaggedIds.has(c.id))}
          flaggedIds={flaggedIds}
          onToggleFlag={toggleFlag}
          onCardPress={openEvent}
        />

      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeEvent}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={closeEvent}
          />
          <View style={styles.modalCard}>
            {selectedEvent && (
              <>
                <AppText style={styles.modalTitle}>
                  {selectedEvent.title}
                </AppText>
                <AppText style={styles.modalTime}>
                  {selectedEvent.time}
                </AppText>
                <AppText style={styles.modalLocation}>
                  {selectedEvent.location}
                </AppText>
                {selectedEvent.description && (
                  <AppText style={styles.modalDesc}>
                    {selectedEvent.description}
                  </AppText>
                )}
                <View style={styles.modalPtsBadge}>
                  <AppText style={styles.modalPtsText}>
                    {selectedEvent.pts} PTS
                  </AppText>
                </View>

                <TouchableOpacity
                  style={styles.modalFlagButton}
                  onPress={() => toggleFlag(selectedEvent.id)}
                >
                  <FontAwesome
                    name={flaggedIds.has(selectedEvent.id) ? 'flag' : 'flag-o'}
                    size={24}
                    color={flaggedIds.has(selectedEvent.id) ? 'tomato' : '#333'}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}


export const CarouselSection: React.FC<CarouselSectionProps> = ({
  title,
  data,
  flaggedIds,
  onToggleFlag,
  onCardPress,
  limit,
}) => {
  const displayData = typeof limit === 'number'
    ? data.slice(0, limit)
    : data;

  const containerHeight =
    CARD_HEIGHT + STACK_SEPARATION * (STACK_SIZE - 1) + DOTS_HEIGHT;

  return (
    <View style={styles.sectionContainer}>
      <AppText style={styles.sectionTitle}>{title}</AppText>

      <View
        style={[
          styles.deckWrapper,
          { width: CARD_WIDTH, height: containerHeight },
        ]}
      >
        <SwipeDeck
          data={displayData}
          onCardPress={onCardPress}
          containerStyle={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1).trimEnd() + '…';
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#222' },
  center:          { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText:       { color: 'white', fontSize: 16 },

  headerContainer:{ flexDirection: 'row', padding: 16,
                    justifyContent: 'space-between', alignItems: 'center' },
  logo:            { width: 32, height: 32, resizeMode: 'contain' },
  mainTitle:       { fontSize: 32, color: '#fff', textAlign: 'center',
                     marginVertical: 8 },
  progressBg:      { height: 8, backgroundColor: '#555',
                     marginHorizontal: 16, borderRadius: 4, overflow: 'hidden' },
  progressFg:      { height: '100%', backgroundColor: '#ccc' },

  sectionContainer:{ marginTop: 24 },
  sectionTitle:    { marginHorizontal: 16, color: '#fff',
                     fontSize: 18, fontWeight: 'bold' },

  deckWrapper:     { alignSelf: 'center', marginBottom: 12 },

  // modal styles
  modalOverlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
                     justifyContent: 'center', alignItems: 'center' },
  modalCard:       { width: MODAL_SIZE, height: MODAL_SIZE,
                     backgroundColor: '#dbdbdb', borderRadius: 16,
                     padding: 20, elevation: 5 },
  modalTitle:      { fontSize: 24, fontWeight: 'bold' },
  modalTime:       { marginBottom: 4 },
  modalLocation:   { marginBottom: 16, color: '#666' },
  modalDesc:       { marginBottom: 16, lineHeight: 20 },
  modalPtsBadge:   { marginBottom: 16, alignSelf: 'flex-end',
                     backgroundColor: '#000', borderRadius: 12,
                     paddingHorizontal: 8, paddingVertical: 4 },
  modalPtsText:    { color: '#fff' },
  modalFlagButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
