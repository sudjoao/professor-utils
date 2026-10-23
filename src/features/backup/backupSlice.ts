import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { IsoDate } from '@/lib/date/isoDate';

type BackupState = {
  /** Day of the last copy saved to the computer. */
  lastBackupAt: IsoDate | null;
  /** The reminder stays quiet until this day ("Lembrar daqui a uma semana"). */
  remindAfter: IsoDate | null;
};

export const INITIAL_BACKUP_STATE: BackupState = { lastBackupAt: null, remindAfter: null };

const backupSlice = createSlice({
  name: 'backup',
  initialState: INITIAL_BACKUP_STATE,
  reducers: {
    backupSaved: (state, action: PayloadAction<IsoDate>) => {
      state.lastBackupAt = action.payload;
      state.remindAfter = null;
    },
    backupReminderPostponed: (state, action: PayloadAction<IsoDate>) => {
      state.remindAfter = action.payload;
    },
  },
  selectors: {
    selectBackupState: (state) => state,
  },
});

export const { backupSaved, backupReminderPostponed } = backupSlice.actions;
export const { selectBackupState } = backupSlice.selectors;
export const backupReducer = backupSlice.reducer;
