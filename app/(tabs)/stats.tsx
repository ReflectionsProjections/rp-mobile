import React from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import BackgroundSvg from '@/assets/background/background_grate.svg';
import { useThemeColor } from '@/lib/theme';
import { useAllStats } from '@/api/tanstack/stats';
import { Header } from '@/components/home/Header';

export default function StatsScreen() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const themeColor = useThemeColor();

  const {
    checkIn,
    priorityAttendee,
    dietary,
    attendance,
    registrations,
    tierCounts,
    tagCounts,
    isLoading,
    error,
  } = useAllStats();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#DF4F44" />
        <Text className="mt-4 text-gray-600" style={{ fontFamily: 'ProRacing' }}>
          Loading stats...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-lg" style={{ fontFamily: 'ProRacing' }}>
          {error instanceof Error ? error.message : 'Failed to load stats'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-gray-100"
      style={{
        paddingTop: Platform.OS === 'android' ? 15 : 0,
        top: Platform.OS === 'ios' ? -12 : 0,
      }}
    >
      <BackgroundSvg
        style={StyleSheet.absoluteFillObject}
        width={screenWidth}
        height={screenHeight}
        preserveAspectRatio="none"
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <Header title={'STATISTICS'} bigText={true} />

        <View style={{ marginTop: 16, paddingHorizontal: 16, paddingBottom: 50 }}>
          {/* Check-in Stats */}
          <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <Text
              className="text-xl font-semibold text-gray-800 mb-2"
              style={{ fontFamily: 'ProRacing' }}
            >
              Total Check-ins
            </Text>
            <Text
              className="text-4xl font-bold"
              style={{ fontFamily: 'ProRacing', color: themeColor }}
            >
              {checkIn.data || 0}
            </Text>
          </View>

          {/* Priority Attendees */}
          <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <Text
              className="text-xl font-semibold text-gray-800 mb-2"
              style={{ fontFamily: 'ProRacing' }}
            >
              Priority Attendees
            </Text>
            <Text
              className="text-4xl font-bold"
              style={{ fontFamily: 'ProRacing', color: themeColor }}
            >
              {priorityAttendee.data || 0}
            </Text>
          </View>

          {/* Total Registrations */}
          <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <Text
              className="text-xl font-semibold text-gray-800 mb-2"
              style={{ fontFamily: 'ProRacing' }}
            >
              Total Registrations
            </Text>
            <Text
              className="text-4xl font-bold"
              style={{ fontFamily: 'ProRacing', color: themeColor }}
            >
              {registrations.data || 0}
            </Text>
          </View>

          {/* Dietary Restrictions */}
          {dietary.data && (
            <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <Text
                className="text-xl font-semibold text-gray-800 mb-4"
                style={{ fontFamily: 'ProRacing' }}
              >
                Dietary Restrictions
              </Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>
                    No restrictions:
                  </Text>
                  <Text
                    className="font-semibold"
                    style={{ fontFamily: 'ProRacing', color: themeColor }}
                  >
                    {dietary.data.none}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>
                    Dietary restrictions:
                  </Text>
                  <Text
                    className="font-semibold"
                    style={{ fontFamily: 'ProRacing', color: themeColor }}
                  >
                    {dietary.data.dietaryRestrictions}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>
                    Allergies only:
                  </Text>
                  <Text
                    className="font-semibold"
                    style={{ fontFamily: 'ProRacing', color: themeColor }}
                  >
                    {dietary.data.allergies}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>
                    Both:
                  </Text>
                  <Text
                    className="font-semibold"
                    style={{ fontFamily: 'ProRacing', color: themeColor }}
                  >
                    {dietary.data.both}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Tier Distribution */}
          {tierCounts.data && (
            <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <Text
                className="text-xl font-semibold text-gray-800 mb-4"
                style={{ fontFamily: 'ProRacing' }}
              >
                Tier Distribution
              </Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>
                    Tier 1:
                  </Text>
                  <Text
                    className="font-semibold"
                    style={{ fontFamily: 'ProRacing', color: themeColor }}
                  >
                    {tierCounts.data.TIER1}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>
                    Tier 2:
                  </Text>
                  <Text
                    className="font-semibold"
                    style={{ fontFamily: 'ProRacing', color: themeColor }}
                  >
                    {tierCounts.data.TIER2}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>
                    Tier 3:
                  </Text>
                  <Text
                    className="font-semibold"
                    style={{ fontFamily: 'ProRacing', color: themeColor }}
                  >
                    {tierCounts.data.TIER3}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>
                    Tier 4:
                  </Text>
                  <Text
                    className="font-semibold"
                    style={{ fontFamily: 'ProRacing', color: themeColor }}
                  >
                    {tierCounts.data.TIER4}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Popular Tags */}
          {tagCounts.data && Object.keys(tagCounts.data).length > 0 && (
            <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <Text
                className="text-xl font-semibold text-gray-800 mb-4"
                style={{ fontFamily: 'ProRacing' }}
              >
                Popular Tags
              </Text>
              <View className="space-y-2">
                {Object.entries(tagCounts.data)
                  .sort(([, a], [, b]) => b - a) // Sort by count descending
                  .slice(0, 8) // Show top 8 tags
                  .map(([tag, count]) => (
                    <View key={tag} className="flex-row justify-between">
                      <Text
                        className="text-gray-600 capitalize"
                        style={{ fontFamily: 'ProRacing' }}
                      >
                        {tag.replace('_', ' ')}:
                      </Text>
                      <Text
                        className="font-semibold"
                        style={{ fontFamily: 'ProRacing', color: themeColor }}
                      >
                        {count}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
