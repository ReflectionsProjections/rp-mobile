import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RoleObject } from '@/api/types';
import { api } from '@/api/api';

interface UserState {
  profile: RoleObject | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
  lastFetched: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/info');
      return response.data as RoleObject;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updates: Partial<RoleObject>, { rejectWithValue }) => {
    try {
      // Optimistic update - this will be the PATCH /icon and PATCH /tags endpoints
      return updates;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<RoleObject>) => {
      state.profile = action.payload;
      state.lastFetched = Date.now();
      state.error = null;
    },
    clearUserProfile: (state) => {
      state.profile = null;
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
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
      });
  },
});

export const { setUserProfile, clearUserProfile, setError, clearError } = userSlice.actions;
export default userSlice.reducer;
