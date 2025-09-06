import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Attendee } from '@/api/types';
import { api } from '@/api/api';

interface AttendeeState {
  attendee: Attendee | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: AttendeeState = {
  attendee: null,
  loading: false,
  error: null,
  lastFetched: null,
};

export const fetchAttendeeProfile = createAsyncThunk(
  'attendee/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendee');
      return response.data as Attendee;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendee profile');
    }
  },
);

export const fetchAttendeePoints = createAsyncThunk(
  'attendee/fetchPoints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendee/points');
      return response.data.points;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch points');
    }
  },
);

const attendeeSlice = createSlice({
  name: 'attendee',
  initialState,
  reducers: {
    setAttendeeProfile: (state, action: PayloadAction<Attendee>) => {
      state.attendee = action.payload;
      state.lastFetched = Date.now();
      state.error = null;
    },
    updatePoints: (state, action: PayloadAction<number>) => {
      if (state.attendee) {
        state.attendee.points = action.payload;
        state.lastFetched = Date.now();
      }
    },
    addPoints: (state, action: PayloadAction<number>) => {
      if (state.attendee) {
        state.attendee.points += action.payload;
        state.lastFetched = Date.now();
      }
    },
    subtractPoints: (state, action: PayloadAction<number>) => {
      if (state.attendee) {
        state.attendee.points = Math.max(0, state.attendee.points - action.payload);
        state.lastFetched = Date.now();
      }
    },
    clearAttendeeProfile: (state) => {
      state.attendee = null;
      state.lastFetched = null;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendeeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendeeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.attendee = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchAttendeeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAttendeePoints.fulfilled, (state, action) => {
        if (state.attendee) {
          state.attendee.points = action.payload;
        }
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchAttendeePoints.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setAttendeeProfile,
  updatePoints,
  addPoints,
  subtractPoints,
  clearAttendeeProfile,
  setError,
  clearError,
} = attendeeSlice.actions;

export default attendeeSlice.reducer;
