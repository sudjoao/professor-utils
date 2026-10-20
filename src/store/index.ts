import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import { classroomReducer } from '@/features/classroom/classroomSlice';
import { storage } from '@/store/storage';

const rootReducer = combineReducers({
  classroom: classroomReducer,
});

const persistedReducer = persistReducer(
  {
    key: 'professor-utils',
    version: 1,
    storage,
    whitelist: ['classroom'],
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
