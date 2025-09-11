import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/api/api';
import { ShiftAssignment, path } from '@/api/types';

interface ShiftsState {
  shifts: ShiftAssignment[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ShiftsState = {
  shifts: [],
  loading: false,
  error: null,
  lastFetched: null,
};

export const fetchMyShifts = createAsyncThunk(
  'shifts/fetchMyShifts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/shifts/my-shifts');
      return response.data as ShiftAssignment[];
    } catch (error: any) {
      console.log('Shifts API error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shifts');
    }
  },
);

export const toggleAcknowledgeShift = createAsyncThunk(
  'shifts/toggleAcknowledge',
  async (shiftId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(path('/shifts/:shiftId/acknowledge', { shiftId }), {});
      return response.data as ShiftAssignment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle acknowledgement');
    }
  },
);

const shiftsSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    clearShifts: (state) => {
      state.shifts = [];
      state.error = null;
      state.lastFetched = null;
    },
    setShifts: (state, action: PayloadAction<ShiftAssignment[]>) => {
      state.shifts = action.payload;
      state.lastFetched = Date.now();
    },
    toggleLocalAcknowledge: (state, action: PayloadAction<string>) => {
      const idx = state.shifts.findIndex((s) => s.shiftId === action.payload);
      if (idx !== -1) {
        state.shifts[idx] = {
          ...state.shifts[idx],
          acknowledged: !state.shifts[idx].acknowledged,
        };
      }
    },
    setAcknowledgeExplicit: (
      state,
      action: PayloadAction<{ shiftId: string; acknowledged: boolean }>,
    ) => {
      const { shiftId, acknowledged } = action.payload;
      const idx = state.shifts.findIndex((s) => s.shiftId === shiftId);
      if (idx !== -1) {
        state.shifts[idx] = {
          ...state.shifts[idx],
          acknowledged,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchMyShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleAcknowledgeShift.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.shifts.findIndex(
          (s) => s.shiftId === updated.shiftId && s.staffEmail === updated.staffEmail,
        );
        if (idx !== -1) {
          // Preserve existing embedded shifts object if API returns bare assignment
          state.shifts[idx] = {
            ...state.shifts[idx],
            ...updated,
            shifts: updated.shifts || state.shifts[idx].shifts,
          } as any;
        }
      });
  },
});

export const { clearShifts, setShifts, toggleLocalAcknowledge, setAcknowledgeExplicit } =
  shiftsSlice.actions;
export default shiftsSlice.reducer;
