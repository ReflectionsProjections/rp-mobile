import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import ProfileHeader from "@/components/profile/Header";
import ImageCarousel from "@/components/profile/ImageCarousel";
import UserInfo from "@/components/profile/UserInfo";
import ColorPicker from "@/components/profile/ColorPicker";

const Separator = () => <View className="h-px bg-black my-3" />;

const ProfileScreen = () => {
	return (
		<SafeAreaView className="flex-1 bg-gray-500">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<View className="p-5">
					<ProfileHeader />
					<Separator />
					<ImageCarousel />
					<Separator />
					<UserInfo name={{ first: "Dev", last: "PATEL" }} foodWave="D1 Gooner" />
					<ColorPicker />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProfileScreen;
