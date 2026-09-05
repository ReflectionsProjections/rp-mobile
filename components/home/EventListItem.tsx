import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from '@/components/ui/HapticControls';
import { ThemedText } from '@/components/themed/ThemedText';
import { CardType } from './types';
import { GradientPill } from './GradientPill';

const SPECIAL_EVENT_ID = '8852aff5-015a-40b2-a32b-f1f738db34c8';
const CARD_BG = '#D9D9D9';
const ACCENT = '#FF4CCC';

function TagPill({ label }: { label: string }) {
  return (
    <GradientPill
      colors={['#373792', ACCENT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      borderRadius={15}
      innerBackgroundColor="#150935"
      innerStyle={styles.tagPillInner}
    >
      <ThemedText style={styles.tagText} numberOfLines={1}>
        {label.toUpperCase()}
      </ThemedText>
    </GradientPill>
  );
}

export function EventListItem({
  item,
  onPress,
  index = 0,
}: {
  item: CardType;
  onPress: (item: CardType) => void;
  index?: number;
}) {
  const tag = item.tags?.[0];
  const isSpecial = item.id === SPECIAL_EVENT_ID;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(item)} style={styles.wrapper}>
      <View style={styles.body}>
        {isSpecial && <View style={styles.specialBorder} pointerEvents="none" />}

        <ThemedText variant="body-bold" style={styles.title} numberOfLines={2}>
          {item.title}
        </ThemedText>

        <ThemedText variant="body" style={styles.meta} numberOfLines={1}>
          {item.location || 'Location'}
        </ThemedText>
        <ThemedText variant="body" style={styles.meta} numberOfLines={1}>
          {item.time || 'Time'}
        </ThemedText>

        {tag ? (
          <View style={styles.tagRow}>
            <TagPill label={tag} />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  body: {
    backgroundColor: CARD_BG,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
  },
  specialBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  title: {
    color: '#0A0A0A',
    fontSize: 18,
    fontFamily: 'Ethnocentric',
    lineHeight: 23,
    marginBottom: 12,
    paddingRight: 8,
  },
  meta: {
    color: '#2B2B2B',
    fontSize: 14,
    fontFamily: 'ShareTechMono',
    lineHeight: 24,
  },
  tagRow: {
    marginTop: 14,
    alignItems: 'flex-end',
  },
  tagPillInner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'ProRacing',
    letterSpacing: 0.6,
  },
});
