import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/api/api';
import { path } from '@/api/types';

interface FavoritesState {
  favoriteEventIds: Set<string>;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: FavoritesState = {
  favoriteEventIds: new Set(),
  loading: false,
  error: null,
  lastFetched: null,
};

export const fetchUserFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(path('/attendee/favorites', { userId }));
      return response.data.favorites as string[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async ({ eventId, userId }: { eventId: string; userId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const isCurrentlyFavorite = state.favorites.favoriteEventIds.has(eventId);
      
      if (isCurrentlyFavorite) {
        await api.delete(path('/attendee/favorites/:eventId', { eventId }), {
          data: { userId },
        });
      } else {
        await api.post(path('/attendee/favorites/:eventId', { eventId }), {
          userId,
        });
      }
      
      return { eventId, action: isCurrentlyFavorite ? 'remove' : 'add' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle favorite');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.favoriteEventIds = new Set(action.payload);
      state.lastFetched = Date.now();
      state.error = null;
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      state.favoriteEventIds.add(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favoriteEventIds.delete(action.payload);
    },
    clearFavorites: (state) => {
      state.favoriteEventIds.clear();
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
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteEventIds = new Set(action.payload);
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleFavorite.pending, (state, action) => {
        // Optimistic update
        const { eventId } = action.meta.arg;
        if (state.favoriteEventIds.has(eventId)) {
          state.favoriteEventIds.delete(eventId);
        } else {
          state.favoriteEventIds.add(eventId);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        // Revert optimistic update
        const { eventId } = action.meta.arg;
        if (action.payload) {
          if (state.favoriteEventIds.has(eventId)) {
            state.favoriteEventIds.delete(eventId);
          } else {
            state.favoriteEventIds.add(eventId);
          }
        }
        state.error = action.payload as string;
      });
  },
});

export const { 
  setFavorites, 
  addFavorite, 
  removeFavorite, 
  clearFavorites, 
  setError, 
  clearError 
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
