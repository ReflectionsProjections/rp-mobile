import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LOGO from '@/assets/images/logo.svg';
import { GradientPill } from './GradientPill';
import { ProfileButton } from '@/components/misc/ProfileButton';

const ACCENT = '#FF4CCC';
const CONFERENCE_YEAR = 2026;
const CONFERENCE_MONTH = 9;
const CENTRAL_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Chicago',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

const getConferenceDayLabel = (date = new Date()) => {
  const dateParts = Object.fromEntries(
    CENTRAL_DATE_FORMATTER.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  const year = Number(dateParts.year);
  const month = Number(dateParts.month);
  const dateOfMonth = Number(dateParts.day);

  if (year !== CONFERENCE_YEAR || month !== CONFERENCE_MONTH) {
    return '-';
  }

  const dayNumber = dateOfMonth - 15;
  return dayNumber >= 1 && dayNumber <= 4 ? `DAY ${dayNumber}` : '-';
};

export function HomeTopBar({
  day = getConferenceDayLabel(),
  onProfilePress,
}: {
  day?: string;
  onProfilePress?: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.headerAction}>
        <LOGO width={32} height={32} />
      </View>
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
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
