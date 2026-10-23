import type { ClassInfo, SheetStyle } from '@/features/classroom/types';
import type { TermNumber } from '@/features/schoolCalendar/types';

export type CouncilColumnKey =
  'absences' | 'grade' | 'learning' | 'difficulties' | 'actions' | 'participation';

export type CouncilColumn = {
  title: string;
  /** Text columns are wide and wrap; short ones (absences, grade) are narrow. */
  isText: boolean;
};

export type CouncilFormValues = {
  term: TermNumber;
  columns: CouncilColumnKey[];
  /** More columns, one title per line. */
  customColumnsText: string;
  tallRows: boolean;
};

export type CouncilSheetData = {
  classInfo: ClassInfo;
  term: TermNumber;
  studentNames: string[];
  columns: CouncilColumn[];
  tallRows: boolean;
  style: SheetStyle;
};
