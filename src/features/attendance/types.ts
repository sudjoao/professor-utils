import type { ClassFormValues, ClassInfo } from '@/features/classroom/types';
import type { IsoDate } from '@/lib/date/isoDate';
import type { Weekday } from '@/lib/date/weekdays';

export type ColumnMode = 'dates' | 'count';

export type DateRange = {
  id: string;
  start: IsoDate;
  end: IsoDate;
};

export type AttendanceFormValues = ClassFormValues & {
  columnMode: ColumnMode;
  dateRanges: DateRange[];
  weekdays: Weekday[];
  excludedDates: IsoDate[];
  lessonCount: number;
};

/** One lesson column of the sheet: `label` goes on the first header row, `caption` on the second. */
export type AttendanceColumn = {
  label: string;
  caption: string;
};

export type AttendanceSheetData = {
  classInfo: ClassInfo;
  studentNames: string[];
  columns: AttendanceColumn[];
};
