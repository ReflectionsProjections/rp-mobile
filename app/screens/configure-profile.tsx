import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from '@/components/ui/HapticControls';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { IconColorType } from '@/api/types';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { updateAttendeeIcon } from '@/lib/slices/attendeeSlice';
import { PROFILE_AVATAR_OPTIONS } from '@/components/profile/ProfileAvatar';

const selectableIcons = new Set(PROFILE_AVATAR_OPTIONS.map(({ icon }) => icon));

const getInitialIcon = (icon?: IconColorType): IconColorType => {
  if (icon && selectableIcons.has(icon)) return icon;
  if (icon === 'BLACK') return 'BLUE';
  if (icon === 'ORANGE' || icon === 'YELLOW') return 'RED';
  return 'PURPLE';
};

export default function ConfigureProfileScreen() {
  const dispatch = useAppDispatch();
  const attendee = useAppSelector((state) => state.attendee.attendee);
  const isSaving = useAppSelector((state) => state.attendee.loading);
  const [selectedIcon, setSelectedIcon] = useState<IconColorType>(() =>
    getInitialIcon(attendee?.icon),
  );

  const handleSave = async () => {
    try {
      await dispatch(updateAttendeeIcon(selectedIcon)).unwrap();
      router.back();
    } catch (error) {
      Alert.alert(
        'Could not update avatar',
        typeof error === 'string' ? error : 'Please try again.',
      );
    }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#0F062D', '#24114C']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Back to profile"
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>CONFIGURE PROFILE</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.instructions}>Choose your profile avatar</Text>
          <View style={styles.avatarGrid}>
            {PROFILE_AVATAR_OPTIONS.map(({ icon, label, Art }) => {
              const selected = selectedIcon === icon;
              return (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setSelectedIcon(icon)}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={`${label} avatar`}
                  style={[styles.avatarOption, selected && styles.avatarOptionSelected]}
                >
                  <Art width={104} height={104} />
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveLabel}>SAVE AVATAR</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F062D',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(24, 24, 24, 0.7)',
    borderWidth: 1,
    borderColor: '#373792',
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    color: '#fff',
    fontFamily: 'Ethnocentric',
    fontSize: 15,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  instructions: {
    color: '#fff',
    fontFamily: 'ShareTechMono',
    fontSize: 18,
    marginBottom: 28,
  },
  avatarGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  avatarOption: {
    width: 122,
    height: 122,
    padding: 7,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#373792',
    backgroundColor: '#150935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionSelected: {
    borderColor: '#FF4CCC',
    shadowColor: '#FF4CCC',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  saveButton: {
    width: '100%',
    maxWidth: 300,
    height: 58,
    borderRadius: 14,
    marginTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4CCC',
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveLabel: {
    color: '#fff',
    fontFamily: 'Ethnocentric',
    fontSize: 16,
    letterSpacing: 1,
  },
});
