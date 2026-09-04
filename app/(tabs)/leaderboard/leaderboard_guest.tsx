import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { TouchableOpacity } from '@/components/ui/HapticControls';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Header } from '@/components/home/Header';

const CROWN_GOLD   = require('@/assets/images/leaderboard/crown_gold.png');
const CROWN_SILVER = require('@/assets/images/leaderboard/crown_silver.png');
const CROWN_BRONZE = require('@/assets/images/leaderboard/crown_bronze.png');
const PLACEHOLDER  = require('@/assets/images/leaderboard/placeholder.png');

const { width: SW, height: SH } = Dimensions.get('window');

// CurvedBottomBar height = 0.1 * height, tab layout adds pb-8 (32px)
const HOTBAR_H = SH * 0.1 + 32 + 10;

// Design tokens
const PANEL_BG     = 'rgba(15, 8, 45, 0.85)';        // keep panel dark
const PANEL_BORDER    = '#C02EFF';
const PANEL_GLOW      = '#A020F0';
const ROW_BG       = 'rgba(180, 165, 210, 0.22)';   // more opaque silvery purple
const ROW_ME_BG       = 'rgba(255, 20, 180, 0.10)';
const ROW_ME_BORDER   = '#FF18B4';
const RANK_PILL_BG    = 'rgba(10, 4, 35, 0.9)';
const RANK_PILL_BORDER = '#FF18B4';
// "Go to My Ranking" button: dark purple fill, pink-to-purple border (matches asset)
const GO_BTN_BG       = '#120830';
const GO_BTN_BORDER   = '#CC22FF';
const TITLE_GLOW      = '#FF3CF0';
const ACCENT          = '#CA2523';
const TEXT_W          = '#FFFFFF';
const TEXT_D          = 'rgba(255,255,255,0.50)';
const ROW_H           = 56;
const ROW_MARGIN_V    = 4; // matches s.row's marginVertical below
const ROW_STRIDE      = ROW_H + ROW_MARGIN_V * 2; // total vertical space each row occupies

interface Entry {
  rank: number;
  userId: string;
  displayName: string;
  points: number;
  delta?: number;
}

const DUMMY: Entry[] = [
  { rank:  1, userId: 'u1',    displayName: 'Username',    points: 4210, delta:  312 },
  { rank:  2, userId: 'u2',    displayName: 'Username',       points: 3980, delta:  -88 },
  { rank:  3, userId: 'u3',    displayName: 'Username',   points: 3745, delta:   55 },
  { rank:  4, userId: 'u4',    displayName: 'Prince Zuko',      points: 3512, delta:  105 },
  { rank:  5, userId: 'u5',    displayName: 'RuPaul',           points: 3204, delta: -200 },
  { rank:  6, userId: 'u6',    displayName: 'Abby Lee Miller',  points: 2988, delta:   30 },
  { rank:  7, userId: 'u7',    displayName: 'Luigi',            points: 2750, delta:   15 },
  { rank:  8, userId: 'u8',    displayName: 'Caitlyn Kiramman', points: 2601, delta:  -50 },
  { rank:  9, userId: 'u9',    displayName: 'Obama',            points: 2444, delta:   78 },
  { rank: 10, userId: 'u10',   displayName: 'Marceline',        points: 2300, delta:    0 },
  { rank: 11, userId: 'u11',   displayName: 'Spike Spiegel',    points: 2150, delta:  -32 },
  { rank: 12, userId: 'u12',   displayName: 'Rem Savant',       points: 2010, delta:   44 },
  { rank: 13, userId: 'u13',   displayName: 'Turbo Gecko',      points: 1870, delta:   20 },
  { rank: 14, userId: 'u14',   displayName: 'Circuit Breaker',  points: 1740, delta:  -15 },
  { rank: 15, userId: 'u15',   displayName: 'Flashpoint',       points: 1600, delta:   60 },
  { rank: 16, userId: 'u16',   displayName: 'GridLock X',       points: 1480, delta:  -90 },
  { rank: 17, userId: 'u17',   displayName: 'Piston Head',      points: 1355, delta:   25 },
  { rank: 18, userId: 'u18',   displayName: 'Rev Limiter',      points: 1240, delta:   10 },
  { rank: 19, userId: 'u19',   displayName: 'Throttle Ghost',   points: 1120, delta:  -40 },
  { rank: 20, userId: 'guest', displayName: 'You (Guest)',       points:  980, delta:    5 },
  { rank: 21, userId: 'u21',   displayName: 'Tarmac Terror',    points:  870, delta:  -22 },
  { rank: 22, userId: 'u22',   displayName: 'Slipstream',       points:  760, delta:    0 },
  { rank: 23, userId: 'u23',   displayName: 'Burnout King',     points:  640, delta:   18 },
];

// Delta badge
function DeltaBadge({ delta }: { delta?: number }) {
  if (delta == null) return null;
  const zero = delta === 0;
  const up   = delta > 0;
  const col  = zero ? TEXT_D : up ? '#34E07A' : '#FF4C4C';
  const sym  = zero ? '–' : up ? '▲' : '▼';
  return (
    <View style={[db.pill, { borderColor: col }]}>
      <Text style={[db.txt, { color: col }]}>{sym}{zero ? '' : Math.abs(delta)}</Text>
    </View>
  );
}
const db = StyleSheet.create({
  pill: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 4, paddingVertical: 1, marginLeft: 4 },
  txt:  { fontFamily: 'ShareTechMono', fontSize: 9, fontWeight: '700' },
});

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

// Avatar
function Avatar({ name, uid, size = 36 }: { name: string; uid: string; size?: number }) {
  return (
    <View style={{
      width: size + 6,
      height: size + 6,
      borderRadius: (size + 6) / 2,
      borderWidth: 2,
      borderColor: 'rgba(200, 190, 255, 0.55)',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Image
        source={PLACEHOLDER}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#fff', fontSize: size * 0.33, fontFamily: 'ShareTechMono', fontWeight: '700' }}>
          {initials(name)}
        </Text>
      </View>
    </View>
  );
}

// Row — all ranks from 1 upward
function Row({ item, isMe }: { item: Entry; isMe: boolean }) {
  return (
    <View style={[s.row, isMe && s.rowMe]}>
      <Text style={[s.rowRank, isMe && { color: ROW_ME_BORDER }]}>{item.rank}</Text>
      <Avatar name={item.displayName} uid={item.userId} size={36} />
      <Text style={s.rowName} numberOfLines={1}>{item.displayName}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[s.rowPts, isMe && { color: ROW_ME_BORDER }]}>{item.points} pts</Text>
        <DeltaBadge delta={item.delta} />
      </View>
    </View>
  );
}

// Podium card — avatar + glowing info box below with name & points
function PodiumCard({ entry, rank, isMe }: { entry: Entry; rank: 1|2|3; isMe: boolean }) {
  const isFirst   = rank === 1;
  const crown     = rank === 1 ? CROWN_GOLD : rank === 2 ? CROWN_SILVER : CROWN_BRONZE;
  const crownW    = isFirst ? 32 : 24;
  const circSz    = isFirst ? 76 : 62;
  const ringColor = isMe ? ROW_ME_BORDER : rank === 1 ? '#F5C540' : rank === 2 ? '#A8B4CC' : '#D0804A';

  return (
    <View style={[s.podCard, isFirst && s.podCardFirst]}>
      {/* Crown */}
      <Image source={crown} style={{ width: crownW, height: crownW * 0.78, resizeMode: 'contain', marginBottom: 4 }} />

      {/* Avatar ring */}
      <View style={[
        s.podRing,
        { width: circSz + 8, height: circSz + 8, borderRadius: (circSz + 8) / 2, borderColor: ringColor },
        isFirst && { shadowColor: ringColor, shadowOpacity: 0.75, shadowRadius: 14 },
        isMe    && { shadowColor: ROW_ME_BORDER, shadowOpacity: 0.9, shadowRadius: 16 },
      ]}>
        <Image source={PLACEHOLDER} style={{ width: circSz, height: circSz, borderRadius: circSz / 2 }} />
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: '#fff', fontSize: circSz * 0.26, fontFamily: 'ShareTechMono', fontWeight: '700' }}>
            {initials(entry.displayName)}
          </Text>
        </View>
      </View>

      {/* Info box: username + points with glow border */}
      <View style={[
        s.podInfoBox,
        { borderColor: isMe ? ROW_ME_BORDER : ringColor,
          shadowColor: isMe ? ROW_ME_BORDER : ringColor },
      ]}>
        <Text style={s.podInfoName} numberOfLines={1}>{entry.displayName}</Text>
        <Text style={s.podInfoPts}>{entry.points}</Text>
      </View>
    </View>
  );
}

export default function LeaderboardGuestScreen() {
  const listRef    = useRef<FlatList<Entry>>(null);
  const myRank     = DUMMY.find(e => e.userId === 'guest')?.rank ?? 0;

  const handleGoToMe = useCallback(() => {
    const idx = DUMMY.findIndex(e => e.userId === 'guest');
    if (idx >= 0) listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.4 });
  }, []);

  const renderRow = useCallback(
    ({ item }: { item: Entry }) => <Row item={item} isMe={item.userId === 'guest'} />,
    [],
  );
  const keyEx = useCallback((item: Entry) => item.userId, []);

  // Podium: 2nd left · 1st center · 3rd right
  const top3 = DUMMY.slice(0, 3);
  const podEntries = [top3[1], top3[0], top3[2]] as Entry[];
  const podRanks: (1|2|3)[] = [2, 1, 3];

  // Panel height: leave room for title + podium + footer
  // Roughly SH - safeArea - title (~60) - podium (~200) - footer (~70)
  const PANEL_HEIGHT = SH * 0.44;

  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0F062D', '#24114C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={s.safe}>
        <Header title="STANDINGS" bigText={false} />

        {/* Podium — wrapped in a glowing outer box matching the screenshot */}
        <View style={s.podium}>
            {podEntries.map((e, i) => (
              <PodiumCard key={e.userId} entry={e} rank={podRanks[i]} isMe={e.userId === 'guest'} />
            ))}
        </View>

        {/* Scrollable leaderboard panel — narrower, fixed height */}
        <View style={[s.panel, { height: PANEL_HEIGHT }]}>
          <FlatList<Entry>
            ref={listRef}
            data={DUMMY}
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
        </View>

        {/* Footer: rank pill left · go-to-ranking button right */}
        <View style={s.footer}>
          <View style={s.rankPill}>
            <Text style={s.rankTxt}>RANK: {myRank}</Text>
          </View>

          <View style={s.footerRight}>
            {/* Sign in button — compact, sits above hotbar */}
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/sign-in')}
              activeOpacity={0.85}
              style={s.signInBtn}
            >
              <Text style={s.signInTxt}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGoToMe} activeOpacity={0.8} style={s.goBtn}>
              <Text style={s.goBtnTxt}>Go to{'\n'}My Ranking</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  // Podium outer wrapper — the glowing rectangle around all 3 slots
  podiumOuter: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(100, 60, 255, 0.55)',
    backgroundColor: 'rgba(20, 8, 60, 0.45)',
    shadowColor: '#6040FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
    paddingTop: 10,
    paddingBottom: 12,
  },

  // Podium inner row
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    marginBottom: 22,
    gap: 6,
  },
  podCard:      { flex: 1, alignItems: 'center', maxWidth: 115 },
  podCardFirst: { marginBottom: 16 },
  podRing: {
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  // Info box below each avatar: name + points
  podInfoBox: {
    marginTop: 8,
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 4, 40, 0.75)',
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  podInfoName: {
    fontFamily: 'ShareTechMono',
    fontSize: 10,
    color: TEXT_W,
    textAlign: 'center',
  },
  podInfoPts: {
    fontFamily: 'ShareTechMono',
    fontSize: 11,
    color: TEXT_D,
    marginTop: 1,
    textAlign: 'center',
  },
  // podName kept for legacy compat (not used now)
  podName: { fontFamily: 'ShareTechMono', fontSize: 10, color: TEXT_W, marginTop: 5, textAlign: 'center' },

  // Panel — narrower (20px margins each side) and fixed height
  panel: {
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: PANEL_BORDER,
    backgroundColor: PANEL_BG,
    overflow: 'hidden',
    shadowColor: PANEL_GLOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 18,
    elevation: 12,
  },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_H,
    marginHorizontal: 10,
    marginVertical: ROW_MARGIN_V,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(155, 140, 200, 0.28)',   // silvery purple fill
    borderWidth: 1.5,
    borderColor: 'rgba(210, 200, 240, 0.50)',        // bright silver-purple rim
  },
  rowMe: {
    backgroundColor: ROW_ME_BG,
    borderWidth: 1.5,
    borderColor: ROW_ME_BORDER,
    shadowColor: ROW_ME_BORDER,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  rowRank: {
    fontFamily: 'ShareTechMono',
    fontSize: 13,
    color: TEXT_D,
    width: 26,
    textAlign: 'right',
    marginRight: 8,
  },
  rowName: { flex: 1, fontFamily: 'ShareTechMono', fontSize: 13, color: TEXT_W, marginLeft: 8 },
  rowPts:  { fontFamily: 'ShareTechMono', fontSize: 12, color: TEXT_W },

  // Footer — paddingBottom clears the curved hotbar (0.1*height) + tab pb-8 (32px)
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: HOTBAR_H,  // sits above the bottom nav bar
  },

  // RANK pill — pink glow border
  rankPill: {
    borderWidth: 1.5,
    borderColor: RANK_PILL_BORDER,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: RANK_PILL_BG,
    shadowColor: RANK_PILL_BORDER,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 6,
  },
  rankTxt: {
    fontFamily: 'ShareTechMono',
    fontSize: 14,
    color: TEXT_W,
    letterSpacing: 1,
  },

  // Right side of footer: sign-in + go-to-ranking stacked horizontally
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Sign in — accent red pill
  signInBtn: {
    backgroundColor: ACCENT,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  signInTxt: {
    fontFamily: 'ShareTechMono',
    fontSize: 12,
    color: TEXT_W,
    letterSpacing: 0.5,
  },

  // "Go to My Ranking" — dark pill matching rank_button.png
  goBtn: {
    backgroundColor: GO_BTN_BG,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: GO_BTN_BORDER,
    shadowColor: GO_BTN_BORDER,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  goBtnTxt: {
    fontFamily: 'ShareTechMono',
    fontSize: 10,
    color: TEXT_W,
    textAlign: 'center',
    lineHeight: 14,
  },
});
