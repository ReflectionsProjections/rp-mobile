import React, { useEffect, useState, useRef } from 'react';
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
import LottieView from 'lottie-react-native';
import { Header } from '@/components/home/Header';
import { DayTabs } from '@/components/events/DayTabs';
import { EventListItem } from '@/components/events/EventListItem';
import { EventDetailModal } from '@/components/events/EventDetailModal';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppSelector, useAppDispatch, RootState } from '@/lib/store';
import { triggerIfEnabled } from '@/lib/haptics';
import { toggleFavorite } from '@/lib/slices/favoritesSlice';
import Toast from 'react-native-toast-message';

const dayTabs = [
  { label: 'WED', dayNumber: 3 },
  { label: 'THUR', dayNumber: 4 },
  { label: 'FRI', dayNumber: 5 },
  { label: 'SAT', dayNumber: 6 },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EventsScreen = () => {
  // Get data from Redux
  const events = useAppSelector((state: RootState) => state.favorites.events) || [];
  const favorites = useAppSelector((state: RootState) => state.favorites.favoriteEventIds) || [];
  const user = useAppSelector((state: RootState) => state.user.profile);
  const dispatch = useAppDispatch();

  const [selectedDay, setSelectedDay] = useState(3);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const hapticsEnabled = useAppSelector((s: RootState) => s.settings?.hapticsEnabled ?? true);

  const itemAnimations = useRef<Record<string, Animated.Value>>({});

  useEffect(() => {
    // Initialize selected tab to today's weekday (Wed-Sat), default Wednesday
    const today = new Date().getDay();
    if (today >= 3 && today <= 6) {
      setSelectedDay(today);
    } else {
      setSelectedDay(3);
    }
  }, []);

  const filteredEvents = events.filter((item: Event) => {
    if (!item.startTime) return false;
    const eventDate = new Date(item.startTime);
    return eventDate.getDay() === selectedDay;
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
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <LottieView
          source={require('../../assets/lottie/rp_animation.json')}
          autoPlay
          loop
          style={{ width: 1000, height: 1000 }}
          speed={4}
        />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1">
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
          <View className="flex-1 justify-center items-center">
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
          onClose={handleCloseModal}
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
