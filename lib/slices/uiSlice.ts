import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  activeModals: Set<string>;
  scrollEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

const initialState: UIState = {
  isLoading: false,
  activeModals: new Set(),
  scrollEnabled: true,
  theme: 'auto',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModals.add(action.payload);
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.activeModals.delete(action.payload);
    },
    closeAllModals: (state) => {
      state.activeModals.clear();
    },
    setScrollEnabled: (state, action: PayloadAction<boolean>) => {
      state.scrollEnabled = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    toggleScrollEnabled: (state) => {
      state.scrollEnabled = !state.scrollEnabled;
    },
  },
});

export const {
  setLoading,
  openModal,
  closeModal,
  closeAllModals,
  setScrollEnabled,
  setTheme,
  toggleScrollEnabled,
} = uiSlice.actions;

export default uiSlice.reducer;
