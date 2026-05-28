import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingsState = {
  hapticsEnabled: boolean;
};

const initialState: SettingsState = {
  hapticsEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setHapticsEnabled(state, action: PayloadAction<boolean>) {
      state.hapticsEnabled = action.payload;
    },
    toggleHaptics(state) {
      state.hapticsEnabled = !state.hapticsEnabled;
    },
  },
});

export const { setHapticsEnabled, toggleHaptics } = settingsSlice.actions;
export default settingsSlice.reducer;
