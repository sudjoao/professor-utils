import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

import { classDraftReducer } from '@/features/classroom/classDraftSlice';
import { classroomReducer } from '@/features/classroom/classroomSlice';
import { reportSettingsReducer } from '@/features/reports/reportSettingsSlice';
import { storage } from '@/store/storage';

const rootReducer = combineReducers({
  classroom: classroomReducer,
  classDraft: classDraftReducer,
  reportSettings: reportSettingsReducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  {
    key: 'professor-utils',
    version: 1,
    storage,
    whitelist: ['classroom', 'classDraft', 'reportSettings'],
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
