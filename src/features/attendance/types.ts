import type { IsoDate } from '@/lib/date/isoDate';
import type { Weekday } from '@/lib/date/weekdays';

export type ColumnMode = 'dates' | 'count';

export type DateRange = {
  id: string;
  start: IsoDate;
  end: IsoDate;
};

export type AttendanceFormValues = {
  classroomName: string;
  subject: string;
  teacherName: string;
  studentsText: string;
  sortStudents: boolean;
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

export type AttendanceSheetHeader = {
  classroomName: string;
  subject: string;
  teacherName: string;
};

export type AttendanceSheetData = {
  header: AttendanceSheetHeader;
  studentNames: string[];
  columns: AttendanceColumn[];
};
