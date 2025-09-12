import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ActivityIndicator, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { api } from '@/api/api';
import { DietaryRestrictionStats, path } from '@/api/types';
import BackgroundSvg from '@/assets/background/background_grate.svg';
import { useThemeColor } from '@/lib/theme';

const { width, height } = Dimensions.get('window');

export default function StatsScreen() {
  const [checkInCount, setCheckInCount] = useState<number>(0);
  const [priorityAttendeeCount, setPriorityAttendeeCount] = useState<number>(0);
  const [dietaryStats, setDietaryStats] = useState<DietaryRestrictionStats | null>(null);
  const [attendanceCounts, setAttendanceCounts] = useState<number[]>([]);
  const [registrationCount, setRegistrationCount] = useState<number>(0);
  const [tierCounts, setTierCounts] = useState<{ TIER1: number; TIER2: number; TIER3: number; TIER4: number } | null>(null);
  const [tagCounts, setTagCounts] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const themeColor = useThemeColor();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all stats in parallel
        const [
          checkInResponse,
          priorityResponse,
          dietaryResponse,
          attendanceResponse,
          registrationResponse,
          tierCountsResponse,
          tagCountsResponse
        ] = await Promise.all([
          api.get('/stats/check-in'),
          api.get('/stats/priority-attendee'),
          api.get('/stats/dietary-restrictions'),
          api.get(path('/stats/attendance/:n', { n: '7' })), // Get last 7 days of attendance
          api.get('/stats/registrations'),
          api.get('/stats/tier-counts'),
          api.get('/stats/tag-counts')
        ]);

        setCheckInCount(checkInResponse.data.count);
        setPriorityAttendeeCount(priorityResponse.data.count);
        setDietaryStats(dietaryResponse.data);
        setAttendanceCounts(attendanceResponse.data.attendanceCounts);
        setRegistrationCount(registrationResponse.data.count);
        setTierCounts(tierCountsResponse.data);
        setTagCounts(tagCountsResponse.data);
      } catch (err) {
        setError('Failed to fetch stats');
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#DF4F44" />
        <Text className="mt-4 text-gray-600" style={{ fontFamily: 'ProRacing' }}>Loading stats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-lg" style={{ fontFamily: 'ProRacing' }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <BackgroundSvg
        style={StyleSheet.absoluteFillObject}
        width={screenWidth}
        height={screenHeight}
        preserveAspectRatio="none"
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
        <Text className="text-3xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'ProRacing' }}>
          Event Statistics
        </Text>

        {/* Check-in Stats */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'ProRacing' }}>
            Total Check-ins
          </Text>
          <Text className="text-4xl font-bold" style={{ fontFamily: 'ProRacing', color: themeColor }}>
            {checkInCount}
          </Text>
        </View>

        {/* Priority Attendees */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'ProRacing' }}>
            Priority Attendees
          </Text>
          <Text className="text-4xl font-bold" style={{ fontFamily: 'ProRacing', color: themeColor }}>
            {priorityAttendeeCount}
          </Text>
        </View>

        {/* Total Registrations */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'ProRacing' }}>
            Total Registrations
          </Text>
          <Text className="text-4xl font-bold" style={{ fontFamily: 'ProRacing', color: themeColor }}>
            {registrationCount}
          </Text>
        </View>

        {/* Dietary Restrictions */}
        {dietaryStats && (
          <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <Text className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'ProRacing' }}>
              Dietary Restrictions
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>No restrictions:</Text>
                <Text className="font-semibold" style={{ fontFamily: 'ProRacing', color: themeColor }}>{dietaryStats.none}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>Dietary restrictions:</Text>
                <Text className="font-semibold" style={{ fontFamily: 'ProRacing', color: themeColor }}>{dietaryStats.dietaryRestrictions}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>Allergies only:</Text>
                <Text className="font-semibold" style={{ fontFamily: 'ProRacing', color: themeColor }}>{dietaryStats.allergies}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>Both:</Text>
                <Text className="font-semibold" style={{ fontFamily: 'ProRacing', color: themeColor }}>{dietaryStats.both}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Attendance */}
        {attendanceCounts.length > 0 && (
          <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <Text className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'ProRacing-Regular' }}>
              Attendance (Last 7 Days)
            </Text>
            <View className="space-y-2">
              {attendanceCounts.map((count, index) => (
                <View key={index} className="flex-row justify-between">
                  <Text className="text-gray-600" style={{ fontFamily: 'ProRacing-Regular' }}>Day {index + 1}:</Text>
                  <Text className="font-semibold" style={{ fontFamily: 'ProRacing-Regular', color: themeColor }}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tier Distribution */}
        {tierCounts && (
          <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <Text className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'ProRacing' }}>
              Tier Distribution
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>Tier 1:</Text>
                <Text className="font-semibold" style={{ fontFamily: 'ProRacing', color: themeColor }}>{tierCounts.TIER1}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>Tier 2:</Text>
                <Text className="font-semibold" style={{ fontFamily: 'ProRacing', color: themeColor }}>{tierCounts.TIER2}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>Tier 3:</Text>
                <Text className="font-semibold" style={{ fontFamily: 'ProRacing', color: themeColor }}>{tierCounts.TIER3}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'ProRacing' }}>Tier 4:</Text>
                <Text className="font-semibold" style={{ fontFamily: 'ProRacing', color: themeColor }}>{tierCounts.TIER4}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Popular Tags */}
        {tagCounts && Object.keys(tagCounts).length > 0 && (
          <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <Text className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: 'ProRacing' }}>
              Popular Tags
            </Text>
            <View className="space-y-2">
              {Object.entries(tagCounts)
                .sort(([,a], [,b]) => b - a) // Sort by count descending
                .slice(0, 8) // Show top 8 tags
                .map(([tag, count]) => (
                <View key={tag} className="flex-row justify-between">
                  <Text className="text-gray-600 capitalize" style={{ fontFamily: 'ProRacing' }}>{tag.replace('_', ' ')}:</Text>
                  <Text className="font-semibold" style={{ fontFamily: 'ProRacing', color: themeColor }}>{count}</Text>
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
