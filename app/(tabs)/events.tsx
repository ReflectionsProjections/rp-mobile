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
import { getWeekday } from '@/lib/utils';
import { api } from '@/api/api';
import { LinearGradient } from 'expo-linear-gradient';

const dayTabs = [
	{ label: "MON", dayNumber: 1, barColor: "#4F0202" },
	{ label: "TUE", dayNumber: 2, barColor: "#831C1C" },
	{ label: "WED", dayNumber: 3, barColor: "#B60000" },
	{ label: "THU", dayNumber: 4, barColor: "#E20303" },
	{ label: "FRI", dayNumber: 5, barColor: "#EF3F3F" },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        const response = await api.get('/events');
        setEvents(response.data as Event[]);
      } catch (e: any) {
        console.error('Failed to fetch or process events:', e);
        setError(e.message || 'Failed to load events');
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

  const handleCloseModal = () => {
	Animated.timing(slideY, {
	  toValue: -SCREEN_HEIGHT,
	  duration: 400,
	  easing: Easing.out(Easing.cubic),
	  useNativeDriver: true,
	}).start(() => {
	  setSelectedEvent(null);
	});
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#333333] justify-center items-center">
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#333333] pt-10">
      <Text 
		className="text-4xl font-bold text-white text-center tracking-wider"
		style={{ fontFamily: 'ProRacing' }}
	  >
		Events
	  </Text>

      <View className="flex-row justify-center space-x-3 my-4">
        {dayTabs.map((tab) => {
          const isActive = tab.dayNumber === selectedDay;
          return (
            <TouchableOpacity
              key={tab.label}
              onPress={() => setSelectedDay(tab.dayNumber)}
              className={`w-[17%] h-8 flex-row items-center ${isActive ? 'bg-black' : 'bg-white'}`}
              style={{ elevation: isActive ? 4 : 1 }}
              activeOpacity={0.85}
            >
              <View
                className="h-[80%] pl-2 ml-1"
                style={{
                  width: 8,
                  backgroundColor: tab.barColor,
                }}
              />
              <Text
                className={`ml-2 text-base font-bold italic tracking-wider ${isActive ? 'text-white' : 'text-black'}`}
                style={{ fontFamily: 'RacingSansOne-Regular' }} // or your italic font
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filteredEvents.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">No events for this day.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.eventId}
          contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 100 }}
          renderItem={({ item, index }) => {
            const start = new Date(item.startTime);
            const end = new Date(item.endTime);
            const pad = (n: number) => String(n).padStart(2, "0");
            const timeString = `${pad(start.getHours())}:${pad(
              start.getMinutes()
            )}–${pad(end.getHours())}:${pad(end.getMinutes())}`;

            return (
              <TouchableOpacity onPress={() => setSelectedEvent(item)} className="mb-3">
                <LinearGradient
                  colors={['#FFFFFF00', typeColors[item.eventType as keyof typeof typeColors]]} // Use your event type color and a secondary color
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.5, y: 0 }}
                  className="rounded-sm flex-row items-center h-20 overflow-hidden"
                  style={{ width: SCREEN_WIDTH - 40, transform: [{ skewX: '-20deg' }] }}
                >
                  {/* Remove skew for children */}
                  <View className="flex-row flex-1 h-full" style={{ transform: [{ skewX: '8deg' }] }}>
                    {/* Index */}
                    <View className="justify-center items-center w-12">
                      <Text className="text-white text-2xl font-extrabold italic">{index + 1}</Text>
                    </View>
                    {/* Event details */}
                    <View className="flex-1 justify-center pl-2">
                      <Text className="text-white text-lg font-bold" numberOfLines={1} style={{ fontFamily: 'RacingSansOne-Regular' }}>{item.name}</Text>
                      <Text className="text-white text-xs opacity-80" numberOfLines={1} style={{ fontFamily: 'RacingSansOne-Regular' }}>{item.location}</Text>
                    </View>
                    {/* Time */}
                    <View className="justify-center items-end pr-4 w-28">
                      <Text className="text-white text-md font-bold">{timeString}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <Modal 
	  	visible={!!selectedEvent} 
	  	transparent
	  	animationType="fade"
	  >
        <Pressable
          className="flex-1 bg-black/60 justify-center items-center"
          onPress={handleCloseModal}
        >
          <Animated.View
            style={{
				position: "absolute",
				top: SCREEN_HEIGHT / 2 - (SCREEN_HEIGHT * 0.75) / 1.3,
				left: SCREEN_WIDTH / 2 - (SCREEN_WIDTH * 0.85) / 1.7,
				width: "100%",
				height: "100%",
				justifyContent: "center",
				alignItems: "center",
				overflow: "hidden",
              	transform: [{ translateY: slideY }],
            }}
          >
            {/* Badge SVG as background */}
            <BadgeSvg
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              style={{ position: 'absolute', top: 0, left: 0 }}
			  color={typeColors[selectedEvent?.eventType as keyof typeof typeColors]}
            />

            {/* Overlayed content, centered in badge */}
            <View className="absolute top-[50%] left-0 right-0 bottom-0 items-center justify-center px-6">
              <Text className="text-xl font-bold text-[#B60000] text-center mb-2" style={{ fontFamily: 'ProRacingSlant' }} numberOfLines={2} ellipsizeMode="tail">
                {selectedEvent?.name}
              </Text>
              <Text className="text-base text-[#B60000] text-center mb-2" numberOfLines={4} ellipsizeMode="tail">
                {selectedEvent?.description}
              </Text>
            </View>
			<View className="absolute bottom-[2%] left-0 right-[10%] items-end justify-center px-6">
			<Text className="text-xl text-[#B60000] text-center">{getWeekday(selectedEvent?.startTime)}</Text>
			</View>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default EventsScreen;
