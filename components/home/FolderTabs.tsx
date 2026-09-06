import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { TouchableOpacity } from '@/components/ui/HapticControls';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed/ThemedText';
import { GradientPill } from './GradientPill';

const { height: SH } = Dimensions.get('window');

const LAYER_COLORS = ['#150935', '#26165E'];
const ACCENT = '#FF4CCC';
const GRADIENT_START = '#373792';
const CLOSED_BORDER = 'rgba(255,255,255,0.55)';

const NAV_CLEARANCE = SH * 0.15 + 24;

const LAST_TAB_CLEARANCE = SH * 0.08 + 24;

export interface FolderSection<T> {
  id: string;
  label: string;
  panelTitle?: string;
  data: T[];
  emptyMessage?: string;
}

interface FolderTabsProps<T> {
  sections: FolderSection<T>[];
  openId: string;
  onSelect: (id: string) => void;
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number, sectionId: string) => React.ReactElement;
}

function SectionHeader({
  label,
  count,
  isOpen,
  onPress,
}: {
  label: string;
  count: number;
  isOpen: boolean;
  onPress: () => void;
}) {
  const borderColors = isOpen
    ? ([GRADIENT_START, ACCENT] as const)
    : ([CLOSED_BORDER, CLOSED_BORDER] as const);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={isOpen}
      style={hs.headerRow}
    >
      <GradientPill
        colors={borderColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        borderRadius={22}
        innerBackgroundColor={isOpen ? 'rgba(0,0,0,0.3)' : 'transparent'}
        innerStyle={hs.pillInner}
      >
        <Text style={hs.pillLabel}>{label}</Text>
        {count > 0 && <Text style={hs.pillCount}>({count})</Text>}
      </GradientPill>

      <FontAwesome
        name={isOpen ? 'caret-up' : 'caret-down'}
        size={16}
        color={isOpen ? ACCENT : 'rgba(255,255,255,0.85)'}
      />
    </TouchableOpacity>
  );
}

const hs = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  pillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  pillLabel: {
    color: '#fff',
    fontSize: 12.5,
    fontFamily: 'ProRacing',
    letterSpacing: 1,
  },
  pillCount: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10.5,
    fontFamily: 'ShareTechMono',
  },
});

function FolderPanel<T>({
  section,
  anim,
  color,
  keyExtractor,
  renderItem,
}: {
  section: FolderSection<T>;
  anim: Animated.Value;
  color: string;
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number, sectionId: string) => React.ReactElement;
}) {
  const opacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] });

  return (
    <Animated.View
      style={[ps.panel, { backgroundColor: color, flex: anim as unknown as number }]}
    >
      <Animated.View style={{ flex: 1, opacity }}>
        {section.data.length === 0 ? (
          <View style={ps.emptyBox}>
            <ThemedText style={ps.emptyText}>
              {section.emptyMessage ?? 'Nothing here yet!'}
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={section.data}
            keyExtractor={keyExtractor}
            renderItem={({ item, index }) => renderItem(item, index, section.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 2,
              paddingBottom: NAV_CLEARANCE,
            }}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews
          />
        )}
      </Animated.View>
    </Animated.View>
  );
}

const ps = StyleSheet.create({
  panel: {
    overflow: 'hidden',
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13.5,
    fontFamily: 'ShareTechMono',
    textAlign: 'center',
    lineHeight: 23,
  },
});

export function FolderTabs<T>({
  sections,
  openId,
  onSelect,
  keyExtractor,
  renderItem,
}: FolderTabsProps<T>) {
  const animsRef = useRef<Record<string, Animated.Value>>({});
  const getAnim = (id: string) => {
    if (!animsRef.current[id]) {
      animsRef.current[id] = new Animated.Value(id === openId ? 1 : 0);
    }
    return animsRef.current[id];
  };

  useEffect(() => {
    const animations = sections.map((s) =>
      Animated.timing(getAnim(s.id), {
        toValue: s.id === openId ? 1 : 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    );
    Animated.parallel(animations).start();
  }, [openId, sections]);

  const lastSection = sections[sections.length - 1];
  const lastColor = LAYER_COLORS[(sections.length - 1) % LAYER_COLORS.length];
  const lastReserve = lastSection
    ? getAnim(lastSection.id).interpolate({
        inputRange: [0, 1],
        outputRange: [LAST_TAB_CLEARANCE, 0],
      })
    : 0;

  return (
    <View style={{ flex: 1 }}>
      {sections.map((section, i) => {
        const color = LAYER_COLORS[i % LAYER_COLORS.length];
        const isOpen = section.id === openId;
        return (
          <Animated.View
            key={section.id}
            style={{ flex: getAnim(section.id) as unknown as number, backgroundColor: color }}
          >
            <SectionHeader
              label={section.label}
              count={section.data.length}
              isOpen={isOpen}
              onPress={() => {
                if (!isOpen) onSelect(section.id);
              }}
            />
            <FolderPanel
              section={section}
              anim={getAnim(section.id)}
              color={color}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
            />
          </Animated.View>
        );
      })}

      <Animated.View style={{ height: lastReserve, backgroundColor: lastColor }} />
    </View>
  );
}
