import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector, RootState } from '@/lib/store';
import { fetchDailyLeaderboard, fetchGlobalLeaderboard } from '@/lib/slices/leaderboardSlice';
import { triggerIfEnabled } from '@/lib/haptics';

// ─── Crown images (put the uploaded PNGs here) ────────────────────────────────
const CROWN_GOLD   = require('@/assets/images/leaderboard/crown_gold.png');
const CROWN_SILVER = require('@/assets/images/leaderboard/crown_silver.png');
const CROWN_BRONZE = require('@/assets/images/leaderboard/crown_bronze.png');
// Blue gradient circle placeholder for podium slots
const PLACEHOLDER  = require('@/assets/images/leaderboard/placeholder.png');

const { width: SW, height: SH } = Dimensions.get('window');

// CurvedBottomBar height = 0.1 * height, tab layout adds pb-8 (32px)
const HOTBAR_H = SH * 0.1 + 32 + 10;

// ─── Design tokens (matched directly to the mockup) ───────────────────────────
const GRAD_TOP       = '#0F062D';   // Figma gradient stop 0%
const GRAD_BOT       = '#24114C';   // Figma gradient stop 100%
const PANEL_BG       = 'rgba(15, 6, 45, 0.75)';   // slightly darker panel
const PANEL_BORDER   = '#C02EFF';   // neon purple panel ring
const PANEL_GLOW     = '#A020F0';
const ROW_BG         = 'rgba(20, 8, 50, 0.85)';   // normal row
const ROW_ME_BORDER  = '#FF18B4';   // hot-pink current-user highlight (podium ring only)
const RANK_PILL_BORDER = '#FF18B4';
const TITLE_GLOW     = '#FF3CF0';
const TEXT_W         = '#FFFFFF';
const TEXT_D         = 'rgba(255,255,255,0.50)';

// Cycling avatar background colours
const AV = ['#4455C8','#8844C0','#1E8878','#C04040','#B87020','#2E78BC','#48905A','#B03575'];
function avColor(uid: string, icon?: string) {
  if (icon?.startsWith('#')) return icon;
  let h = 0;
  for (let i = 0; i < uid.length; i++) h = uid.charCodeAt(i) + ((h << 5) - h);
  return AV[Math.abs(h) % AV.length];
}

const ROW_H = 58; // fixed row height for getItemLayout
const ROW_MARGIN_V = 2; // matches s.row's marginVertical below
const ROW_STRIDE = ROW_H + ROW_MARGIN_V * 2; // total vertical space each row occupies

// ─── Types ────────────────────────────────────────────────────────────────────
interface Entry {
  rank: number;
  userId: string;
  displayName: string;
  points: number;
  icon?: string;
  delta?: number;
}

// ─── Initials helper ──────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

// ─── Delta pill ───────────────────────────────────────────────────────────────
function DeltaBadge({ delta }: { delta?: number }) {
  if (delta == null) return null;
  const up   = delta > 0;
  const zero = delta === 0;
  const col  = zero ? TEXT_D : up ? '#34E07A' : '#FF4C4C';
  const sym  = zero ? '–' : up ? '▲' : '▼';
  return (
    <View style={[dt.pill, { borderColor: col }]}>
      <Text style={[dt.txt, { color: col }]}>{sym}{zero ? '' : Math.abs(delta)}</Text>
    </View>
  );
}
const dt = StyleSheet.create({
  pill: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 4, paddingVertical: 1, marginLeft: 4 },
  txt:  { fontFamily: 'ShareTechMono', fontSize: 9, fontWeight: '700' },
});

// ─── Circle avatar (initials) ─────────────────────────────────────────────────
function Avatar({ name, uid, icon, size = 36 }: { name: string; uid: string; icon?: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: avColor(uid, icon), alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: size * 0.33, fontFamily: 'ShareTechMono', fontWeight: '700' }}>
        {initials(name)}
      </Text>
    </View>
  );
}

// ─── Single leaderboard row ───────────────────────────────────────────────────
function LeaderboardRow({ item, isMe }: { item: Entry; isMe: boolean }) {
  return (
    <View style={[s.row, isMe && s.rowMe]}>
      <Text style={s.rowRank}>{item.rank}</Text>
      <Avatar name={item.displayName} uid={item.userId} icon={item.icon} size={36} />
      <Text style={s.rowName} numberOfLines={1}>{item.displayName}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={s.rowPts}>{item.points} pts</Text>
        <DeltaBadge delta={item.delta} />
      </View>
    </View>
  );
}

// ─── Podium card (rank 1, 2, 3) ───────────────────────────────────────────────
function PodiumCard({ entry, rank, isMe }: { entry?: Entry; rank: 1 | 2 | 3; isMe: boolean }) {
  if (!entry) return <View style={{ flex: 1 }} />;

  const isFirst  = rank === 1;
  const crown    = rank === 1 ? CROWN_GOLD : rank === 2 ? CROWN_SILVER : CROWN_BRONZE;
  const crownW   = isFirst ? 34 : 26;
  const circSz   = isFirst ? 80 : 66;
  const ringColor = isMe ? ROW_ME_BORDER : rank === 1 ? '#F5C540' : rank === 2 ? '#A8B4CC' : '#D0804A';

  return (
    <View style={[s.podCard, isFirst && s.podCardFirst]}>
      {/* Crown PNG */}
      <Image source={crown} style={{ width: crownW, height: crownW * 0.78, resizeMode: 'contain', marginBottom: 5 }} />

      {/* Glowing avatar ring */}
      <View style={[
        s.podRing,
        {
          width: circSz + 8, height: circSz + 8, borderRadius: (circSz + 8) / 2,
          borderColor: ringColor,
        },
        isFirst && { shadowColor: ringColor, shadowOpacity: 0.75, shadowRadius: 14 },
        isMe    && { shadowColor: ROW_ME_BORDER, shadowOpacity: 0.9, shadowRadius: 16 },
      ]}>
        {/* Placeholder gradient circle */}
        <Image source={PLACEHOLDER} style={{ width: circSz, height: circSz, borderRadius: circSz / 2 }} />
        {/* Initials overlay */}
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: '#fff', fontSize: circSz * 0.26, fontFamily: 'ShareTechMono', fontWeight: '700' }}>
            {initials(entry.displayName)}
          </Text>
        </View>
      </View>

      {/* Username only */}
      <Text style={s.podName} numberOfLines={1}>{entry.displayName}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LeaderboardScreen() {
  const dispatch  = useAppDispatch();
  const listRef   = useRef<FlatList<Entry>>(null);
  const hapticsOn = useAppSelector((st: RootState) => st.settings?.hapticsEnabled ?? true);
  const attendee  = useAppSelector((st: RootState) => st.attendee.attendee);
  const daily     = useAppSelector((st: RootState) => st.leaderboard.daily);
  const global    = useAppSelector((st: RootState) => st.leaderboard.global);

  const [mode, setMode] = useState<'global' | 'daily'>('global');

  // Fetch whichever board is active, only if it isn't already loaded
  useEffect(() => {
    if (mode === 'daily') {
      const d = new Date();
      const day = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (!daily.day || daily.day !== day) dispatch(fetchDailyLeaderboard({ day }));
    } else {
      if (global.leaderboard.length === 0) dispatch(fetchGlobalLeaderboard({}));
    }
  }, [mode]);

  const handleModeChange = useCallback(async (next: 'global' | 'daily') => {
    if (next === mode) return;
    await triggerIfEnabled(hapticsOn, 'light');
    setMode(next);
  }, [mode, hapticsOn]);

  // All entries — list starts from rank 1
  const raw: Entry[] = ((mode === 'global' ? global.leaderboard : daily.leaderboard) ?? []).map((p: any) => ({
    rank: p.rank, userId: p.userId, displayName: p.displayName,
    points: p.points, icon: p.icon, delta: p.delta,
  }));

  const top3     = raw.slice(0, 3);
  const meId     = attendee?.userId ?? '';
  const myRank   = raw.find(e => e.userId === meId)?.rank ?? 0;

  // Podium order: 2nd · 1st · 3rd
  const podEntries: (Entry | undefined)[] = [top3[1], top3[0], top3[2]];
  const podRanks:   (1|2|3)[]            = [2, 1, 3];

  // "Go to My Ranking" scrolls the full list to the user's row
  const handleGoToMe = useCallback(async () => {
    await triggerIfEnabled(hapticsOn, 'medium');
    const idx = raw.findIndex(e => e.userId === meId);
    if (idx >= 0) {
      listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.4 });
    }
  }, [raw, meId, hapticsOn]);

  const renderRow = useCallback(
    ({ item }: { item: Entry }) => <LeaderboardRow item={item} isMe={item.userId === meId} />,
    [meId],
  );
  const keyEx = useCallback((item: Entry) => item.userId, []);

  const empty    = raw.length === 0;
  const emptyMsg = mode === 'daily'
    ? 'No leaderboard for today —\ncheck back tomorrow!'
    : 'No leaderboard data yet —\ncheck back soon!';

  // Panel height — fixed so it doesn't consume the whole screen
  const PANEL_HEIGHT = SH * 0.44;

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[GRAD_TOP, GRAD_BOT]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={s.safe}>

        {/* TITLE */}
        <Text style={s.title}>STANDINGS</Text>

        {/* GLOBAL / DAILY TOGGLE */}
        <View style={s.toggleRow}>
          <TouchableOpacity
            style={[s.toggleBtn, mode === 'global' && s.toggleBtnActive]}
            onPress={() => handleModeChange('global')}
            activeOpacity={0.8}
          >
            <Text style={[s.toggleTxt, mode === 'global' && s.toggleTxtActive]}>GLOBAL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.toggleBtn, mode === 'daily' && s.toggleBtnActive]}
            onPress={() => handleModeChange('daily')}
            activeOpacity={0.8}
          >
            <Text style={[s.toggleTxt, mode === 'daily' && s.toggleTxtActive]}>DAILY</Text>
          </TouchableOpacity>
        </View>

        {/* PODIUM */}
        <View style={s.podium}>
          {podEntries.map((e, i) => (
            <PodiumCard key={e?.userId ?? `p${i}`} entry={e} rank={podRanks[i]} isMe={e?.userId === meId} />
          ))}
        </View>

        {/* LIST PANEL — narrower, fixed height, scrolls internally */}
        <View style={[s.panel, { height: PANEL_HEIGHT }]}>
          {empty ? (
            <View style={s.empty}>
              <Text style={s.emptyTxt}>{emptyMsg}</Text>
            </View>
          ) : (
            <FlatList<Entry>
              ref={listRef}
              data={raw}
              keyExtractor={keyEx}
              renderItem={renderRow}
              showsVerticalScrollIndicator={true}
              indicatorStyle="white"
              persistentScrollbar={true}
              contentContainerStyle={{ paddingBottom: 12, paddingTop: 6 }}
              getItemLayout={(_, index) => ({ length: ROW_STRIDE, offset: ROW_STRIDE * index, index })}
              onScrollToIndexFailed={info => {
                setTimeout(() => listRef.current?.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: true }), 100);
              }}
            />
          )}
        </View>

        {/* FOOTER */}
        <View style={s.footer}>
          <View style={s.rankPill}>
            <Text style={s.rankTxt}>RANK: {myRank || '–'}</Text>
          </View>
          <TouchableOpacity onPress={handleGoToMe} activeOpacity={0.8} style={s.goBtn}>
            <Text style={s.goBtnTxt}>Go to{'\n'}My Ranking</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F062D' },
  safe: { flex: 1 },

  // Title
  title: {
    fontFamily: 'Ethnocentric',
    fontSize: SW > 390 ? 31 : 26,
    color: TEXT_W,
    textAlign: 'center',
    letterSpacing: 4,
    marginTop: 24,
    marginBottom: 10,
    textShadowColor: TITLE_GLOW,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 22,
  },

  // Global / Daily toggle
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  toggleBtn: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(20, 8, 50, 0.6)',
  },
  toggleBtnActive: {
    borderColor: ROW_ME_BORDER,
    backgroundColor: 'rgba(255, 20, 180, 0.15)',
    shadowColor: ROW_ME_BORDER,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  toggleTxt: { fontFamily: 'ShareTechMono', fontSize: 13, color: TEXT_D, letterSpacing: 1 },
  toggleTxtActive: { color: TEXT_W, fontWeight: '700' },

  // Podium row
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    marginBottom: 10,
    gap: 6,
  },
  podCard:      { flex: 1, alignItems: 'center', maxWidth: 120 },
  podCardFirst: { marginBottom: 18 }, // rank-1 stands higher
  podRing: {
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  podName: { fontFamily: 'ShareTechMono', fontSize: 10, color: TEXT_W, marginTop: 6, textAlign: 'center' },
  // podPts removed — showing username only

  // Panel — narrower margins, fixed height set inline
  panel: {
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: PANEL_BORDER,
    backgroundColor: PANEL_BG,
    overflow: 'hidden',
    shadowColor: PANEL_GLOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.70,
    shadowRadius: 18,
    elevation: 12,
  },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_H,
    marginHorizontal: 8,
    marginVertical: ROW_MARGIN_V,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: ROW_BG,
  },
  rowMe: {
    borderWidth: 1,
    borderColor: 'rgba(255, 24, 180, 0.35)',
    backgroundColor: 'rgba(255, 20, 180, 0.06)',
  },
  rowRank: { fontFamily: 'ShareTechMono', fontSize: 13, color: TEXT_D, width: 28, textAlign: 'right', marginRight: 8 },
  rowName: { flex: 1, fontFamily: 'ShareTechMono', fontSize: 13, color: TEXT_W, marginLeft: 8 },
  rowPts:  { fontFamily: 'ShareTechMono', fontSize: 12, color: TEXT_W },

  // Footer — paddingBottom clears the curved hotbar (0.1*height) + tab pb-8 (32px)
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: HOTBAR_H,
  },
  rankPill: {
    borderWidth: 1.5,
    borderColor: RANK_PILL_BORDER,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(10, 4, 35, 0.9)',
    shadowColor: RANK_PILL_BORDER,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 6,
  },
  rankTxt: { fontFamily: 'ShareTechMono', fontSize: 14, color: TEXT_W, letterSpacing: 1 },
  goBtn: {
    backgroundColor: '#120830',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CC22FF',
    shadowColor: '#CC22FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  goBtnTxt: { fontFamily: 'ShareTechMono', fontSize: 11, color: TEXT_W, textAlign: 'center', lineHeight: 15 },

  // Empty
  empty:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTxt: { fontFamily: 'ShareTechMono', fontSize: 15, color: TEXT_D, textAlign: 'center', lineHeight: 24 },
});