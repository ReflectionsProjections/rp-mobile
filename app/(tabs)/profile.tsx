import React, { useState } from "react";
import { useFonts } from "expo-font";
import PTS from "../../assets/images/pts.svg";
import LOGO from "../../assets/images/logo.svg";
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
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.tier}>TIER 1</Text>
					<View style={styles.pointsContainer}>
						<Text style={styles.pointsValue}>99</Text>
						<PTS style={styles.pointsImage} />
					</View>
				</View>

				<View style={styles.separator} />

				<View style={styles.carouselContainer}>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={styles.pagedScroll}
						snapToInterval={IMAGE_SIZE}
						snapToAlignment="start"
						decelerationRate="fast"
						onMomentumScrollEnd={onMomentumScrollEnd}
					>
						{images.map((src, i) => (
							<Image key={i} source={src} style={styles.carouselImage} />
						))}
					</ScrollView>
					<View style={styles.pagination}>
						{images.map((_, i) => (
							<View
								key={i}
								style={[styles.dot, i === activeIndex && styles.activeDot]}
							/>
						))}
					</View>
				</View>

				<View style={styles.separator} />

				<View style={styles.nameSection}>
					<View style={styles.nameGroup}>
						<View style={styles.nameBar} />
						<View style={styles.nameText}>
							<Text style={styles.nameFirst}>Dev</Text>
							<Text style={styles.nameLast}>PATEL</Text>
						</View>
					</View>
					<LOGO style={styles.profileIcon} />
				</View>

				<View style={styles.separator} />

				<Text style={styles.foodWave}>
					Food Wave: <Text>D1 Gooner</Text>
				</Text>

				<Text style={styles.customize}>CUSTOMIZE</Text>

				<View style={styles.colorOptionsShadow}>
					<View style={styles.colorOptions}>
						{[
							"#75D46E",
							"#2E1C47",
							"#D69C2B",
							"#4450D6",
							"#F7D62A",
							"#FFFFFF",
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
	},
	pointsContainer: {
		flexDirection: "column",
		alignItems: "flex-end",
	},
	pointsValue: {
		fontSize: 30,
		fontWeight: "bold",
		fontFamily: "ProRacing",
	},
	pointsImage: {
		width: 85,
		height: 40,
		marginTop: 0,
		resizeMode: "contain",
	},

	separator: {
		height: 2,
		backgroundColor: "#000",
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
		backgroundColor: "#000",
		height: 55,
		marginRight: 10,
	},
	nameText: {
		flexShrink: 1,
	},
	nameFirst: {
		fontFamily: "Inter",
		fontSize: 20,
	},
	nameLast: {
		fontFamily: "ProRacing",
		fontSize: 24,
		fontWeight: "bold",
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
		fontFamily: "Inter",
		fontSize: 22,
		marginTop: 2,
		marginBottom: 8,
	},

	colorOptionsShadow: {
		alignSelf: "stretch",

		//ios
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.5,
		shadowRadius: 5,

		//andriod
		elevation: 2,
	},

	colorOptions: {
		flexDirection: "row",
		paddingVertical: 8,
	},
	colorCircle: {
		width: 30,
		height: 30,
		borderRadius: 15,
		marginRight: 12,
	},
});

export default ProfileScreen;
