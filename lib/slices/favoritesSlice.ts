import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/api/api';
import { path } from '@/api/types';
import { Event } from '@/api/types';

interface FavoritesState {
  favoriteEventIds: string[];
  events: Event[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  eventsLastFetched: number | null;
}

const initialState: FavoritesState = {
  favoriteEventIds: [],
  events: [],
  loading: false,
  error: null,
  lastFetched: null,
  eventsLastFetched: null,
};

export const fetchUserFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(path('/attendee/favorites', { userId }));
      return (response.data as any).favorites as string[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const fetchEvents = createAsyncThunk(
  'favorites/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events');
      return response.data as Event[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async ({ eventId, userId }: { eventId: string; userId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const isCurrentlyFavorite = state.favorites.favoriteEventIds.includes(eventId);
      
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
      state.favoriteEventIds = action.payload;
      state.lastFetched = Date.now();
      state.error = null;
    },
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
      state.eventsLastFetched = Date.now();
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favoriteEventIds.includes(action.payload)) {
        state.favoriteEventIds.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favoriteEventIds = state.favoriteEventIds.filter(id => id !== action.payload);
    },
    clearFavorites: (state) => {
      state.favoriteEventIds = [];
      state.lastFetched = null;
      state.error = null;
    },
    clearEvents: (state) => {
      state.events = [];
      state.eventsLastFetched = null;
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
        state.favoriteEventIds = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.eventsLastFetched = Date.now();
      })
      .addCase(toggleFavorite.pending, (state, action) => {
        if (!state.favoriteEventIds) {
          state.favoriteEventIds = [];
        }
        const { eventId } = action.meta.arg;
        if (state.favoriteEventIds.includes(eventId)) {
          state.favoriteEventIds = state.favoriteEventIds.filter(id => id !== eventId);
        } else {
          state.favoriteEventIds.push(eventId);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        if (!state.favoriteEventIds) {
          state.favoriteEventIds = [];
        }
        const { eventId } = action.meta.arg;
        if (action.payload) {
          if (state.favoriteEventIds.includes(eventId)) {
            state.favoriteEventIds = state.favoriteEventIds.filter(id => id !== eventId);
          } else {
            state.favoriteEventIds.push(eventId);
          }
        }
        state.error = action.payload as string;
      });
  },
});

export const { 
  setFavorites, 
  setEvents,
  addFavorite, 
  removeFavorite, 
  clearFavorites, 
  clearEvents,
  setError, 
  clearError 
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
