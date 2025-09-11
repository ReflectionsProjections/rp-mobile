import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Attendee, IconColorType } from '@/api/types';
import { api } from '@/api/api';
import * as SecureStore from 'expo-secure-store';
import { getColorFromIcon } from '@/lib/colorUtils';

interface AttendeeState {
  attendee: Attendee | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  themeColor: string;
}

const initialState: AttendeeState = {
  attendee: null,
  loading: false,
  error: null,
  lastFetched: null,
  themeColor: '#E53F33', // Default red color
};

export const fetchAttendeeProfile = createAsyncThunk(
  'attendee/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Check if JWT token exists before making API call
      const jwt = await SecureStore.getItemAsync('jwt');
      if (!jwt) {
        return rejectWithValue('No authentication token found');
      }

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
      // Check if JWT token exists before making API call
      const jwt = await SecureStore.getItemAsync('jwt');
      if (!jwt) {
        return rejectWithValue('No authentication token found');
      }

      const response = await api.get('/attendee/points');
      return response.data.points;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch points');
    }
  },
);

export const updateAttendeeIcon = createAsyncThunk(
  'attendee/updateIcon',
  async (color: IconColorType, { rejectWithValue }) => {
    try {
      await api.patch('/attendee/icon', { icon: color });
      return color; // Return the color that was successfully set
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update icon color');
    }
  },
);

export const updateAttendeeTags = createAsyncThunk(
  'attendee/updateTags',
  async (tags: string[], { rejectWithValue }) => {
    try {
      await api.patch('/attendee/tags', { tags });
      return tags; // Return the tags that were successfully set
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tags');
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

      // Update theme color based on attendee icon
      if (action.payload.icon) {
        state.themeColor = getColorFromIcon(action.payload.icon);
      }
    },
    setThemeColor: (state, action: PayloadAction<string>) => {
      state.themeColor = action.payload;
    },
    setOptimisticThemeColor: (
      state,
      action: PayloadAction<{ color: string; icon: IconColorType }>,
    ) => {
      state.themeColor = action.payload.color;
      if (state.attendee) {
        state.attendee.icon = action.payload.icon;
      }
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

        // Update theme color based on attendee icon
        if (action.payload.icon) {
          state.themeColor = getColorFromIcon(action.payload.icon);
        }
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
      })
      .addCase(updateAttendeeIcon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendeeIcon.fulfilled, (state, action) => {
        state.loading = false;

        // Update the attendee icon
        if (state.attendee) {
          state.attendee.icon = action.payload;
        }

        // Update theme color
        state.themeColor = getColorFromIcon(action.payload);
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(updateAttendeeIcon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAttendeeTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendeeTags.fulfilled, (state, action) => {
        state.loading = false;

        // Update the attendee tags
        if (state.attendee) {
          state.attendee = {
            ...state.attendee,
            tags: action.payload,
          };
        }

        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(updateAttendeeTags.rejected, (state, action) => {
        state.loading = false;
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
  setThemeColor,
  setOptimisticThemeColor,
} = attendeeSlice.actions;

export default attendeeSlice.reducer;
