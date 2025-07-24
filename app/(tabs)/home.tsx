// apps/tabs/home.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { Header } from '@/components/home/Header';
import { ProgressBar } from '@/components/home/ProgressBar';
import { CarouselSection } from '@/components/home/CarouselSection';
import { EventModal } from '@/components/home/EventModal';
import { CardType } from '@/components/home/types';
import { Event as ApiEvent, path, RoleObject } from '@/api/types';
import { api } from '@/api/api';

import HomeBar from '@/assets/home/homeBar.svg';

export default function HomeScreen() {
  // fetched cards
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<RoleObject | null>(null);

  // flags + modal state
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CardType | null>(null);

  // scrolling lock
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const toggleFlag = async (id: string) => {
    if (!user?.userId) return;
    const response = await api.post(path('/attendee/favorites/:eventId', { eventId: id }), { userId: user.userId });
    if (response.status === 200) {
      setFlaggedIds((prev) => {
        const next = new Set(prev);
        prev.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    } else {
      console.error('Failed to toggle flag:', response.data);
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
    const fetchUser = async () => {
      const response = await api.get('/auth/info');
      setUser(response.data);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        const formattedEvents = (response.data as ApiEvent[]).map((event: ApiEvent) => ({
          id: event.eventId,
          title: event.name,
          time: new Date(event.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: event.location,
          pts: event.points,
          description: event.description,
        }));
        setCards(formattedEvents);
      } catch (e: any) {
        console.error('Failed to fetch or process events:', e);
        setError(e.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async (userId: string) => {
      const response = await api.get(path('/attendee/favorites', { userId }));
      setFlaggedIds(new Set(response.data.favorites));
    };

    fetchEvents();
    fetchFavorites(user.userId);
  }, [user?.userId]);

  if (loading || !user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#00adb5" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ThemedText className="text-black text-base">Error: {error}</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#222]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}  directionalLockEnabled={true} nestedScrollEnabled={true} scrollEnabled={scrollEnabled}>
        <Header />

        <ThemedText variant="bigName" className="text-left my-2 mx-4">
          R|P 2025
        </ThemedText>

        <HomeBar className="mx-4" />

        {/* NEXT LAP */}
        <CarouselSection
          title="NEXT LAP"
          data={cards.slice(0, 1)}
          flaggedIds={flaggedIds}
          onToggleFlag={toggleFlag}
          onCardPress={openEvent}
          limit={5}
          onSwipeTouchStart={() => setScrollEnabled(false)}
          onSwipeTouchEnd={() => setScrollEnabled(true)}
        />

        {/* RECOMMENDED */}
        <CarouselSection
          title="RECOMMENDED"
          data={cards}
          flaggedIds={flaggedIds}
          onToggleFlag={toggleFlag}
          onCardPress={openEvent}
          limit={5}
          onSwipeTouchStart={() => setScrollEnabled(false)}
          onSwipeTouchEnd={() => setScrollEnabled(true)}
        />

        {/* FLAGGED */}
        <CarouselSection
          title="FLAGGED"
          data={cards.filter((c) => flaggedIds.has(c.id))}
          flaggedIds={flaggedIds}
          onToggleFlag={toggleFlag}
          onCardPress={openEvent}
          onSwipeTouchStart={() => setScrollEnabled(false)}
          onSwipeTouchEnd={() => setScrollEnabled(true)}
        />
      </ScrollView>

      <EventModal
        visible={modalVisible}
        event={selectedEvent}
        isFlagged={selectedEvent ? flaggedIds.has(selectedEvent.id) : false}
        onClose={closeEvent}
        onToggleFlag={toggleFlag}
      />
    </SafeAreaView>
  );
}
