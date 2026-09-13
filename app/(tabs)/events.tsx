import React, { useState, useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Event } from '../../api/types';
import { Header } from '@/components/home/Header';
import { DayTabs } from '@/components/events/DayTabs';
import { EventListItem } from '@/components/events/EventListItem';
import { EventDetailModal } from '@/components/events/EventDetailModal';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppSelector, useAppDispatch, RootState } from '@/lib/store';
import { triggerIfEnabled } from '@/lib/haptics';
import { toggleFavorite } from '@/lib/slices/favoritesSlice';
import Toast from 'react-native-toast-message';

// Event runs Sep 16-19, 2026 — tabs are keyed to the actual calendar dates,
// not day-of-week, so a Wed-Sat before/after the event doesn't get misidentified.
const EVENT_DAYS = [
  { label: 'WED', dayNumber: 1, date: '2026-09-16' },
  { label: 'THUR', dayNumber: 2, date: '2026-09-17' },
  { label: 'FRI', dayNumber: 3, date: '2026-09-18' },
  { label: 'SAT', dayNumber: 4, date: '2026-09-19' },
];

const dayTabs = EVENT_DAYS.map(({ label, dayNumber }) => ({ label, dayNumber }));

const toLocalDateString = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EventsScreen = () => {
  // Get data from Redux
  const events = useAppSelector((state: RootState) => state.favorites.events) || [];
  const favorites = useAppSelector((state: RootState) => state.favorites.favoriteEventIds) || [];
  const user = useAppSelector((state: RootState) => state.user.profile);
  const dispatch = useAppDispatch();

  const getInitialDay = () => {
    // Today's actual date if it's one of the event days; day 0 (no tab active)
    // before the event starts; otherwise fall back to day 1.
    const todayStr = toLocalDateString(new Date());
    const match = EVENT_DAYS.find((d) => d.date === todayStr);
    if (match) return match.dayNumber;
    if (todayStr < EVENT_DAYS[0].date) return 0;
    return EVENT_DAYS[0].dayNumber;
  };

  const [selectedDay, setSelectedDay] = useState(getInitialDay);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const hapticsEnabled = useAppSelector((s: RootState) => s.settings?.hapticsEnabled ?? true);

  const itemAnimations = useRef<Record<string, Animated.Value>>({});

  const activeDay = EVENT_DAYS.find((d) => d.dayNumber === selectedDay);
  const filteredEvents = events.filter((item: Event) => {
    if (!item.startTime || !activeDay) return false;
    return toLocalDateString(new Date(item.startTime)) === activeDay.date;
  });

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleFlagEvent = async (eventId: string) => {
    if (!user?.userId) {
      Toast.show({
        type: 'error',
        text1: 'Sign In Required',
        text2: 'Sign in to flag events and access all features!',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      await dispatch(toggleFavorite({ eventId, userId: user.userId }) as any);
      const isCurrentlyFlagged = favorites.includes(eventId);
      await triggerIfEnabled(hapticsEnabled, 'light');
      Toast.show({
        type: 'success',
        text1: isCurrentlyFlagged ? 'Event Unflagged' : 'Event Flagged',
        text2: isCurrentlyFlagged
          ? 'Event removed from your favorites'
          : 'Event added to your favorites',
        position: 'top',
        visibilityTime: 2000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update favorite status.',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  if (!events) {
    return <LoadingSpinner />;
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#130630', '#72138A']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 15 : 0,
          top: Platform.OS === 'ios' ? -12 : 0,
        }}
      >
        <Header title={'EVENTS'} bigText={true} />

        <DayTabs tabs={dayTabs} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

        {filteredEvents.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.emptyText}>No events for this day.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.eventId}
            contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 120 }}
            scrollEnabled={!selectedEvent}
            ListFooterComponent={<Text style={styles.footerText}>End of Events</Text>}
            renderItem={({ item, index }) => {
              if (!itemAnimations.current[item.eventId]) {
                itemAnimations.current[item.eventId] = new Animated.Value(0);
              }
              const anim = itemAnimations.current[item.eventId];
              Animated.timing(anim, {
                toValue: 1,
                duration: 350,
                delay: index * 80,
                useNativeDriver: true,
              }).start();
              return (
                <EventListItem
                  item={item}
                  index={index}
                  width={SCREEN_WIDTH - 30}
                  anim={anim}
                  onPress={() => setSelectedEvent(item)}
                  onFlag={handleFlagEvent}
                  isFlagged={favorites.includes(item.eventId)}
                />
              );
            }}
          />
        )}

        <EventDetailModal
          visible={!!selectedEvent}
          event={selectedEvent}
          isFlagged={selectedEvent ? favorites.includes(selectedEvent.eventId) : false}
          onClose={handleCloseModal}
          onToggleFlag={handleFlagEvent}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    color: '#fff',
    fontFamily: 'Ethnocentric',
    fontSize: 14,
    lineHeight: 22,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    paddingTop: 8,
    fontFamily: 'Ethnocentric',
    fontSize: 10,
    lineHeight: 18,
  },
});

export default EventsScreen;
