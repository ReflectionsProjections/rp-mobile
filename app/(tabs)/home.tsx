// apps/tabs/home.tsx
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Dimensions, Text, Animated } from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { Header } from '@/components/home/Header';
import { CarouselSection } from '@/components/home/CarouselSection';
import { EventModal } from '@/components/home/EventModal';
import { CardType } from '@/components/home/types';
import { Event as ApiEvent, path, RoleObject } from '@/api/types';
import { api } from '@/api/api';
import {
  AnimatedScrollView,
  HeaderNavBar,
  HeaderComponentWrapper,
} from '@/components/headers/parallax';
import { LinearGradient } from 'expo-linear-gradient';

import BackgroundSvg from '@/assets/home/home_background.svg';
import CarSvg from '@/assets/home/home_car.svg';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<RoleObject | null>(null);

  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CardType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [scrollEnabled, setScrollEnabled] = useState(true);

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

  const fetchFavorites = async () => {
    if (!user?.userId) return;
    try {
      const favResponse = await api.get('/attendee/favorites', {
        params: { userId: user.userId },
      });
      const data: any = favResponse.data;
      const favs: string[] = data.favoriteEvents;
      setFlaggedIds(new Set(favs));
      setRefreshKey((prev) => prev + 1);
    } catch (e) {
      console.error('Failed to fetch favorites:', e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user?.userId) {
        console.log('[HomeScreen] fetching favorites on focus for user', user.userId);
        fetchFavorites();
      }
    }, [user?.userId])
  );

  useEffect(() => {
    if (user?.userId) {
      fetchFavorites();
    }
  }, [user?.userId]);

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
    const route = path('/attendee/favorites/:eventId', { eventId: id });
    let response;
    if (!flaggedIds.has(id)) {
      response = await api.post(route, { userId: user.userId });
    } else {
      response = await api.delete(route, { data: { userId: user.userId } });
    }
    if (response.status === 200) {
      const updatedFavorites: string[] = (response.data as any).favorites || [];
      setFlaggedIds(new Set(updatedFavorites));
      setRefreshKey((prev) => prev + 1);
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
            key={`next-${refreshKey}`}
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
            key={`rec-${refreshKey}`}
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
            key={`flag-${refreshKey}`}
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
