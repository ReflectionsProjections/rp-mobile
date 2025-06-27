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

const dayTabs = [
	{ label: "MON", dayNumber: 1, barColor: "#4caf50" },
	{ label: "TUE", dayNumber: 2, barColor: "#ff9800" },
	{ label: "WED", dayNumber: 3, barColor: "#ffffff" },
	{ label: "THU", dayNumber: 4, barColor: "#ffeb3b" },
	{ label: "FRI", dayNumber: 5, barColor: "#3f51b5" },
];
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

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.headerText}>Events</Text>

			<View style={styles.tabsWrapper}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.tabsContainer}
					style={styles.tabsScroll}
				>
					{dayTabs.map((tab) => {
						const isActive = tab.dayNumber === selectedDay;
						return (
							<TouchableOpacity
								key={tab.label}
								onPress={() => setSelectedDay(tab.dayNumber)}
								style={[
									styles.tab,
									{ backgroundColor: isActive ? "#ffffff" : "#000000" },
								]}
							>
								<View
									style={[styles.tabBar, { backgroundColor: tab.barColor }]}
								/>
								<Text
									style={[
										styles.tabLabel,
										{ color: isActive ? "#000000" : "#ffffff" },
									]}
								>
									{tab.label}
								</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</View>

			{filteredEvents.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>No events for this day.</Text>
				</View>
			) : (
				<FlatList
					data={filteredEvents}
					keyExtractor={(item) => item.eventId}
					contentContainerStyle={styles.listContent}
					renderItem={({ item, index }) => {
						const bgColor = typeColors[item.eventType] || typeColors.DEFAULT;

						let timeString = "—";
						if (item.startTime && item.endTime) {
							const start = new Date(item.startTime);
							const end = new Date(item.endTime);
							const pad = (n) => String(n).padStart(2, "0");
							const hh1 = pad(start.getHours());
							const mm1 = pad(start.getMinutes());
							const hh2 = pad(end.getHours());
							const mm2 = pad(end.getMinutes());
							timeString = `${hh1}:${mm1}–${hh2}:${mm2}`;
						}

						return (
							<TouchableOpacity onPress={() => setSelectedEvent(item)}>
								<View style={[styles.eventBar, { backgroundColor: bgColor }]}>
									<Text style={styles.eventIndex}>{index + 1}.</Text>

									<View style={styles.eventInfo}>
										<Text style={styles.eventName}>
											{item.name || "No Name"}
										</Text>
										<Text style={styles.eventLocation}>
											{item.location || "TBD"}
										</Text>
									</View>

									<Text style={styles.eventTime}>{timeString}</Text>
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
							<Text style={styles.badgeSubtitle}>
								{new Date(selectedEvent?.startTime).toLocaleTimeString()}
							</Text>
						</View>
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
		fontSize: 32,
		fontWeight: "bold",
		color: "#ffffff",
		textAlign: "center",
		marginBottom: 16,
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
		alignItems: "center",
		paddingHorizontal: 12,
		gap: 10,
	},
	tab: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 4,
		height: 48,
		paddingHorizontal: 12,
	},
	tabBar: {
		width: 6,
		height: 24,
		marginRight: 8,
		borderRadius: 2,
	},
	tabLabel: {
		fontSize: 16,
		fontWeight: "bold",
		letterSpacing: 1,
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
	},
	eventInfo: {
		flex: 1,
		paddingLeft: 8,
	},
	eventName: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#000000",
	},
	eventLocation: {
		fontSize: 14,
		color: "#000000",
		marginTop: 2,
	},
	eventTime: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#000000",
		marginLeft: 12,
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
		color: "#ccc",
		fontSize: 16,
		marginBottom: 8,
	},
	badgeContainer: {
		position: "absolute",
		top: SCREEN_HEIGHT / 2 - (SCREEN_HEIGHT * 0.75) / 1.4,
		left: SCREEN_WIDTH / 2 - (SCREEN_WIDTH * 0.85) / 1.75,
		width: SCREEN_WIDTH * 0.95,
		height: SCREEN_HEIGHT * 0.85,
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
	},

	badgeSubtitle: {
		color: "#ccc",
		fontSize: 16,
		marginTop: 8,
		textAlign: "center",
	},
});

export default EventsScreen;
