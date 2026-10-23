import { createAction } from '@reduxjs/toolkit';

import type { Classroom, ClassFormValues, SheetStylePreferences } from '@/features/classroom/types';
import type { ReportSettings } from '@/features/reports/types';

/** The saved parts of the state, all at once: restoring a backup or undoing a restore. */
export type RestorableState = {
  classroom: { classrooms: Classroom[] };
  classDraft: ClassFormValues;
  sheetStyle: SheetStylePreferences;
  reportSettings: ReportSettings;
};

export const stateRestored = createAction<RestorableState>('app/stateRestored');
