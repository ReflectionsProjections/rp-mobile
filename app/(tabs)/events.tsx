import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Modal, Pressable } from 'react-native';
import BadgeSvg from '../../assets/images/badge.svg';
import { Dimensions } from 'react-native';
import { Animated, Easing } from 'react-native';
import { Event } from '../../api/types';

const dayTabs = [
  { label: 'MON', dayNumber: 1, barColor: '#4caf50' },
  { label: 'TUE', dayNumber: 2, barColor: '#ff9800' },
  { label: 'WED', dayNumber: 3, barColor: '#ffffff' },
  { label: 'THU', dayNumber: 4, barColor: '#ffeb3b' },
  { label: 'FRI', dayNumber: 5, barColor: '#3f51b5' },
];
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const typeColors = {
  SPECIAL: '#4caf50',
  SPEAKER: '#4caf50',
  CORPORATE: '#ff9800',
  MEALS: '#f44336',
  PARTNERS: '#9c27b0',
  CHECKIN: '#607d8b',
  DEFAULT: '#388e3c', //backp
};

const EventsScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const slideY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;

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
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://api.reflectionsprojections.org/events', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((item) => {
    if (!item.startTime) return false;
    const eventDate = new Date(item.startTime);
    return eventDate.getDay() === selectedDay;
  });

  if (loading) {
    return (
      <View className="flex-1 bg-[#333333] justify-center items-center">
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#333333] pt-10">
      <Text className="text-3xl font-bold text-white text-center mb-4">Events</Text>

      <View className="h-[35px] mb-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 12, gap: 10 }}
          className="h-[60px] flex-grow-0"
        >
          {dayTabs.map((tab) => {
            const isActive = tab.dayNumber === selectedDay;
            return (
              <TouchableOpacity
                key={tab.label}
                onPress={() => setSelectedDay(tab.dayNumber)}
                className={`flex-row items-center rounded h-12 px-3 ${
                  isActive ? 'bg-white' : 'bg-black'
                }`}
              >
                <View
                  className="w-[6px] h-6 mr-2 rounded"
                  style={{ backgroundColor: tab.barColor }}
                />
                <Text
                  className={`text-base font-bold tracking-wider ${
                    isActive ? 'text-black' : 'text-white'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {filteredEvents.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-[#cccccc] text-base">No events for this day.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.eventId}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => {
            const bgColor = typeColors[item.eventType] || typeColors.DEFAULT;

            let timeString = '—';
            if (item.startTime && item.endTime) {
              const start = new Date(item.startTime);
              const end = new Date(item.endTime);
              const pad = (n: number) => String(n).padStart(2, '0');
              const hh1 = pad(start.getHours());
              const mm1 = pad(start.getMinutes());
              const hh2 = pad(end.getHours());
              const mm2 = pad(end.getMinutes());
              timeString = `${hh1}:${mm1}–${hh2}:${mm2}`;
            }

            return (
              <TouchableOpacity onPress={() => setSelectedEvent(item)}>
                <View
                  className="flex-row rounded-none mx-3 my-1.5 py-3 px-4"
                  style={{ backgroundColor: bgColor }}
                >
                  <Text className="text-xl font-bold text-black w-8">{index + 1}.</Text>

                  <View className="flex-1 pl-2">
                    <Text className="text-lg font-bold text-black">{item.name || 'No Name'}</Text>
                    <Text className="text-sm text-black mt-0.5">{item.location || 'TBD'}</Text>
                  </View>

                  <Text className="text-base font-bold text-black ml-3">{timeString}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <Modal visible={!!selectedEvent} transparent>
        <Pressable
          className="flex-1 justify-center items-center bg-black/60"
          onPress={() => setSelectedEvent(null)}
        >
          {/* Animated badge container starts here */}
          <Animated.View
            className="absolute justify-center items-center overflow-hidden"
            style={[
              {
                top: SCREEN_HEIGHT / 2 - (SCREEN_HEIGHT * 0.75) / 1.4,
                left: SCREEN_WIDTH / 2 - (SCREEN_WIDTH * 0.85) / 1.75,
                width: SCREEN_WIDTH * 0.95,
                height: SCREEN_HEIGHT * 0.85,
              },
              { transform: [{ translateY: slideY }] },
            ]}
          >
            <BadgeSvg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />

            <View className="absolute top-[65%] left-[10%] right-[10%] items-center">
              <Text className="text-black text-lg font-bold">{selectedEvent?.name}</Text>
              <Text className="text-black text-sm mt-2 text-center">
                {selectedEvent?.description}
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default EventsScreen;
