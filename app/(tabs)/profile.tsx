import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, ActivityIndicator, Text } from 'react-native';
import ProfileHeader from '@/components/profile/Header';
import ImageCarousel from '@/components/profile/ImageCarousel';
import UserInfo from '@/components/profile/UserInfo';
import ColorPicker from '@/components/profile/ColorPicker';
import { api } from '@/api/api';
import { RoleObject } from '@/api/types';

const Separator = () => <View className="h-px bg-black my-3" />;

const ProfileScreen = () => {
  const [user, setUser] = useState<RoleObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendee = async () => {
      try {
        const response = await api.get('/auth/info');
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user info');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendee();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-500 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
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
  );
};

export default ProfileScreen;
