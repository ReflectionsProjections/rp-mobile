// components/home/FolderTabs.tsx
//
// Filing-cabinet accordion matching the mock:
//  - Closed folders are flat, single-color bars with a white-bordered pill
//    tab (+ lavender caret) — no rounding or overlap tricks on these, so
//    there's never a second color peeking through at the seams.
//  - The OPEN folder's pill fades away — its label re-appears in a
//    pink-bordered, tag-styled title box at the top of its panel.
//  - First layer hosts the purple profile button, which stays put even while
//    its pill hides.
//  - Opening a section keeps its own color (just rounds the top corners) and
//    fills the rest of the screen so cards scroll all the way down — no
//    separate "panel" backdrop swap.
//
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed/ThemedText';
import TagButtonArt from '@/assets/home/tag_button.svg';

const { height: SH } = Dimensions.get('window');

// ─── Palette ──────────────────────────────────────────────────────────────
// Two flat, solid colors — an open section's panel keeps the SAME color it
// has when collapsed, so opening it never swaps in a different backdrop.
const LAYER_COLORS = ['#150935', '#4B44CF'];
const CARET_LAVENDER = '#E6E0FF';  // little triangles next to the closed pills
const CARET_PINK = '#FF4CCC';      // dropdown caret on the open panel's title
const PROFILE_BTN_BG = '#4A18C8';  // purple square profile button

const PILL_ROW_H = 40;   // height of the pill row (collapses when open)
const LAYER_PAD_V = 10;  // vertical padding above/below the pill row
// Full height of a closed layer. Non-first layers animate all the way down
// to 0 when open, so nothing is left showing above the panel.
const FULL_LAYER_H = LAYER_PAD_V * 2 + PILL_ROW_H;

// Clearance so the last card can scroll fully clear of the fixed nav bar
// overlay (drawn on top of everything in _layout.tsx).
const NAV_CLEARANCE = SH * 0.15 + 24;

// Hard limit on the accordion's total height: a solid filler (colored to
// match the last section) reserves this much space at the bottom so
// collapsed folder pills and the open panel stack up and stop right above
// the nav bar, instead of sliding under it or showing bare background.
const NAV_BAR_RESERVE = SH * 0.1 + 16;

export interface FolderSection<T> {
  id: string;
  /** Shown in the closed pill AND in the open folder's panel title */
  label: string;
  /** Optional override for the panel title; defaults to `label` */
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

  // Non-first layers collapse their ENTIRE box (padding included) when open, so
  // no leftover colored band is left showing above the panel below them.
  const layerHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [FULL_LAYER_H, isFirst ? FULL_LAYER_H : 0],
  });

  return (
    <Animated.View style={[hs.layer, { backgroundColor: color, height: layerHeight }]}>
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
    </Animated.View>
  );
}

const hs = StyleSheet.create({
  layer: {
    paddingTop: LAYER_PAD_V,
    paddingBottom: LAYER_PAD_V,
    paddingHorizontal: 16,
    overflow: 'hidden',
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
    height: 44,
    borderRadius: 12,
    backgroundColor: PROFILE_BTN_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Open panel's title — same tag-button art as the event tags, to emphasize
// it as the currently-selected section.
function PanelTitle({ label }: { label: string }) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View style={ps.panelTitleBox} onLayout={onLayout}>
      {size && (
        <View style={StyleSheet.absoluteFillObject}>
          <TagButtonArt width={size.width} height={size.height} preserveAspectRatio="none" />
        </View>
      )}
      <ThemedText style={ps.panelTitleText}>{label}</ThemedText>
    </View>
  );
}

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
        <View style={ps.panelHeaderRow}>
          <PanelTitle label={section.panelTitle ?? section.label} />
          <FontAwesome name="caret-down" size={22} color={CARET_PINK} />
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
              // Clear the fixed nav bar overlay drawn on top of everything in
              // _layout.tsx, so the last card can fully scroll into view.
              paddingBottom: NAV_CLEARANCE,
            }}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
}

const ps = StyleSheet.create({
  panel: {
    // backgroundColor set inline per-section (matches its own collapsed color)
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  panelTitleText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'ProRacing',
    letterSpacing: 1,
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
      {sections.map((section, i) => {
        const color = LAYER_COLORS[i % LAYER_COLORS.length];
        return (
          // This section's own solid backdrop: whatever the header/panel's
          // rounded corners or collapse animation reveal underneath is
          // always THIS color, never a mismatched color or the transparent
          // app background peeking through.
          <Animated.View key={section.id} style={{ flex: getAnim(section.id) as unknown as number, backgroundColor: color }}>
            <FolderHeader
              label={section.label}
              anim={getAnim(section.id)}
              isOpen={section.id === openId}
              isFirst={i === 0}
              color={color}
              onPress={() => {
                if (section.id !== openId) onSelect(section.id);
              }}
              onProfilePress={onProfilePress}
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

      {/* Filler reserving the nav-bar strip, colored to match whatever the
          last section's own color is — so it's a seamless continuation of
          whatever's directly above it, not a distinct colored rectangle. */}
      <View
        style={{
          height: NAV_BAR_RESERVE,
          backgroundColor: LAYER_COLORS[(sections.length - 1) % LAYER_COLORS.length],
        }}
      />
    </View>
  );
}