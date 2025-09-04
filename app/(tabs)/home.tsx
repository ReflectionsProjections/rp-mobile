// apps/tabs/home.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Animated } from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { Header } from '@/components/home/Header';
import { CarouselSection } from '@/components/home/CarouselSection';
import { EventModal } from '@/components/home/EventModal';
import { CardType } from '@/components/home/types';
import { Event as ApiEvent, path, RoleObject } from '@/api/types';
import { api } from '@/api/api';
import { useEvents } from '@/api/events';
import {
  AnimatedScrollView,
  HeaderNavBar,
  HeaderComponentWrapper,
} from '@/components/headers/parallax';
import { LinearGradient } from 'expo-linear-gradient';

import BackgroundSvg from '@/assets/background/background_grate.svg';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  // fetched cards
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<RoleObject | null>(null);
  const hasUserRole = (user?.roles ?? []).some(r => r.toUpperCase() === 'USER');


  // flags + modal state
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CardType | null>(null);

  // scrolling lock
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // ⬇️ CHANGED: cached events (served from AsyncStorage if present; otherwise fetched)
  const { data: events, isLoading: eventsLoading, error: eventsError } = useEvents();

  // staggered section animations
  const sectionAnims = React.useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (!loading) {
      Animated.stagger(
        120,
        sectionAnims.map((a) =>
          Animated.timing(a, { toValue: 1, duration: 400, useNativeDriver: true }),
        ),
      ).start();
    }
  }, [loading, cards.length]);

  const toggleFlag = async (id: string) => {
    if (!hasUserRole || !user?.userId) {
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

    const response = await api.post(path('/attendee/favorites/:eventId', { eventId: id }), {
      userId: user.userId,
    });
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

  // unchanged: fetch user once
  useEffect(() => {
    const fetchUser = async () => {
      const response = await api.get('/auth/info');
      setUser(response.data);
    };
    fetchUser();
  }, []);

  // ⬇️ CHANGED: map cached events -> cards (no direct API call here)
  useEffect(() => {
    if (!events) return;
    const formattedEvents = (events as ApiEvent[]).map((event: ApiEvent) => ({
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
  }, [events]);

  // ⬇️ CHANGED: 500ms minimum splash timing based on eventsLoading
  useEffect(() => {
    if (eventsLoading) return;
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [eventsLoading]);

  // ⬇️ CHANGED: surface query error
  useEffect(() => {
    if (eventsError) setError('Failed to load events');
  }, [eventsError]);

  // unchanged: fetch favorites only if user is registered
  useEffect(() => {
    const fetchFavs = async () => {
      if (hasUserRole && user?.userId){
        const favResponse = await api.get(path('/attendee/favorites', { userId: user.userId }));
        setFlaggedIds(new Set(favResponse.data.favorites));
      };
    };
    fetchFavs();
  }, [user?.userId]);

  const renderHeaderNavBarComponent = () => (
    <HeaderNavBar isHeader={true} showTint={false}>
      <Header />
    </HeaderNavBar>
  );

  const renderHeaderComponent = () => (
    <HeaderComponentWrapper>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.4)', 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <ThemedText variant="bigName" style={styles.mainTitle}>
              R|P 2025
            </ThemedText>
            <View style={styles.titleUnderline} />
          </View>
        </View>
      </LinearGradient>
    </HeaderComponentWrapper>
  );

  const renderTopNavBarComponent = () => (
    <HeaderNavBar isHeader={true}>
      <View
        style={{
          position: 'relative',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Header />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ThemedText
            variant="bigName"
            style={{
              fontSize: 20,
              textAlign: 'center',
              color: '#fff',
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 6,
            }}
          >
            VROOOM
          </ThemedText>
        </View>
      </View>
    </HeaderNavBar>
  );

  if (loading) {
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
        <BackgroundSvg
          style={StyleSheet.absoluteFillObject}
          width={screenWidth}
          height={screenHeight}
          preserveAspectRatio="none"
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Background SVG - positioned absolutely behind all content */}
      <BackgroundSvg
        style={StyleSheet.absoluteFillObject}
        width={screenWidth}
        height={screenHeight}
        preserveAspectRatio="none"
      />

      <AnimatedScrollView
        renderHeaderNavBarComponent={renderHeaderNavBarComponent}
        renderHeaderComponent={renderHeaderComponent}
        renderTopNavBarComponent={renderTopNavBarComponent}
        contentContainerStyle={{ paddingBottom: 120 }}
        headerMaxHeight={200}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled={true}
        nestedScrollEnabled={true}
        scrollEnabled={scrollEnabled}
      >
        {/* NEXT LAP */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: sectionAnims[0],
              transform: [
                {
                  translateY: sectionAnims[0].interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
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
        </Animated.View>

        {/* RECOMMENDED */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: sectionAnims[1],
              transform: [
                {
                  translateY: sectionAnims[1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
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
        </Animated.View>

        {/* FLAGGED */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: sectionAnims[2],
              transform: [
                {
                  translateY: sectionAnims[2].interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <CarouselSection
            title="FLAGGED"
            data={cards.filter((c) => flaggedIds.has(c.id))}
            flaggedIds={flaggedIds}
            onToggleFlag={toggleFlag}
            onCardPress={openEvent}
            onSwipeTouchStart={() => setScrollEnabled(false)}
            onSwipeTouchEnd={() => setScrollEnabled(true)}
          />
        </Animated.View>
      </AnimatedScrollView>

      <EventModal
        visible={modalVisible}
        event={selectedEvent}
        isFlagged={selectedEvent ? flaggedIds.has(selectedEvent.id) : false}
        onClose={closeEvent}
        onToggleFlag={toggleFlag}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 48,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 120,
    height: 3,
    backgroundColor: '#CA2523',
    borderRadius: 2,
  },
  sectionContainer: {
    marginTop: 0,
  },
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
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  topNavBarContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topNavBarText: {
    color: '#fff',
  },
});
