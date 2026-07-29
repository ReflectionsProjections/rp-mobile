// components/home/FolderTabs.tsx
//
// Filing-cabinet accordion matching the mock:
//  - Closed folders show a white-bordered pill tab (+ lavender caret).
//  - The OPEN folder's pill fades/collapses away — its label is the pink
//    glowing title box at the top of its panel, so the name never renders
//    twice.
//  - First layer is transparent (screen gradient shows through) and hosts
//    the purple profile button, which stays put even while its pill hides.
//  - A charcoal base sheet runs to the bottom of the screen so there's no
//    background-colored bar; collapsed tabs rest on top of it.
//
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

const { height: SH } = Dimensions.get('window');

// ─── Palette (matched to the mock) ───────────────────────────────────────────
// First layer is transparent — the screen gradient is its background.
const LAYER_COLORS = ['transparent', '#4B44CF', '#2C1B66', '#5A3FA0'];
const PANEL_BG = '#232226';        // neutral charcoal content sheet
const CARET_LAVENDER = '#E6E0FF';  // little triangles next to the pills
const ACCENT_PINK = '#FF2FD0';     // panel title border / caret
const TITLE_BOX_BG = '#2B1152';    // fill behind the open folder's title
const PROFILE_BTN_BG = '#4A18C8';  // purple square profile button

const OVERLAP = 14;      // how much each layer's rounded top overlaps the previous
const PILL_ROW_H = 40;   // height of the pill row (collapses when open)

// Height of the base sheet at the bottom of the stack. Sized to cover the
// curved bottom nav region (CurvedBottomBar = 0.1 * height + tab pb-8 = 32px
// + small buffer) so the panel color runs to the bottom of the screen with
// no background-colored bar, and collapsed folder tabs rest on top of it.
const HOTBAR_H = SH * 0.1 + 32 + 8;

export interface FolderSection<T> {
  id: string;
  /** Shown in the closed pill AND in the open folder's pink title box */
  label: string;
  /** Optional override for the pink title box; defaults to `label` */
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
  /** Renders the purple profile-card button at the right of the first row */
  onProfilePress?: () => void;
}

// ─── One folder layer with its pill tab ──────────────────────────────────────
// `anim` is the section's open/close value (0 closed → 1 open). The pill
// fades out as the folder opens; for non-first layers the whole pill row
// also collapses so only a thin colored lip remains above the panel.
function FolderHeader({
  label,
  anim,
  isOpen,
  isFirst,
  color,
  onPress,
  onProfilePress,
}: {
  label: string;
  anim: Animated.Value;
  isOpen: boolean;
  isFirst: boolean;
  color: string;
  onPress: () => void;
  onProfilePress?: () => void;
}) {

  const pillOpacity = anim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0, 0],
  });

  const rowHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PILL_ROW_H, isFirst ? PILL_ROW_H : 0],
  });

  return (
    <View style={[hs.layer, { backgroundColor: color }, !isFirst && hs.layerRaised]}>
      <View style={hs.rowBetween}>
        <Animated.View style={{ height: rowHeight, opacity: pillOpacity, overflow: 'hidden' }}>
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            disabled={isOpen}
            style={hs.touchRow}
          >
            <View style={hs.pill}>
              <ThemedText style={hs.pillText}>{label}</ThemedText>
            </View>
            <View style={{ marginLeft: 10 }}>
              <FontAwesome name="caret-up" size={16} color={CARET_LAVENDER} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {isFirst && onProfilePress && (
          <TouchableOpacity onPress={onProfilePress} activeOpacity={0.85} style={hs.profileBtn}>
            <FontAwesome name="vcard" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const hs = StyleSheet.create({
  layer: {
    paddingTop: 10,
    paddingBottom: 10 + OVERLAP, // extra bottom padding hides under the next layer
    paddingHorizontal: 16,
  },
  layerRaised: {
    marginTop: -OVERLAP,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    // subtle lift between layers
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  touchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: PILL_ROW_H,
  },
  pill: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  pillText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'ProRacing',
    letterSpacing: 1,
  },
  profileBtn: {
    width: 44,
    height: 40,
    borderRadius: 10,
    backgroundColor: PROFILE_BTN_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function FolderPanel<T>({
  section,
  anim,
  keyExtractor,
  renderItem,
}: {
  section: FolderSection<T>;
  anim: Animated.Value;
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number, sectionId: string) => React.ReactElement;
}) {

  const marginTop = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -OVERLAP] });
  const opacity = anim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] });

  return (
    <Animated.View style={[ps.panel, { flex: anim as unknown as number, marginTop }]}>
      <Animated.View style={{ flex: 1, opacity }}>
        <View style={ps.panelHeaderRow}>
          <View style={ps.panelTitleBox}>
            <ThemedText style={ps.panelTitleText}>
              {section.panelTitle ?? section.label}
            </ThemedText>
          </View>
          <FontAwesome name="caret-down" size={22} color={ACCENT_PINK} />
        </View>

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
              paddingHorizontal: 18,
              paddingTop: 4,
              paddingBottom: OVERLAP + 20,
            }}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
}

const ps = StyleSheet.create({
  panel: {
    backgroundColor: PANEL_BG,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden', // clips content while sliding open/closed
  },
  panelHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  panelTitleBox: {
    borderWidth: 2.5,
    borderColor: ACCENT_PINK,
    borderRadius: 16,
    backgroundColor: TITLE_BOX_BG,
    paddingHorizontal: 18,
    paddingVertical: 9,
    shadowColor: ACCENT_PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 10,
    elevation: 6,
  },
  panelTitleText: {
    color: '#fff',
    fontSize: 19,
    fontFamily: 'Ethnocentric',
    letterSpacing: 1.5,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontFamily: 'magistral',
    textAlign: 'center',
  },
});

export function FolderTabs<T>({
  sections,
  openId,
  onSelect,
  keyExtractor,
  renderItem,
  onProfilePress,
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

  return (
    <View style={{ flex: 1 }}>
      {sections.map((section, i) => (
        <React.Fragment key={section.id}>
          <FolderHeader
            label={section.label}
            anim={getAnim(section.id)}
            isOpen={section.id === openId}
            isFirst={i === 0}
            color={LAYER_COLORS[i % LAYER_COLORS.length]}
            onPress={() => {
              if (section.id !== openId) onSelect(section.id);
            }}
            onProfilePress={onProfilePress}
          />
          <FolderPanel
            section={section}
            anim={getAnim(section.id)}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
        </React.Fragment>
      ))}

      <View style={baseSheet.sheet} />
    </View>
  );
}

const baseSheet = StyleSheet.create({
  sheet: {
    height: HOTBAR_H,
    marginTop: -OVERLAP,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: PANEL_BG,
  },
});