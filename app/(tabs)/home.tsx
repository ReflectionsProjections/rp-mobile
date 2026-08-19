import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Text, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { FolderTabs, FolderSection } from '@/components/home/FolderTabs';
import { HomeTopBar } from '@/components/home/HomeTopBar';
import { EventListItem } from '@/components/home/EventListItem';
import { EventModal } from '@/components/home/EventModal';
import { CardType } from '@/components/home/types';

import { useToggleFavorite } from '@/api/tanstack/favorites';
import { useDataInitialization } from '@/hooks/useDataInitialization';
import { useAppSelector, useAppDispatch, RootState } from '@/lib/store';
import { useThemeColor } from '@/lib/theme';
import { fetchUserProfile } from '@/lib/slices/userSlice';
import { fetchAttendeeProfile } from '@/lib/slices/attendeeSlice';

import BackgroundSvg from '@/assets/background/home_background.svg';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import { triggerIfEnabled } from '@/lib/haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BG_BASE = '#150935';
const BG_GRADIENT = [BG_BASE, BG_BASE, BG_BASE] as const;
const BG_LOCATIONS = [0, 0.18, 0.38] as const;

type HomeCard = CardType & { startTime: string };

export default function HomeScreen() {
  const { isLoading: initLoading } = useDataInitialization();
  const events = useAppSelector((state: RootState) => state.favorites.events) || [];
  const favorites = useAppSelector((state: RootState) => state.favorites.favoriteEventIds) || [];
  const user = useAppSelector((state: RootState) => state.user.profile);
  const hapticsEnabled = useAppSelector((s: RootState) => s.settings?.hapticsEnabled ?? true);
  const themeColor = useThemeColor();
  const dispatch = useAppDispatch();

  const toggleFavoriteMutation = useToggleFavorite();

  const [selectedEvent, setSelectedEvent] = useState<CardType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [openSection, setOpenSection] = useState('next');

  const cards = useMemo<HomeCard[]>(() => {
    if (!events || events.length === 0) return [];

    return events
      .map((event) => ({
        id: event.eventId,
        title: event.name,
        time: new Date(event.startTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        location: event.location,
        pts: event.points,
        description: event.description,
        tags: event.tags ?? [],
        startTime: event.startTime,
      }))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [events]);

  // NEXT EVENTS — the rest of today's events (soonest first)
  // const nextEvents = useMemo(() => {
  //   const now = new Date();
  //   const endOfDay = new Date();
  //   endOfDay.setHours(23, 59, 59, 999);

  //   return cards.filter((c) => {
  //     if (!c.startTime) return false;
  //     const d = new Date(c.startTime);
  //     return d >= now && d <= endOfDay;
  //   });
  // }, [cards]);

  // // UPCOMING EVENTS — everything after today
  // const upcomingEvents = useMemo(() => {
  //   const endOfDay = new Date();
  //   endOfDay.setHours(23, 59, 59, 999);

  //   return cards.filter((c) => {
  //     if (!c.startTime) return false;
  //     return new Date(c.startTime) > endOfDay;
  //   });
  // }, [cards]);

  // @TODO use above version for final version, below is for debugging and checking api response

  const nextEvents = useMemo(() => cards.slice(0, 5), [cards]);

  // UPCOMING EVENTS — everything after those
  const upcomingEvents = useMemo(() => cards.slice(5), [cards]);

  // SAVED EVENTS — everything the user flagged
  const savedEvents = useMemo(
    () => cards.filter((c) => favorites.includes(c.id)),
    [cards, favorites],
  );

  const sections = useMemo<FolderSection<HomeCard>[]>(
    () => [
      {
        id: 'next',
        label: 'NEXT EVENTS',
        data: nextEvents,
        emptyMessage: 'No more events today —\ncheck the upcoming tab!',
      },
      {
        id: 'saved',
        label: 'SAVED EVENTS',
        data: savedEvents,
        emptyMessage: 'No saved events yet!\nFlag an event to see it here.',
      },
      {
        id: 'upcoming',
        label: 'UPCOMING EVENTS',
        data: upcomingEvents,
        emptyMessage: 'No upcoming events yet!',
      },
    ],
    [nextEvents, savedEvents, upcomingEvents],
  );

  const error = null;

  const hasUserRole = useMemo(() => {
    if (!user) return false;
    return user.roles?.some((r: string) => r.toUpperCase() === 'USER');
  }, [user]);

  const attendee = useAppSelector((state: RootState) => state.attendee.attendee);

  const toggleFlag = async (id: string) => {
    if (!hasUserRole || !user?.userId) {
      closeEvent();
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
      await toggleFavoriteMutation.mutateAsync({ eventId: id, userId: user.userId });
      await triggerIfEnabled(hapticsEnabled, 'light');
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

  const openEvent = (evt: CardType) => {
    setSelectedEvent(evt);
    setModalVisible(true);
  };

  const closeEvent = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
    if (!attendee) {
      dispatch(fetchAttendeeProfile());
    }
  }, [dispatch, user, attendee]);

  if (initLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <BackgroundSvg
          style={StyleSheet.absoluteFillObject}
          width={screenWidth}
          height={screenHeight}
          preserveAspectRatio="none"
        />
        <LottieView
          source={require('@/assets/lottie/rp_animation.json')}
          autoPlay
          loop
          style={{ width: 1000, height: 1000 }}
          speed={4}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: BG_BASE }]} />
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: BG_BASE }}>
      <LinearGradient
        colors={[...BG_GRADIENT]}
        locations={[...BG_LOCATIONS]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 15 : 0,
        }}
      >
        <HomeTopBar onProfilePress={() => router.push('/screens/profile')} />
        <FolderTabs<HomeCard>
          sections={sections}
          openId={openSection}
          onSelect={setOpenSection}
          keyExtractor={(item) => item.id}
          renderItem={(item, index) => (
            <EventListItem item={item} onPress={openEvent} index={index} />
          )}
        />
      </SafeAreaView>

      <EventModal
        key={`event-modal-${themeColor}`}
        visible={modalVisible}
        event={selectedEvent}
        isFlagged={selectedEvent ? favorites.includes(selectedEvent.id) : false}
        onClose={closeEvent}
        onToggleFlag={toggleFlag}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});