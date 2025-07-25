import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, ActivityIndicator, Text, Dimensions } from 'react-native';
import ProfileHeader from '@/components/profile/Header';
import ImageCarousel from '@/components/profile/ImageCarousel';
import UserInfo from '@/components/profile/UserInfo';
import ColorPicker from '@/components/profile/ColorPicker';
import { api } from '@/api/api';
import { RoleObject } from '@/api/types';

import Background from '@/assets/images/profile_background.svg';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');
const Separator = () => <View className="h-0.5 bg-white mb-2" />;

const LSeparator = ({ size = width * 0.85, thickness = 2, color = '#fff', zIndex = 1 }) => (
	<View
	  style={{
		position: 'absolute',
		top: 10,
		left: 0,
		right: 0,
		paddingHorizontal: 20,
		flexDirection: 'row',
		height: size,
		justifyContent: 'flex-end',
		zIndex: zIndex,
		pointerEvents: 'none',
	  }}
	>
	  <View
		style={{
		  width: size,
		  height: thickness,
		  backgroundColor: color,
		  borderRadius: thickness / 2,
		  left: 1
		}}
	  />
	  <View
		style={{
		  width: thickness,
		  height: size,
		  backgroundColor: color,
		  borderRadius: thickness / 2,
		}}
	  />
	</View>
);
  

const ProfileScreen = () => {
  const [user, setUser] = useState<RoleObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);	
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const fetchAttendee = async () => {
      const start = Date.now();
      try {
        const response = await api.get('/auth/info');
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user info');
      } finally {
        const elapsed = Date.now() - start;
        const remaining = 500 - elapsed;
        timeoutId = setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
      }
    };
    fetchAttendee();
    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
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

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-500 justify-center items-center">
        <Text className="text-xl text-white text-center px-6">
          Make sure to register and login with Google!
        </Text>
      </SafeAreaView>
    );
  }

  return (
	<View className="flex-1">
		<Background width={width} height={height} style={{ zIndex: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
		<SafeAreaView className="flex-1">
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 100 }}
		>
			<View className="p-5" style={{ position: 'relative' }}>
			<LSeparator zIndex={-1} />
			<ProfileHeader />
			<ImageCarousel />
			<Separator />
			<UserInfo
				name={{
				first: user?.displayName?.split(' ')[0] || '',
				last: user?.displayName?.split(' ').slice(1).join(' ') || '',
				}}
				roles={user?.roles || []}
			/>
			<ColorPicker />
			</View>
		</ScrollView>
		</SafeAreaView>
	</View>
  );
};

export default ProfileScreen;
