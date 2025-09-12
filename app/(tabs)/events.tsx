import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Modal, Pressable } from 'react-native';
import BadgeSvg from '../../assets/images/badge.svg';
import BadgeBackSvg from '../../assets/images/badgeback.svg';
import { Dimensions } from 'react-native';
import { Animated, Easing } from 'react-native';
import { Event } from '../../api/types';
import { getWeekday } from '@/lib/utils';
import LottieView from 'lottie-react-native';
import { Header } from '@/components/home/Header';
import { DayTabs } from '@/components/events/DayTabs';
import { EventListItem } from '@/components/events/EventListItem';
import FoodMenuBottomSheet from '@/components/events/FoodMenuBottomSheet';

import BackgroundSvg from '@/assets/background/background_grate.svg';
import { useAppSelector, useAppDispatch, RootState } from '@/lib/store';
import { toggleFavorite } from '@/lib/slices/favoritesSlice';
import Toast from 'react-native-toast-message';
  
const dayTabs = [
  { label: 'TUE', dayNumber: 2, barColor: '#4F0202' },
  { label: 'WED', dayNumber: 3, barColor: '#831C1C' },
  { label: 'THU', dayNumber: 4, barColor: '#B60000' },
  { label: 'FRI', dayNumber: 5, barColor: '#E20303' },
  { label: 'SAT', dayNumber: 6, barColor: '#EF3F3F' },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const typeColors = {
  SPECIAL: '#4caf50ff',
  SPEAKER: '#4caf50ff',
  CORPORATE: '#ff9800ff',
  MEALS: '#f44336ff',
  PARTNERS: '#9c27b0ff',
  CHECKIN: '#607d8bff',
  DEFAULT: '#388e3cff',
};

const EventsScreen = () => {
  // Get data from Redux
  const events = useAppSelector((state: RootState) => state.favorites.events) || [];
  const favorites = useAppSelector((state: RootState) => state.favorites.favoriteEventIds) || [];
  const user = useAppSelector((state: RootState) => state.user.profile);
  const dispatch = useAppDispatch();

  const [selectedDay, setSelectedDay] = useState(2);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFoodMenu, setShowFoodMenu] = useState(false);

  const slideY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const itemAnimations = useRef<Record<string, Animated.Value>>({});
  // ADD
  const CARD_W = SCREEN_WIDTH * 0.85;
  const CARD_H = SCREEN_HEIGHT * 0.75;

  const flip = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);
  const foodMenuOpacity = useRef(new Animated.Value(1)).current;

  const rotateY = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const toggleFlip = () => {
    const newFlippedState = !isFlipped;

    if (newFlippedState) {
      // Flipping to back - hide food menu button immediately
      setIsFlipped(newFlippedState);
      Animated.timing(foodMenuOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      // Flipping to front - update state first, then fade in after flip
      setIsFlipped(newFlippedState);
    }

    Animated.spring(flip, {
      toValue: newFlippedState ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start(() => {
      // After flip animation completes, fade in the food menu button
      if (!newFlippedState) {
        Animated.timing(foodMenuOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const frontRotate = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  useEffect(() => {
    if (selectedEvent) {
      flip.setValue(0);
      setIsFlipped(false);
      foodMenuOpacity.setValue(1);
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedEvent) {
      Animated.timing(slideY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else {
      slideY.setValue(-SCREEN_HEIGHT);
    }
  }, [selectedEvent]);

  useEffect(() => {
    // Initialize selected tab to today's weekday (Tue-Sat), default Tuesday
    const today = new Date().getDay();
    if (today >= 2 && today <= 6) {
      setSelectedDay(today);
    } else {
      setSelectedDay(2);
    }
  }, []);

  const filteredEvents = events.filter((item: Event) => {
    if (!item.startTime) return false;
    const eventDate = new Date(item.startTime);
    return eventDate.getDay() === selectedDay;
  });

  const handleCloseModal = () => {
    flip.stopAnimation();
    flip.setValue(0);
    setIsFlipped(false);

    Animated.timing(slideY, {
      toValue: -SCREEN_HEIGHT,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setShowFoodMenu(false); // Also close food menu when closing modal
      setSelectedEvent(null);
    });
  };

  const handleFoodMenuPress = () => {
    if (selectedEvent && selectedEvent.eventType === 'MEALS') {
      setShowFoodMenu(true);
    }
  };

  const handleCloseFoodMenu = () => {
    setShowFoodMenu(false);
  };

  const handleFlagEvent = async (eventId: string) => {
    if (!user?.userId) {
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
      await dispatch(toggleFavorite({ eventId, userId: user.userId }) as any);
      const isCurrentlyFlagged = favorites.includes(eventId);
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
          source={require('@/assets/lottie/rp_animation.json')}
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
      <BackgroundSvg
        style={StyleSheet.absoluteFillObject}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        preserveAspectRatio="none"
      />
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: 'black',
        paddingTop: Platform.OS === 'android' ? 15 : 0,
      }}>
        <Header title={'EVENTS'} bigText={true} />

        <DayTabs tabs={dayTabs} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

        {filteredEvents.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-lg">No events for this day.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.eventId}
            contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 175, gap: 8 }}
            ListFooterComponent={
              <Text className="text-white/60 text-center pt-2 text-sm italic font-magistralMedium">
                End of Events
              </Text>
            }
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

        <Modal visible={!!selectedEvent && !showFoodMenu} transparent animationType="fade">
          <Pressable
            className="flex-1 bg-black/60 justify-center items-center"
            onPress={handleCloseModal}
          >
            <Animated.View
              style={{
                position: 'absolute',
                top: SCREEN_HEIGHT / 2 - (SCREEN_HEIGHT * 0.75) / 1.3,
                left: SCREEN_WIDTH / 2 - (SCREEN_WIDTH * 0.85) / 1.7,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ perspective: 1000 }, { translateY: slideY }],
              }}
            >
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backfaceVisibility: 'hidden',
                  transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
                }}
              >
                <BadgeSvg
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  color={typeColors[selectedEvent?.eventType as keyof typeof typeColors]}
                />

                <View className="absolute top-[35%] left-0 right-0 bottom-0 items-center justify-center px-6">
                  <Text
                    className="text-lg font-bold text-[#B60000] text-center mb-2"
                    style={{ fontFamily: 'ProRacingSlant' }}
                    numberOfLines={4}
                    ellipsizeMode="tail"
                  >
                    {selectedEvent?.name}
                  </Text>
                  <Text
                    className="text-sm text-[#B60000] text-center mb-2"
                    numberOfLines={20}
                    ellipsizeMode="tail"
                  >
                    {selectedEvent?.description === 'none'
                      ? 'No description available'
                      : selectedEvent?.description}
                  </Text>
                </View>
                <View className="absolute bottom-[2%] left-0 right-[10%] items-end justify-center px-6">
                  <Text className="text-xl text-[#B60000] text-center">
                    {getWeekday(selectedEvent?.startTime)}
                  </Text>
                </View>
              </Animated.View>

              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backfaceVisibility: 'hidden',
                  transform: [{ perspective: 1000 }, { rotateY: backRotate }],
                }}
              >
                <BadgeBackSvg
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  color={typeColors[selectedEvent?.eventType as keyof typeof typeColors]}
                />
                <View className="absolute bottom-[2%] left-0 right-[10%] items-end justify-center px-6">
                  <Text className="text-xl text-[#B60000] text-center">
                    {getWeekday(selectedEvent?.startTime)}
                  </Text>
                </View>
              </Animated.View>

              <Pressable
                onPress={(e) => {
                  toggleFlip();
                }}
                pointerEvents="box-only"
                style={{
                  position: 'absolute',
                  zIndex: 2,
                  width: CARD_W * 1.12,
                  height: CARD_H * 0.833,
                  top: SCREEN_HEIGHT / 2 - (CARD_H * 0.333) / 2,
                  left: SCREEN_WIDTH / 2 - (CARD_W * 1.12) / 2,
                  borderRadius: 20,
                }}
              />

              {/* Food Menu Button - Fixed overlay outside flipable area */}
              {selectedEvent && selectedEvent.eventType === 'MEALS' && (
                <Animated.View
                  style={{
                    position: 'absolute',
                    top: '80%',
                    opacity: foodMenuOpacity,
                    zIndex: 10000,
                  }}
                >
                  <TouchableOpacity
                    onPress={handleFoodMenuPress}
                    style={{
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: 'rgba(182, 0, 0, 0.3)',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: '#B60000',
                        fontSize: 14,
                        fontFamily: 'Inter',
                        fontWeight: '600',
                      }}
                    >
                      View Food Menu
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </Animated.View>
          </Pressable>
        </Modal>

        {/* Food Menu Bottom Sheet - Outside modal, shown when badge is hidden */}
        <FoodMenuBottomSheet
          isVisible={showFoodMenu}
          onClose={handleCloseFoodMenu}
          eventDescription={selectedEvent?.description || ''}
          eventName={selectedEvent?.name || ''}
        />
      </SafeAreaView>
    </View>
  );
};

export default EventsScreen;
