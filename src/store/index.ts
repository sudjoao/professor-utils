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

import { backupReducer } from '@/features/backup/backupSlice';
import { classDraftReducer } from '@/features/classroom/classDraftSlice';
import { classroomReducer } from '@/features/classroom/classroomSlice';
import { sheetStyleReducer } from '@/features/classroom/sheetStyleSlice';
import { parentNoteReducer } from '@/features/parentNotes/parentNoteSlice';
import { headerImageStorage } from '@/features/reports/headerImageStorage';
import { phraseBankReducer } from '@/features/reports/phraseBankSlice';
import { reportSettingsReducer } from '@/features/reports/reportSettingsSlice';
import { studentEvaluationsReducer } from '@/features/reports/studentEvaluationsSlice';
import { seatingReducer } from '@/features/seating/seatingSlice';
import { stateRestored } from '@/store/actions';
import { moveHeaderImageOut } from '@/store/migrations';
import { storage } from '@/store/storage';

const combinedReducer = combineReducers({
  classroom: classroomReducer,
  classDraft: classDraftReducer,
  sheetStyle: sheetStyleReducer,
  reportSettings: reportSettingsReducer,
  studentEvaluations: studentEvaluationsReducer,
  phraseBank: phraseBankReducer,
  seating: seatingReducer,
  parentNote: parentNoteReducer,
  backup: backupReducer,
});

type CombinedState = ReturnType<typeof combinedReducer>;

// A restored backup replaces the saved slices at once; every other action goes to the slices.
const rootReducer: typeof combinedReducer = (state, action) =>
  combinedReducer(
    stateRestored.match(action) ? ({ ...state, ...action.payload } as CombinedState) : state,
    action,
  );

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
    whitelist: [
      'classroom',
      'classDraft',
      'sheetStyle',
      'reportSettings',
      'studentEvaluations',
      'phraseBank',
      'seating',
      'parentNote',
      'backup',
    ],
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
