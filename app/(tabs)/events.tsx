import React, { useEffect, useState, useRef } from "react";
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	SafeAreaView,
} from "react-native";
import { Modal, Pressable } from "react-native";
import BadgeSvg from "../../assets/images/badge.svg";
import { Dimensions } from "react-native";
import { Animated, Easing } from "react-native";
import SpeakerShape from "../../assets/images/speakerblock.svg";
import MealsShape from "../../assets/images/corporate.svg";
import CorporateShape from "../../assets/images/meals.svg";
import DefaultShape from "../../assets/images/meals.svg";
import { useFonts } from "expo-font";

const dayTabs = [
	{ label: "MON", dayNumber: 1, barColor: "#4F0202" },
	{ label: "TUE", dayNumber: 2, barColor: "#831C1C" },
	{ label: "WED", dayNumber: 3, barColor: "#B60000" },
	{ label: "THU", dayNumber: 4, barColor: "#E20303" },
	{ label: "FRI", dayNumber: 5, barColor: "#EF3F3F" },
];

const ShapeByType = {
	SPEAKER: SpeakerShape,
	CORPORATE: CorporateShape,
	MEALS: MealsShape,
	DEFAULT: DefaultShape,
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const typeColors = {
	SPECIAL: "#4caf50",
	SPEAKER: "#4caf50",
	CORPORATE: "#ff9800",
	MEALS: "#f44336",
	DEFAULT: "#388e3c", //backp
};

const EventsScreen = () => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedDay, setSelectedDay] = useState(1);
	const [selectedEvent, setSelectedEvent] = useState(null);

	const [loaded] = useFonts({
		ProRacing: require("../../assets/fonts/ProRacing.otf"),
		ProRacingSlant: require("../../assets/fonts/ProRacingSlant.otf"),
	});

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
				const response = await fetch(
					"https://api.reflectionsprojections.org/events",
					{
						method: "GET",
						headers: { "Content-Type": "application/json" },
					}
				);
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}
				const data = await response.json();
				setEvents(data);
			} catch (err) {
				console.error("Failed to fetch events:", err);
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
			<View style={styles.loaderContainer}>
				<ActivityIndicator size="large" color="#888" />
			</View>
		);
	}

	const getWeekday = (isoString) => {
		if (!isoString) return "";
		const d = new Date(isoString);
		return d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.headerText}>Events</Text>

			<View style={styles.tabsWrapper}>
				{/* <ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.tabsContainer}
					style={styles.tabsScroll}
				> */}
				<View style={styles.tabsContainer}>
					{dayTabs.map((tab) => {
						const isActive = tab.dayNumber === selectedDay;
						return (
							<TouchableOpacity
								key={tab.label}
								onPress={() => setSelectedDay(tab.dayNumber)}
								style={[
									styles.tab,
									{ backgroundColor: isActive ? "#000000" : "#ffffff" },
								]}
							>
								<View
									style={[styles.tabBar, { backgroundColor: tab.barColor }]}
								/>
								<Text
									style={[
										styles.tabLabel,
										{ color: isActive ? "#ffffff" : "#000000" },
									]}
								>
									{tab.label}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>

			{filteredEvents.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>No events for this day.</Text>
				</View>
			) : (
				<FlatList
					data={filteredEvents}
					keyExtractor={(item) => item.eventId}
					contentContainerStyle={[styles.listContent, { paddingHorizontal: 0 }]}
					renderItem={({ item, index }) => {
						const Shape = ShapeByType[item.eventType] || DefaultShape;
						const start = new Date(item.startTime);
						const end = new Date(item.endTime);
						const pad = (n) => String(n).padStart(2, "0");
						const timeString = `${pad(start.getHours())}:${pad(
							start.getMinutes()
						)}–${pad(end.getHours())}:${pad(end.getMinutes())}`;

						return (
							<TouchableOpacity onPress={() => setSelectedEvent(item)}>
								<View style={styles.svgWrapper}>
									<Shape
										width={SCREEN_WIDTH - 24}
										height={80}
										style={StyleSheet.absoluteFill}
									/>

									<Text style={[styles.eventIndex, styles.svgText]}>
										{index + 1}.
									</Text>
									<View style={styles.svgTextBlock}>
										<Text style={styles.eventName}>{item.name}</Text>
										{/* <Text style={styles.eventLocation}>{item.location}</Text> */}

										<Text style={[styles.eventTime, styles.svgText]}>
											{timeString}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						);
					}}
				/>
			)}
			<Modal visible={!!selectedEvent} transparent>
				<Pressable
					style={styles.modalOverlay}
					onPress={() => setSelectedEvent(null)}
				>
					{/* Animated badge container starts here */}
					<Animated.View
						style={[
							styles.badgeContainer,
							{ transform: [{ translateY: slideY }] },
						]}
					>
						<BadgeSvg
							width="100%"
							height="100%"
							preserveAspectRatio="xMidYMid meet"
						/>

						<View style={styles.badgeTextWrapper}>
							<Text style={styles.badgeTitle}>{selectedEvent?.name}</Text>
							<Text
								style={styles.badgeSubtitle}
								numberOfLines={4}
								ellipsizeMode="tail"
							>
								{selectedEvent?.description}
							</Text>
						</View>
						{/* location, just above the day */}
						<Text style={styles.badgeLocation}>{selectedEvent?.location}</Text>
						<Text style={styles.badgeDay}>
							{getWeekday(selectedEvent?.startTime)}
						</Text>
					</Animated.View>
				</Pressable>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#333333",
		paddingTop: 40,
	},
	loaderContainer: {
		flex: 1,
		backgroundColor: "#333333",
		justifyContent: "center",
		alignItems: "center",
	},
	headerText: {
		marginTop: 8,

		fontSize: 40,
		fontWeight: "bold",
		color: "#ffffff",
		textAlign: "center",
		marginBottom: 16,
		fontFamily: "ProRacingSlant",
	},

	tabsWrapper: {
		height: 35,
		marginBottom: 12,
	},
	tabsScroll: {
		height: 60,
		flexGrow: 0,
	},
	tabsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 12,
		gap: 5,
	},

	tab: {
		flexDirection: "row",
		alignItems: "center",
		// borderRadius: 4,
		height: 35,
		width: 70,
		gap: 4,
		// paddingHorizontal: 12,
	},
	tabBar: {
		width: 10,
		height: 24,
		marginRight: 3,
		// borderRadius: 2,
	},
	tabLabel: {
		fontSize: 12,
		fontWeight: "bold",
		letterSpacing: 1,
		fontFamily: "ProRacingSlant",
	},

	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		color: "#cccccc",
		fontSize: 16,
	},

	listContent: {
		paddingBottom: 20,
	},
	eventBar: {
		flexDirection: "row",
		// alignItems: 'left',
		borderRadius: 0,
		marginHorizontal: 12,
		marginVertical: 6,
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	eventIndex: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#000000",
		width: 32,
		left: 10,
		top: 25,
		fontFamily: "ProRacingSlant",
	},
	eventInfo: {
		flex: 1,
		paddingLeft: 8,
	},
	eventName: {
		fontSize: 14,
		color: "#FFFFFF",
		fontFamily: "ProRacingSlant",
	},
	eventLocation: {
		fontSize: 14,
		marginTop: 2,
		color: "#FFFFFF",
		fontFamily: "ProRacingSlant",
	},
	eventTime: {
		position: "absolute",
		left: SCREEN_WIDTH * 0.05, // ~60% across the screen — tune this

		top: 28,
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
		textAlign: "left",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.6)",
	},
	modalContent: {
		width: "90%",
		backgroundColor: "#333333",
		borderRadius: 12,
		padding: 20,
	},
	modalTitle: {
		color: "#fff",
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 12,
	},
	modalText: {
		fontSize: 16,
		marginBottom: 8,
		color: "#800000",
	},
	badgeContainer: {
		position: "absolute",
		top: SCREEN_HEIGHT / 2 - (SCREEN_HEIGHT * 0.75) / 1.3,
		left: SCREEN_WIDTH / 2 - (SCREEN_WIDTH * 0.85) / 1.7,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},
	badgeTextWrapper: {
		position: "absolute",
		top: "65%",
		left: "10%",
		right: "10%",
		alignItems: "center",
	},

	badgeTitle: {
		color: "#000",
		fontSize: 18,
		fontWeight: "bold",
		fontFamily: "ProRacingSlant",
		color: "#800000",
	},

	badgeSubtitle: {
		color: "#000",
		fontSize: 14,
		marginTop: 8,
		textAlign: "center",
		color: "#800000",
	},
	badgeDay: {
		position: "absolute",
		bottom: 12,
		right: 60,
		fontSize: 18,
		color: "#800000",
		letterSpacing: 2,
	},
	Location: {
		position: "absolute",
		bottom: 12,
		right: 60,
		fontSize: 18,
		color: "#800000",
		letterSpacing: 2,
	},
	svgWrapper: {
		marginHorizontal: 0,
		marginVertical: 6,
		width: SCREEN_WIDTH - 24,
		height: 80,
		overflow: "hidden",
	},
	svgText: {
		position: "absolute",
		color: "#FFF",
		fontWeight: "bold",
	},

	svgTextBlock: {
		position: "absolute",
		left: 48,
		top: 12,
		width: "100%",
		height: "100%",
	},
	badgeLocation: {
		position: "absolute",
		bottom: 36,
		right: 60,
		fontSize: 14,
		color: "#800000",
		letterSpacing: 1,
	},
});

export default EventsScreen;
