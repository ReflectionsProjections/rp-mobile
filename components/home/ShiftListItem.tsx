import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed/ThemedText';
import { useThemeColor } from '@/lib/theme';
import { ShiftCard } from '@/api/types';

const CARD_BG = '#DCDCDC';
const NOTCH_H = 26;
const NOTCH_W = '62%';

export function ShiftListItem({
  item,
  onPress,
  notch = false,
}: {
  item: ShiftCard;
  onPress: (item: ShiftCard) => void;
  notch?: boolean;
}) {
  const themeColor = useThemeColor();

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(item)} style={styles.wrapper}>
      {notch && <View style={styles.notchTab} />}
      <View style={[styles.body, notch && { borderTopLeftRadius: 0 }]}>
        <View style={styles.headerRow}>
          <ThemedText variant="body-bold" style={styles.title} numberOfLines={2}>
            {item.title}
          </ThemedText>
          <FontAwesome
            name={item.acknowledged ? 'check-circle' : 'exclamation-circle'}
            size={18}
            color={item.acknowledged ? themeColor : '#ff3b30'}
          />
        </View>
        <ThemedText variant="body" style={styles.meta} numberOfLines={1}>
          {item.location || 'Location'}
        </ThemedText>
        <ThemedText variant="body" style={styles.meta} numberOfLines={1}>
          {item.time || 'Time'}
        </ThemedText>
        <View style={[styles.rolePill, { backgroundColor: themeColor }]}>
          <FontAwesome name="flag-checkered" size={11} color="#fff" style={{ marginRight: 4 }} />
          <ThemedText style={styles.roleText}>{item.role}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  notchTab: {
    width: NOTCH_W,
    height: NOTCH_H,
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  body: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    minHeight: 88,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'ProRacing',
    letterSpacing: 0.5,
    flex: 1,
    paddingRight: 10,
  },
  meta: {
    color: '#333',
    fontSize: 13,
    fontFamily: 'magistral',
    marginBottom: 2,
  },
  rolePill: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  roleText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'ProRacing',
    letterSpacing: 0.5,
  },
});