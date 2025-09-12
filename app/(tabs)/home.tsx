// apps/tabs/home.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Animated, SafeAreaView, Platform } from 'react-native';
import { Header } from '@/components/home/Header';
import { CarouselSection } from '@/components/home/CarouselSection';
import { EventModal } from '@/components/home/EventModal';
import ShiftModal from '@/components/home/ShiftModal';
import { CardType } from '@/components/home/types';
import { ShiftCard } from '@/api/types';

import { useToggleFavorite } from '@/api/tanstack/favorites';
import { useDataInitialization } from '@/hooks/useDataInitialization';
import { useAppSelector, useAppDispatch, RootState } from '@/lib/store';
import { useThemeColor } from '@/lib/theme';
import {
  toggleAcknowledgeShift,
  toggleLocalAcknowledge,
  fetchMyShifts,
} from '@/lib/slices/shiftsSlice';
import { fetchUserProfile } from '@/lib/slices/userSlice';
import { fetchAttendeeProfile } from '@/lib/slices/attendeeSlice';

import BackgroundSvg from '@/assets/background/background_grate.svg';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import { triggerIfEnabled } from '@/lib/haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const { height } = Dimensions.get('window'); // For responsive design

export default function HomeScreen() {
  const { isLoading: initLoading } = useDataInitialization();
  const events = useAppSelector((state: RootState) => state.favorites.events) || [];
  const favorites = useAppSelector((state: RootState) => state.favorites.favoriteEventIds) || [];
  const user = useAppSelector((state: RootState) => state.user.profile);
  const themeColor = useThemeColor();
  const dispatch = useAppDispatch();

  const toggleFavoriteMutation = useToggleFavorite();

  const [selectedEvent, setSelectedEvent] = useState<CardType | null>(null);
  const [selectedShift, setSelectedShift] = useState<ShiftCard | null>(null);
  const [shiftModalVisible, setShiftModalVisible] = useState(false);
  const ackPendingRef = useRef<Record<string, boolean>>({});
  const [, forceRerender] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const cards = useMemo(() => {
    if (!events || events.length === 0) return [];

    return events.map((event) => ({
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
    }));
  }, [events]);

  // Get flagged cards
  const flaggedCards = useMemo(() => {
    return cards.filter((c: CardType) => favorites?.includes(c.id));
  }, [cards, favorites]);

  // Check if user has USER role
  const hasUserRole = useMemo(() => {
    if (!user) {
      return false;
    }
    return user.roles?.some((r: string) => r.toUpperCase() === 'USER');
  }, [user]);

  // Check if user has STAFF or ADMIN role
  const hasStaffRole = useMemo(() => {
    if (!user) {
      return false;
    }
    return user.roles?.some((r: string) => {
      const role = r.toUpperCase();
      return role === 'STAFF' || role === 'ADMIN';
    });
  }, [user]);

  const myShifts = useAppSelector((state: RootState) => state.shifts.shifts);

  // Process shift data for staff users
  const shiftCards = useMemo(() => {
    if (!myShifts || !hasStaffRole) return [];

    return (myShifts || [])
      .filter((assignment) => assignment && assignment.shifts)
      .map((assignment) => {
        const s = assignment.shifts!;
        const start = s.startTime ? new Date(s.startTime) : null;
        const time = start
          ? start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '-';

        return {
          id: assignment.shiftId,
          title: s.name || 'Shift',
          time,
          location: s.location || 'TBA',
          role: s.role || 'STAFF',
          acknowledged: !!assignment.acknowledged,
          startTime: s.startTime || '',
          endTime: s.endTime || '',
        } as ShiftCard;
      });
  }, [myShifts, hasStaffRole]);

  // Separate shifts into today and upcoming
  const todayShifts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filtered = shiftCards.filter((shift) => {
      if (!shift.startTime) return false;
      const shiftDate = new Date(shift.startTime);
      return shiftDate >= today && shiftDate < tomorrow;
    });
    return filtered;
  }, [shiftCards]);

  const upcomingShifts = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const filtered = shiftCards.filter((shift) => {
      if (!shift.startTime) return false;
      const shiftDate = new Date(shift.startTime);
      return shiftDate > today;
    });
    return filtered;
  }, [shiftCards]);

  const error = null;

  const sectionAnims = React.useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (!initLoading) {
      Animated.stagger(
        120,
        sectionAnims.map((a) =>
          Animated.timing(a, { toValue: 1, duration: 400, useNativeDriver: true }),
        ),
      ).start();
    }
  }, [initLoading, cards.length]);

  // Get user tags from attendee profile
  const attendee = useAppSelector((state: RootState) => state.attendee.attendee);
  const userTags = useMemo(() => {
    return (attendee?.tags ?? []).map((t: string) => t.toLowerCase());
  }, [attendee?.tags]);

  const toggleFlag = async (id: string) => {
    if (!hasUserRole || !user?.userId) {
      closeEvent();
      Toast.show({
        type: 'error',
        text1: 'Registration Required',
        text2: 'Make sure to register for R|P to flag events!',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      await toggleFavoriteMutation.mutateAsync({ eventId: id, userId: user.userId });
      const hapticsEnabled = useAppSelector((s: RootState) => s.settings?.hapticsEnabled ?? true);
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

  // Fetch user and attendee data using Redux
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    }
    if (!attendee) {
      dispatch(fetchAttendeeProfile());
    }
  }, [dispatch, user, attendee]);

  const recommended = useMemo(() => {
    if (!cards.length) return [];

    const today = new Date();
    const todayWeekday = today.getDay();

    const todaysEventIds = new Set(
      (events || [])
        .filter((evt) => {
          if (!evt?.startTime) return false;
          const d = new Date(evt.startTime);
          return d.getDay() === todayWeekday;
        })
        .map((evt) => evt.eventId),
    );

    const todaysCards = cards.filter((c) => todaysEventIds.has(c.id));
    if (!todaysCards.length) return [];

    if (!userTags.length) return todaysCards;

    const tagSet = new Set(userTags.map((t: string) => t.toLowerCase()));
    const scored = todaysCards.map((c) => {
      const overlap = (c.tags ?? []).reduce(
        (acc: number, t: string) => acc + (tagSet.has(t.toLowerCase()) ? 1 : 0),
        0,
      );
      return { c, score: overlap };
    });

    const filtered = scored.filter(({ score }) => score > 0);
    const sorted = filtered.sort((a, b) => b.score - a.score);
    const result = sorted.map(({ c }) => c);

    return result;
  }, [cards, events, userTags]);

  const openShift = (shift: ShiftCard) => {
    setSelectedShift(shift);
    setShiftModalVisible(true);
  };

  const closeShift = () => {
    setShiftModalVisible(false);
    setSelectedShift(null);
  };

  const onToggleAcknowledge = async (shiftId: string) => {
    if (ackPendingRef.current[shiftId]) return;
    ackPendingRef.current[shiftId] = true;
    forceRerender((n) => n + 1);
    try {
      setSelectedShift((prev) =>
        prev && prev.id === shiftId ? { ...prev, acknowledged: !prev.acknowledged } : prev,
      );
      dispatch(toggleLocalAcknowledge(shiftId));
      const result = await dispatch(toggleAcknowledgeShift(shiftId) as any);
      if (result?.meta?.requestStatus === 'rejected') {
        dispatch(toggleLocalAcknowledge(shiftId));
        setSelectedShift((prev) =>
          prev && prev.id === shiftId ? { ...prev, acknowledged: !prev.acknowledged } : prev,
        );
      }
    } catch (e) {
      dispatch(toggleLocalAcknowledge(shiftId));
      setSelectedShift((prev) =>
        prev && prev.id === shiftId ? { ...prev, acknowledged: !prev.acknowledged } : prev,
      );
    } finally {
      setTimeout(() => {
        delete ackPendingRef.current[shiftId];
        forceRerender((n) => n + 1);
      }, 800);
    }
  };

  const handleSwipeTouchStart = () => {
    setScrollEnabled(false);
  };

  const handleSwipeTouchEnd = () => {
    setScrollEnabled(true);
  };

  // Loading screen
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

  // Error screen
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <BackgroundSvg
          style={StyleSheet.absoluteFillObject}
          width={screenWidth}
          height={screenHeight}
          preserveAspectRatio="none"
        />
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}
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

      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 15 : 0,
          top: Platform.OS === 'ios' ? -12 : 0,
        }}
      >
        <Header title={'R|P 2025'} bigText={true} />
        <View style={{ marginTop: height < 700 ? 8 : 20 }}>
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
              key={`next-lap-${themeColor}`}
              title="NEXT LAP"
              data={cards.slice(0, 1) || []}
              flaggedIds={favorites}
              onToggleFlag={toggleFlag}
              onCardPress={openEvent}
              limit={5}
              onSwipeTouchStart={handleSwipeTouchStart}
              onSwipeTouchEnd={handleSwipeTouchEnd}
            />
          </Animated.View>

          {/* Conditional rendering based on user role */}
          {hasStaffRole ? (
            <>
              {/* TODAY'S SHIFTS */}
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
                  key={`today-shifts-${themeColor}`}
                  title="TODAY'S SHIFTS"
                  data={todayShifts || []}
                  flaggedIds={[]}
                  onToggleFlag={() => {}}
                  onCardPress={openShift}
                  limit={5}
                  onSwipeTouchStart={handleSwipeTouchStart}
                  onSwipeTouchEnd={handleSwipeTouchEnd}
                />
              </Animated.View>

              {/* UPCOMING SHIFTS */}
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
                  key={`upcoming-shifts-${themeColor}`}
                  title="UPCOMING"
                  data={upcomingShifts || []}
                  flaggedIds={[]}
                  onToggleFlag={() => {}}
                  onCardPress={openShift}
                  onSwipeTouchStart={handleSwipeTouchStart}
                  onSwipeTouchEnd={handleSwipeTouchEnd}
                />
              </Animated.View>
            </>
          ) : (
            <>
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
                  key={`recommended-${themeColor}`}
                  title="RECOMMENDED"
                  data={recommended} // 👈 from your branch
                  flaggedIds={favorites}
                  onToggleFlag={toggleFlag}
                  onCardPress={openEvent}
                  limit={5}
                  onSwipeTouchStart={handleSwipeTouchStart}
                  onSwipeTouchEnd={handleSwipeTouchEnd}
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
                  key={`flagged-${themeColor}`}
                  title="FLAGGED"
                  data={cards.filter((c) => favorites.includes(c.id))} // 👈 no flaggedCards state needed
                  flaggedIds={favorites}
                  onToggleFlag={toggleFlag}
                  onCardPress={openEvent}
                  onSwipeTouchStart={handleSwipeTouchStart}
                  onSwipeTouchEnd={handleSwipeTouchEnd}
                />
              </Animated.View>
            </>
          )}
        </View>
      </SafeAreaView>

      <EventModal
        key={`event-modal-${themeColor}`}
        visible={modalVisible}
        event={selectedEvent}
        isFlagged={selectedEvent ? favorites.includes(selectedEvent.id) : false}
        onClose={closeEvent}
        onToggleFlag={toggleFlag}
      />
      {hasStaffRole && (
        <ShiftModal
          visible={shiftModalVisible}
          shift={selectedShift}
          onClose={closeShift}
          onToggleAcknowledge={onToggleAcknowledge}
          disabled={selectedShift ? !!ackPendingRef.current[selectedShift.id] : false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 120,
    height: 3,
    borderRadius: 2,
  },
  sectionContainer: {
    marginTop: 0,
    marginBottom: height < 700 ? 0 : 12, // Tighter spacing for iPhone SE
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
