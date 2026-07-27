import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { CardType } from './types';

const SPECIAL_EVENT_ID = '8852aff5-015a-40b2-a32b-f1f738db34c8';

const CARD_BG = '#DEDEDE';       
const TAG_BG = '#2A0E63';        
const TAG_BORDER = '#FF3BD4';   
const RADIUS = 22;               

function TagPill({ label }: { label: string }) {
  return (
    <View style={styles.tagPill}>
      <ThemedText style={styles.tagText} numberOfLines={1}>
        {label.toUpperCase()}
      </ThemedText>
    </View>
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
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(item)}
      style={[styles.wrapper, { zIndex: 999 - index }]}
    >
      <View style={[styles.body, isSpecial && styles.bodySpecial]}>
        <ThemedText variant="body-bold" style={styles.title} numberOfLines={2}>
          {item.title}
        </ThemedText>

        <ThemedText variant="body" style={styles.meta} numberOfLines={1}>
          {item.location || 'Location'}
        </ThemedText>
        <ThemedText variant="body" style={styles.meta} numberOfLines={1}>
          {item.time || 'Time'}
        </ThemedText>
      </View>

\      {tag ? <TagPill label={tag} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    overflow: 'visible',
  },
  body: {
    backgroundColor: CARD_BG,
    borderRadius: RADIUS,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 26,
    minHeight: 120,
  },
  bodySpecial: {
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
    fontSize: 17,
    fontFamily: 'ProRacing',
    letterSpacing: 0.5,
    lineHeight: 24,
    marginBottom: 14,
    paddingRight: 8,
  },
  meta: {
    color: '#2B2B2B',
    fontSize: 14,
    fontFamily: 'ShareTechMono',
    lineHeight: 22,
  },
  tagPill: {
    position: 'absolute',
    right: -6,     
    bottom: -12,   
    backgroundColor: TAG_BG,
    borderWidth: 2.5,
    borderColor: TAG_BORDER,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: TAG_BORDER,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 10,
  },
  tagText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'ProRacing',
    letterSpacing: 1,
  },
});