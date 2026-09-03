import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LOGO from '@/assets/images/logo.svg';
import { GradientPill } from './GradientPill';
import { ProfileButton } from '@/components/misc/ProfileButton';

const ACCENT = '#FF4CCC';

export function HomeTopBar({
  day = 'DAY 2',
  onProfilePress,
}: {
  day?: string;
  onProfilePress?: () => void;
}) {
  return (
    <View style={styles.row}>
      <LOGO width={32} height={32} />
      <View style={styles.right}>
        <GradientPill
          colors={['#373792', ACCENT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          borderRadius={14}
          innerBackgroundColor="#150935"
          innerStyle={styles.dayBadgeInner}
        >
          <View style={styles.dot} />
          <Text style={styles.dayLabel}>{day}</Text>
        </GradientPill>

        <ProfileButton onPress={onProfilePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: ACCENT,
  },
  dayLabel: {
    color: '#fff',
    fontFamily: 'ShareTechMono',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
