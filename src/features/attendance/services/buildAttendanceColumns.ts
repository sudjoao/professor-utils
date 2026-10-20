import type { AttendanceColumn } from '@/features/attendance/types';
import { formatDayMonth, getWeekday, type IsoDate } from '@/lib/date/isoDate';
import { WEEKDAY_SHORT_LABELS } from '@/lib/date/weekdays';

export const toDateColumns = (dates: IsoDate[]): AttendanceColumn[] =>
  dates.map((date) => ({
    label: WEEKDAY_SHORT_LABELS[getWeekday(date)],
    caption: formatDayMonth(date),
  }));

/** Numbered columns leave the second header row blank so the teacher can write the date by hand. */
export const toNumberedColumns = (count: number): AttendanceColumn[] =>
  Array.from({ length: count }, (_, index) => ({ label: String(index + 1), caption: '' }));
