import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userSlice from './slices/userSlice';
import favoritesSlice from './slices/favoritesSlice';
import uiSlice from './slices/uiSlice';
import scannerSlice from './slices/scannerSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    favorites: favoritesSlice,
    ui: uiSlice,
    scanner: scannerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
