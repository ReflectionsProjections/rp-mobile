import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SettingsState = {
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
};

const initialState: SettingsState = {
  hapticsEnabled: true,
  notificationsEnabled: true,
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
    setNotificationsEnabled(state, action: PayloadAction<boolean>) {
      state.notificationsEnabled = action.payload;
    },
    toggleNotifications(state) {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
  },
});

export const { setHapticsEnabled, toggleHaptics, setNotificationsEnabled, toggleNotifications } =
  settingsSlice.actions;
export default settingsSlice.reducer;
