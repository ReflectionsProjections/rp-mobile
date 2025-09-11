import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/api/api';
import { path, Staff } from '@/api/types';

export const fetchStaff = createAsyncThunk('staff/fetchByEmail', async (email: string) => {
  const res = await api.get(path('/staff/:email', { email }));
  return res.data as Staff;
});

type StaffState = {
  me: Staff | null;
  loading: boolean;
  error: string | null;
};

const initialState: StaffState = {
  me: null,
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearStaff(state) {
      state.me = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action: PayloadAction<Staff>) => {
        state.loading = false;
        state.me = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load staff';
      });
  },
});

export const { clearStaff } = staffSlice.actions;
export default staffSlice.reducer;


