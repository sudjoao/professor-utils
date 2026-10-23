import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  createMigrate,
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

import { classDraftReducer } from '@/features/classroom/classDraftSlice';
import { classroomReducer } from '@/features/classroom/classroomSlice';
import { sheetStyleReducer } from '@/features/classroom/sheetStyleSlice';
import { headerImageStorage } from '@/features/reports/headerImageStorage';
import { reportSettingsReducer } from '@/features/reports/reportSettingsSlice';
import { moveHeaderImageOut } from '@/store/migrations';
import { storage } from '@/store/storage';

const rootReducer = combineReducers({
  classroom: classroomReducer,
  classDraft: classDraftReducer,
  sheetStyle: sheetStyleReducer,
  reportSettings: reportSettingsReducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  {
    key: 'professor-utils',
    version: 2,
    migrate: createMigrate({
      2: (state) =>
        moveHeaderImageOut(state, (image) => {
          if (!headerImageStorage.read()) {
            headerImageStorage.write(image);
          }
        }),
    }),
    // Groups the writes of fast typing; StoreProvider flushes them when the page closes.
    throttle: 300,
    storage,
    whitelist: ['classroom', 'classDraft', 'sheetStyle', 'reportSettings'],
    // Merges each slice with its initial state, so fields added later get their defaults.
    stateReconciler: autoMergeLevel2,
  },
  rootReducer,
);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
