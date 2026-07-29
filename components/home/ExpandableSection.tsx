import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed/ThemedText';
import { useThemeColor } from '@/lib/theme';

const { height: SCREEN_H } = Dimensions.get('window');

export const PANEL_MAX_HEIGHT = SCREEN_H < 700 ? SCREEN_H * 0.4 : SCREEN_H * 0.46;

function TabHeader({
  label,
  isOpen,
  onPress,
}: {
  label: string;
  isOpen: boolean;
  onPress: () => void;
}) {
  const themeColor = useThemeColor();
  const rotate = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotate, {
      toValue: isOpen ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        headerStyles.pill,
        isOpen && { backgroundColor: themeColor, borderColor: themeColor },
      ]}
    >
      <ThemedText style={headerStyles.label}>{label}</ThemedText>
      <Animated.View style={{ transform: [{ rotate: spin }], marginLeft: 8 }}>
        <FontAwesome name="chevron-down" size={13} color="#fff" />
      </Animated.View>
    </TouchableOpacity>
  );
}

const headerStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'ProRacing',
    letterSpacing: 1,
  },
});

interface ExpandableSectionProps<T> {
  label: string;
  panelTitle?: string;
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactElement;
  isOpen: boolean;
  onToggle: () => void;
  emptyMessage?: string;
}

export function ExpandableSection<T>({
  label,
  panelTitle,
  data,
  keyExtractor,
  renderItem,
  isOpen,
  onToggle,
  emptyMessage = 'Nothing here yet!',
}: ExpandableSectionProps<T>) {
  const anim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isOpen ? 1 : 0,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      // height can't use the native driver
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const height = anim.interpolate({ inputRange: [0, 1], outputRange: [0, PANEL_MAX_HEIGHT] });
  const opacity = anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0, 1] });

  return (
    <View style={styles.wrapper}>
      <TabHeader label={label} isOpen={isOpen} onPress={onToggle} />

      <Animated.View style={[styles.panel, { height, opacity }]}>
        <View style={styles.panelHeader}>
          <ThemedText style={styles.panelTitle}>{panelTitle ?? label}</ThemedText>
          <FontAwesome name="caret-down" size={22} color="#FF2FD0" />
        </View>

        {data.length === 0 ? (
          <View style={styles.emptyBox}>
            <ThemedText style={styles.emptyText}>{emptyMessage}</ThemedText>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => renderItem(item)}
            showsVerticalScrollIndicator
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 }}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  panel: {
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#0B0714',
    borderWidth: 1.5,
    borderColor: '#C02EFF',
    overflow: 'hidden',
    shadowColor: '#A020F0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  panelTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'ProRacing',
    letterSpacing: 1,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontFamily: 'magistral',
    textAlign: 'center',
  },
});