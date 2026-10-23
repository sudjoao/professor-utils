import { describe, expect, it } from 'vitest';

import {
  backupReducer,
  backupReminderPostponed,
  backupSaved,
  INITIAL_BACKUP_STATE,
} from '@/features/backup/backupSlice';

describe('backupSlice', () => {
  it('remembers the day of the last copy and clears a postponed reminder', () => {
    const postponed = backupReducer(INITIAL_BACKUP_STATE, backupReminderPostponed('2026-10-30'));

    expect(backupReducer(postponed, backupSaved('2026-10-23'))).toEqual({
      lastBackupAt: '2026-10-23',
      remindAfter: null,
    });
  });
});
