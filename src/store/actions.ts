import { createAction } from '@reduxjs/toolkit';

import type { Classroom, ClassFormValues, SheetStylePreferences } from '@/features/classroom/types';
import type { CustomPhrase } from '@/features/reports/phraseBankSlice';
import type { StudentEvaluationsState } from '@/features/reports/studentEvaluationsSlice';
import type { ReportSettings } from '@/features/reports/types';
import type { SeatingState } from '@/features/seating/seatingSlice';

/** The saved parts of the state, all at once: restoring a backup or undoing a restore. */
export type RestorableState = {
  classroom: { classrooms: Classroom[] };
  classDraft: ClassFormValues;
  sheetStyle: SheetStylePreferences;
  reportSettings: ReportSettings;
  studentEvaluations: StudentEvaluationsState;
  phraseBank: { customPhrases: CustomPhrase[] };
  seating: SeatingState;
};

export const stateRestored = createAction<RestorableState>('app/stateRestored');
