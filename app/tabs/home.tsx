import React, { ReactNode } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacityProps,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SwipeDeck from '@/components/SwipeDeck';
import { AppText } from '@/components/AppText';
import { useState } from 'react';

const { width } = Dimensions.get('window');

// --- Types ---
interface CardType {
  id: string;
  title: string;
  time: string;
  location: string;
  pts: number;
  description?: string; // optional for modal
}

const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 100;       // must match SwipeDeck’s CARD_HEIGHT
const STACK_SEPARATION = 6;   // must match SwipeDeck’s stackSeparation
const DOTS_HEIGHT = 24;
const STACK_SIZE = 3;
const MODAL_SIZE = width * 0.8;

// Dummy data
const cards: CardType[] = [
  { id: '1', title: 'TITLE1', time: '0:00 PM', location: 'Siebel 2405', pts: 10 , description: 'Looking for a career opportunity? The R|P career fair …',},
  { id: '2', title: 'TITLE2', time: '0:00 PM', location: 'Siebel 2405', pts: 10 , description: 'Looking for a career opportunity? The R|P career fair …',},
  { id: '3', title: 'TITLE3', time: '0:00 PM', location: 'Siebel 2405', pts: 10 , description: 'Looking for a career opportunity? The R|P career fair …',},
  // …etc
];


// Header
const Header: React.FC = () => (
  <View style={styles.headerContainer}>
    <Image source={require('../../assets/images/rp-logo.png')} style={styles.logo} />
    <FontAwesome name="user-circle-o" size={28} color="#fff" />
  </View>
);

// Progress Bar
interface ProgressBarProps {
  progress?: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ progress = 0.5 }) => (
  <View style={styles.progressBg}>
    <View style={[styles.progressFg, { width: `${progress * 100}%` }]} />
  </View>
);

// Section Title
interface SectionTitleProps {
  children: ReactNode;
}
const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <AppText style={styles.sectionTitle}>{children}</AppText>
);

// Card Item
interface CardProps {
  item: CardType;
  flagged?: boolean;
  onPress: () => void;
}
const Card: React.FC<CardProps> = ({ item, flagged = false, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardHeader}>
      <AppText style={styles.cardTitle}>{item.title}</AppText>
      {flagged && <FontAwesome name="flag" size={18} color="#fff" />}
    </View>
    <AppText style={styles.cardTime}>{item.time}</AppText>
    <AppText style={styles.cardLocation}>{item.location}</AppText>
    <View style={styles.cardFooter}>
      <View style={styles.pointsBadge}>
        <AppText style={styles.pointsText}>{item.pts} PTS</AppText>
      </View>
    </View>
  </TouchableOpacity>
);

// Carousel Section
interface CarouselSectionProps {
  title: string;
  data: CardType[];
  flaggedIds: Set<string>;
  onToggleFlag(id: string): void;
  onCardPress(item: CardType): void;
}
const CarouselSection: React.FC<CarouselSectionProps> = ({
  title,
  data,
  flaggedIds,
  onToggleFlag,
  onCardPress,
}) => {
  const containerHeight =
    CARD_HEIGHT + STACK_SEPARATION * (STACK_SIZE - 1) + DOTS_HEIGHT;

  return (
    <View style={styles.sectionContainer}>
      <SectionTitle>{title}</SectionTitle>

      {}
      <View
        style={[
          styles.deckWrapper,
          { width: CARD_WIDTH, height: containerHeight },
        ]}
      >
        <SwipeDeck
          data={data}
          flaggedIds={flaggedIds}
          onToggleFlag={onToggleFlag}
          onCardPress={onCardPress}
          containerStyle={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

// Big Button at Bottom
interface BigButtonProps {
  label: string;
  onPress: () => void;
}
const BigButton: React.FC<BigButtonProps> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.bigButton} onPress={onPress}>
    <AppText style={styles.bigButtonText}>{label}</AppText>
  </TouchableOpacity>
);

// Home Screen
const HomeScreen: React.FC = () => {

  // 1) state for flagged cards
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const toggleFlag = (id: string) =>
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CardType | null>(null);

  const openEvent = (event: CardType) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };
  const closeEvent = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header />
        <AppText style={styles.mainTitle}>RIP 2025</AppText>
        <ProgressBar progress={0.4} />

        <CarouselSection
          title="NEXT LAP"
          data={cards}
          flaggedIds={flaggedIds}
          onToggleFlag={toggleFlag}
          onCardPress={openEvent}
        />

        <CarouselSection
          title="RECOMMENDED"
          data={cards}
          flaggedIds={flaggedIds}
          onToggleFlag={toggleFlag}
          onCardPress={openEvent}
        />

        <CarouselSection
          title="FLAGGED"
          data={cards.filter((c) => flaggedIds.has(c.id))}
          flaggedIds={flaggedIds}
          onToggleFlag={toggleFlag}
          onCardPress={openEvent}
        />

        <BigButton label="CAR" onPress={() => { /* … */ }} />
      </ScrollView>

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
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  mainTitle: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 8,
  },
  progressBg: {
    height: 8,
    backgroundColor: '#555',
    marginHorizontal: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFg: {
    height: '100%',
    backgroundColor: '#ccc',
  },
  sectionTitle: {
    marginHorizontal: 16,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    width: width * 0.7,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTime: {
    color: '#bbb',
    marginTop: 4,
  },
  cardLocation: {
    color: '#999',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  pointsBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
  },
  bigButton: {
    backgroundColor: '#ccc',
    margin: 16,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  deckWrapper: {
    // fill horizontally, center the swiper inside it
    alignSelf: 'center',
    marginBottom: 7,
    marginTop: 12,
  },

  swiperContainer: {
    width: CARD_WIDTH,
    height: '100%',
  },
  sectionContainer: {
    marginTop: 24,
  },

  // modal styles
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalTime: {
    marginBottom: 4,
  },
  modalLocation: {
    marginBottom: 16,
    color: '#666',
  },
  modalDesc: {
    marginBottom: 16,
    lineHeight: 20,
  },
  modalPtsBadge: {
    marginBottom: 16,
    alignSelf: 'flex-end',
    backgroundColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalPtsText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',  // darken rest of screen
    justifyContent: 'center',             // vertical centering
    alignItems: 'center',                 // horizontal centering
  },
  modalCard: {
    width: MODAL_SIZE,
    height: MODAL_SIZE,           // makes it perfectly square
    backgroundColor: '#dbdbdb',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },

});
