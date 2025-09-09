import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet } from 'react-native';
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

import BackgroundSvg from '@/assets/background/background_grate.svg';
import { useAppSelector, RootState } from '@/lib/store';
import { ThemedText } from '@/components/themed/ThemedText';

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
  const [selectedDay, setSelectedDay] = useState(2);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const slideY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const itemAnimations = useRef<Record<string, Animated.Value>>({});
  // ADD
  const CARD_W = SCREEN_WIDTH * 0.85;
  const CARD_H = SCREEN_HEIGHT * 0.75;

  const flip = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const rotateY = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const toggleFlip = () => {
    Animated.spring(flip, {
      toValue: isFlipped ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start(() => setIsFlipped((p) => !p));
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
      setSelectedEvent(null);
    });
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
      <SafeAreaView style={{ top: -12 }}>
        <Header title={'EVENTS'} bigText={true} />
        {/* <ThemedText
          variant="bigName"
          style={{
            fontSize: 32,
            textAlign: 'left',
            color: '#fff',
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 6,
            zIndex: 2,
            paddingHorizontal: 20,
            marginTop: 8,
          }}
        >
          EVENTS
        </ThemedText> */}

        <DayTabs tabs={dayTabs} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

        {filteredEvents.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-lg">No events for this day.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.eventId}
            contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 100, gap: 10 }}
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
                />
              );
            }}
          />
        )}

        <Modal visible={!!selectedEvent} transparent animationType="fade">
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

                <View className="absolute top-[30%] left-0 right-0 bottom-0 items-center justify-center px-6">
                  <Text
                    className="text-xl font-bold text-[#B60000] text-center mb-2"
                    style={{ fontFamily: 'ProRacingSlant' }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {selectedEvent?.name}
                  </Text>
                  <Text
                    className="text-base text-[#B60000] text-center mb-2"
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
                  width: CARD_W * 1.12, // Reduce width to match badge area
                  height: CARD_H * 0.833, // Reduce height to match badge area
                  top: SCREEN_HEIGHT / 2 - (CARD_H * 0.333) / 2,
                  left: SCREEN_WIDTH / 2 - (CARD_W * 1.12) / 2,
                  borderRadius: 20,
                }}
              />
            </Animated.View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default EventsScreen;
