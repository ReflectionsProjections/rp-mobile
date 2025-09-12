import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/api/api';

type LeaderboardEntry = {
  userId: string;
  displayName: string;
  rank: number;
  points: number;
  icon?: any;
  currentTier?: any;
};

type DailyState = {
  day: string | null;
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
};

type GlobalState = {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
};

export const fetchDailyLeaderboard = createAsyncThunk(
  'leaderboard/fetchDaily',
  async ({ day, n }: { day: string; n?: number }) => {
    const res = await api.get('/leaderboard/daily', { params: { day, n } });
    return { day, leaderboard: res.data.leaderboard as LeaderboardEntry[] };
  },
);

export const fetchGlobalLeaderboard = createAsyncThunk(
  'leaderboard/fetchGlobal',
  async ({ n }: { n?: number } = {}) => {
    const res = await api.get('/leaderboard/global', { params: { n } });
    return { leaderboard: res.data.leaderboard as LeaderboardEntry[] };
  },
);

type LeaderboardState = {
  daily: DailyState;
  global: GlobalState;
};

const initialState: LeaderboardState = {
  daily: { day: null, leaderboard: [], loading: false, error: null },
  global: { leaderboard: [], loading: false, error: null },
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearLeaderboard(state) {
      state.daily = { day: null, leaderboard: [], loading: false, error: null };
      state.global = { leaderboard: [], loading: false, error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyLeaderboard.pending, (state) => {
        state.daily.loading = true;
        state.daily.error = null;
      })
      .addCase(
        fetchDailyLeaderboard.fulfilled,
        (state, action: PayloadAction<{ day: string; leaderboard: LeaderboardEntry[] }>) => {
          state.daily.loading = false;
          state.daily.day = action.payload.day;
          state.daily.leaderboard = action.payload.leaderboard;
        },
      )
      .addCase(fetchDailyLeaderboard.rejected, (state, action) => {
        state.daily.loading = false;
        state.daily.error = action.error.message || 'Failed to load daily leaderboard';
      })
      .addCase(fetchGlobalLeaderboard.pending, (state) => {
        state.global.loading = true;
        state.global.error = null;
      })
      .addCase(
        fetchGlobalLeaderboard.fulfilled,
        (state, action: PayloadAction<{ leaderboard: LeaderboardEntry[] }>) => {
          state.global.loading = false;
          state.global.leaderboard = action.payload.leaderboard;
        },
      )
      .addCase(fetchGlobalLeaderboard.rejected, (state, action) => {
        state.global.loading = false;
        state.global.error = action.error.message || 'Failed to load global leaderboard';
      });
  },
});

export const { clearLeaderboard } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
