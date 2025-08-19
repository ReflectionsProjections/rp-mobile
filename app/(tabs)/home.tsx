// apps/tabs/home.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { Header } from '@/components/home/Header';
import { CarouselSection } from '@/components/home/CarouselSection';
import { EventModal } from '@/components/home/EventModal';
import { CardType } from '@/components/home/types';
import { Event as ApiEvent, path, RoleObject } from '@/api/types';
import { api } from '@/api/api';

// import HomeBar from '@/assets/home/homeBar.svg';
import BackgroundSvg from '@/assets/home/home_background.svg';
import CarSvg from '@/assets/home/home_car.svg';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


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
    if (!user?.userId) {
      closeEvent();
      Toast.show({
        type: 'error',
        text1: 'Registration Required',
        text2: 'You must be registered to flag an event.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
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
    const fetchEvents = async () => {
      const start = Date.now();
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
        // Only fetch favorites if user is registered
        if (user?.userId) {
          const favResponse = await api.get(path('/attendee/favorites', { userId: user.userId }));
          setFlaggedIds(new Set(favResponse.data.favorites));
        }
      } catch (e: any) {
        console.error('Failed to fetch or process events:', e);
        setError(e.message || 'Failed to load events');
      } finally {
        const elapsed = Date.now() - start;
        const remaining = 500 - elapsed;
        setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
      }
    };

    fetchEvents();
  }, [user?.userId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
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
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <BackgroundSvg 
          style={StyleSheet.absoluteFillObject} 
          width={screenWidth}
          height={screenHeight}
          preserveAspectRatio="none"
        />
        <ThemedText className="text-white text-base">Error: {error}</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Background SVG - positioned absolutely behind all content */}
      <BackgroundSvg 
          style={StyleSheet.absoluteFillObject} 
          width={screenWidth}
          height={screenHeight}
          preserveAspectRatio="none"
        />
      
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}  
        directionalLockEnabled={true} 
        nestedScrollEnabled={true} 
        scrollEnabled={scrollEnabled}
      >
        <Header />

        <ThemedText variant="bigName" className="text-left my-2 mx-4 text-white">
          R|P 2025
        </ThemedText>

        {/* <HomeBar className="mx-4" /> */}

        {/* NEXT LAP */}
        <View style={{ marginTop: 20 }}>
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
        </View>

        {/* RECOMMENDED */}
        <View style={{ marginTop: -35 }}>
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
        </View>

        {/* FLAGGED */}
        <View style={{ marginTop: -20 }}>
          <CarouselSection
            title="FLAGGED"
            data={cards.filter((c) => flaggedIds.has(c.id))}
            flaggedIds={flaggedIds}
            onToggleFlag={toggleFlag}
            onCardPress={openEvent}
            onSwipeTouchStart={() => setScrollEnabled(false)}
            onSwipeTouchEnd={() => setScrollEnabled(true)}
          />
        </View>
        <View style={{ alignItems: 'center', marginTop: -10 }}>
          <CarSvg width={300} height={200} />
        </View>
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