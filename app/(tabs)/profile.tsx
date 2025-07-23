import React, { useState } from "react";
import { useFonts } from "expo-font";
import PTS from "../../assets/images/pts.svg";
import LOGO from "../../assets/images/logo.svg";
import BACKGROUND from "../../assets/images/profile_background.svg";
import PROFILE from "../../assets/images/profile_svg.svg";
import GRADIENT from "../../assets/images/customize_gradient.svg";

import {
	SafeAreaView,
	ScrollView,
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = width * 0.75;
const SIDE_PADDING = (width - 40 - IMAGE_SIZE) / 2;

const images = [
	require("../../assets/images/merc.jpeg"),
	require("../../assets/images/merc.jpeg"),
];

const ProfileScreen = () => {
	const [activeIndex, setActiveIndex] = useState(0);

	const [loaded] = useFonts({
		ProRacing: require("../../assets/fonts/ProRacing.otf"),
		ProRacingSlant: require("../../assets/fonts/ProRacingSlant.otf"),
	});

	const onMomentumScrollEnd = (e: any) => {
		const newIndex = Math.round(e.nativeEvent.contentOffset.x / IMAGE_SIZE);
		setActiveIndex(newIndex);
	};

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.absoluteBackground}>
				<BACKGROUND
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMid slice"
				/>
			</View>
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.tier}></Text>
					<View style={styles.pointsContainer}>
						<Text style={styles.pointsValue}>99</Text>
						<PTS style={styles.pointsImage} />
					</View>
				</View>

				<View style={styles.separator} />

				<View style={styles.imageContainer}>
					<PROFILE width={350} height={350} />
				</View>

				<View style={styles.separator} />
				<View style={styles.nameCard}>
					<View style={styles.nameGroup}>
						<View style={styles.nameBar} />
						<View style={styles.nameText}>
							<Text style={styles.nameFirst}>DEV</Text>
							<Text style={styles.nameLast}>PATEL</Text>
						</View>
					</View>
					<LOGO style={styles.profileIcon} />
				</View>

				<View style={styles.separator} />

				<View style={styles.customizeContainer}>
					<GRADIENT style={styles.customizeBackground} />
					<Text style={styles.customize}>CUSTOMIZE</Text>
					<View style={styles.colorOptions}>
						{[
							"#56BF59",
							"#1F0C4C",
							"#E6930D",
							"#322BB7",
							"#FFD93F",
							"#D42422",
						].map((c) => (
							<TouchableOpacity
								key={c}
								style={[styles.colorCircle, { backgroundColor: c }]}
							/>
						))}
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: "#a3a3a3",
	},
	content: {
		padding: 20,
		paddingBottom: 100,
	},
	carouselImage: {
		width: IMAGE_SIZE,
		height: IMAGE_SIZE,
		borderRadius: 8,
		backgroundColor: "#eee",
		marginHorizontal: 0,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	tier: {
		fontFamily: "ProRacingSlant",
		fontSize: 40,
		fontWeight: "bold",
		color: "#fff",
	},
	pointsContainer: {
		flexDirection: "column",
		alignItems: "flex-end",
		paddingRight: 10,
	},
	pointsValue: {
		fontSize: 30,
		fontWeight: "bold",
		fontFamily: "ProRacing",
		color: "#fff",
	},
	pointsImage: {
		width: 85,
		height: 40,
		marginTop: 0,
		resizeMode: "contain",
	},

	separator: {
		height: 2,
		backgroundColor: "#fff",
		marginVertical: 12,
	},

	carouselContainer: {
		alignItems: "center",
		marginVertical: 15,
	},
	pagedScroll: {
		width: IMAGE_SIZE,
		alignSelf: "center",
		overflow: "hidden",
	},
	imagePlaceholder: {
		width: width - 90,
		height: width - 90,
		borderRadius: 8,
		backgroundColor: "#eee",
		marginRight: 5,
	},
	pagination: {
		flexDirection: "row",
		marginTop: 8,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#888",
		marginHorizontal: 4,
	},
	activeDot: {
		backgroundColor: "#555",
	},

	nameSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	nameGroup: {
		flexDirection: "row",
		alignItems: "center",
	},
	nameBar: {
		width: 8,
		backgroundColor: "#D42422",
		height: 55,
		marginRight: 10,
	},
	nameText: {
		flexShrink: 1,
		minHeight: 30,
	},
	nameFirst: {
		fontFamily: "ProRacing",
		fontSize: 21,
		color: "#D42422",
	},
	nameLast: {
		fontFamily: "ProRacing",
		fontSize: 24,
		fontWeight: "bold",
		color: "#D42422",
		paddingRight: 10,
	},
	profileIcon: {
		width: 40,
		height: 40,
		resizeMode: "contain",
		marginBottom: 2,
		marginRight: SIDE_PADDING,
	},

	foodWave: {
		fontFamily: "Inter",
		fontSize: 20,
		fontStyle: "italic",
		marginVertical: 20,
		marginTop: -5,
	},

	customize: {
		fontFamily: "ProRacing",
		fontSize: 22,
		marginTop: 2,
		marginBottom: 8,
	},

	absoluteBackground: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: -1,
	},
	colorOptions: {
		flexDirection: "row",
		paddingVertical: 8,
		justifyContent: "center",
	},
	colorCircle: {
		width: 30,
		height: 30,
		borderRadius: 15,
		marginRight: 12,
	},

	imageContainer: {
		alignItems: "center",
		marginVertical: -10,
	},
	singleImage: {
		width: IMAGE_SIZE,
		height: IMAGE_SIZE,
		backgroundColor: "#eee",
	},
	nameCard: {
		backgroundColor: "#D9D9D9",
		paddingVertical: 12,
		paddingHorizontal: 16,
		marginVertical: -1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	customizeContainer: {
		position: "relative",
		alignItems: "center",
		marginVertical: 10,
		justifyContent: "center",
	},
	customizeBackground: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 140,
		width: "100%",
		resizeMode: "cover",
		zIndex: -1,
	},
});

export default ProfileScreen;
