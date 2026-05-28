import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userSlice from './slices/userSlice';
import favoritesSlice from './slices/favoritesSlice';
import attendeeSlice from './slices/attendeeSlice';
import shiftsSlice from './slices/shiftsSlice';
import leaderboardSlice from './slices/leaderboardSlice';
import staffSlice from './slices/staffSlice';
import settingsSlice from './slices/settingsSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['favorites', 'user', 'attendee', 'settings'], // Only persist these slices
};

const rootReducer = combineReducers({
  user: userSlice,
  favorites: favoritesSlice,
  attendee: attendeeSlice,
  shifts: shiftsSlice,
  leaderboard: leaderboardSlice,
  staff: staffSlice,
  settings: settingsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
