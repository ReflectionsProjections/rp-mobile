import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { updateAttendeeTags } from '@/lib/slices/attendeeSlice';
import { api } from '@/api/api';
import Toast from 'react-native-toast-message';

const AVAILABLE_TAGS = [
  'AI',
  'Research',
  'Art/Media',
  'Ethics',
  'Networking',
  'Company Talk',
  'HCI',
  'Career Readiness',
  'Cybersecurity',
  'Interactive Events',
  'Autonomous Vehicles',
];

const TagSelector = () => {
  const attendee = useAppSelector((state) => state.attendee.attendee);
  const themeColor = useAppSelector((state) => state.attendee.themeColor);
  const dispatch = useAppDispatch();

  const handleTagToggle = async (tag: string) => {
    const currentTags = attendee?.tags || [];
    let newTags: string[];

    if (currentTags.includes(tag)) {
      newTags = currentTags.filter((t) => t !== tag);
    } else {
      newTags = [...currentTags, tag];
    }

    try {
      await api.patch('/attendee/tags', { tags: newTags });
      await dispatch(updateAttendeeTags(newTags));

      Toast.show({
        type: 'success',
        text1: 'Tags Updated',
        text2: 'Your interests have been saved successfully!',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 50,
      });
    } catch (error: any) {
      Alert.alert('Error updating tags:', error.message);
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginTop: 10,
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: '700',
          fontFamily: 'ProRacing',
          marginBottom: 6,
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}
      >
        INTERESTS & TAGS
      </Text>
      <Text
        style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 12,
          fontFamily: 'Inter',
          marginBottom: 16,
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 1,
        }}
      >
        Select to follow your favorite drivers!
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, paddingVertical: 8 }}>
        {AVAILABLE_TAGS.map((tag) => {
          const isSelected = (attendee?.tags || []).includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              onPress={() => handleTagToggle(tag)}
              activeOpacity={0.7}
              style={{
                backgroundColor: isSelected ? themeColor : 'rgba(255, 255, 255, 0.1)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: isSelected ? themeColor : 'rgba(255, 255, 255, 0.3)',
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: isSelected ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                  fontSize: 12,
                  fontFamily: 'Inter',
                  fontWeight: isSelected ? '600' : '400',
                  textAlign: 'center',
                }}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TagSelector;
