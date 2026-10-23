import { MAX_RANGE_DAYS } from '@/features/attendance/constants';
import type { AttendanceFormValues, DateRange } from '@/features/attendance/types';
import { getCalendarNotes, isNoClassDay } from '@/features/schoolCalendar/services/schoolCalendar';
import type { CalendarNote, SchoolTerm } from '@/features/schoolCalendar/types';
import {
  daysBetween,
  eachDayOfRange,
  getWeekday,
  isIsoDate,
  type IsoDate,
} from '@/lib/date/isoDate';

type LessonDatesOptions = Pick<AttendanceFormValues, 'dateRanges' | 'weekdays'>;

type DateSelection = Pick<
  AttendanceFormValues,
  'excludedDates' | 'skipNoClassDays' | 'restoredDates'
>;

type CalendarNotes = Map<IsoDate, CalendarNote>;

const earliest = (first: IsoDate, second: IsoDate): IsoDate => (first < second ? first : second);
const latest = (first: IsoDate, second: IsoDate): IsoDate => (first > second ? first : second);

/**
 * A blank date counts as today, unless that would put the end before the start;
 * in that case it takes the other date of the range, making it a single day.
 */
export const fillEmptyDates = (range: DateRange, today: IsoDate): DateRange => {
  const start = range.start || (range.end ? earliest(today, range.end) : today);
  const end = range.end || latest(today, start);

  return { ...range, start, end };
};

/** An untouched range (both dates blank) covers the given term, when there is one. */
export const fillRangeDefaults = (
  range: DateRange,
  today: IsoDate,
  defaultTerm?: SchoolTerm,
): DateRange =>
  !range.start && !range.end && defaultTerm
    ? { ...range, start: defaultTerm.start, end: defaultTerm.end }
    : fillEmptyDates(range, today);

export const isCompleteRange = ({ start, end }: DateRange): boolean =>
  isIsoDate(start) && isIsoDate(end);

export const getRangeLength = ({ start, end }: DateRange): number => daysBetween(start, end) + 1;

export const isValidRange = (range: DateRange): boolean => {
  if (!isCompleteRange(range)) {
    return false;
  }

  const length = getRangeLength(range);
  return length >= 1 && length <= MAX_RANGE_DAYS;
};

/**
 * Every date inside the valid ranges that falls on one of the chosen weekdays,
 * sorted and without repetitions (ranges may overlap).
 */
export const buildLessonDates = ({ dateRanges, weekdays }: LessonDatesOptions): IsoDate[] => {
  const allowedWeekdays = new Set(weekdays);

  const dates = dateRanges
    .filter(isValidRange)
    .flatMap(({ start, end }) => eachDayOfRange(start, end))
    .filter((date) => allowedWeekdays.has(getWeekday(date)));

  return [...new Set(dates)].sort();
};

/** Removed by the calendar: a holiday or recess the teacher did not put back. */
export const isRemovedByCalendar = (
  date: IsoDate,
  { skipNoClassDays, restoredDates }: DateSelection,
  notes: CalendarNotes,
): boolean => skipNoClassDays && isNoClassDay(notes.get(date)) && !restoredDates.includes(date);

export const isSelectedDate = (
  date: IsoDate,
  selection: DateSelection,
  notes: CalendarNotes,
): boolean =>
  !selection.excludedDates.includes(date) && !isRemovedByCalendar(date, selection, notes);

export const selectLessonDates = (options: LessonDatesOptions & DateSelection): IsoDate[] => {
  const dates = buildLessonDates(options);
  const notes = getCalendarNotes(dates);
  return dates.filter((date) => isSelectedDate(date, options, notes));
};

const toggleItem = <T>(items: T[], item: T): T[] =>
  items.includes(item) ? items.filter((current) => current !== item) : [...items, item];

/**
 * Clicking a date: a holiday or recess taken out by the calendar is put back (or out again);
 * any other date is taken out (or put back) by hand.
 */
export const toggleLessonDate = (
  date: IsoDate,
  selection: DateSelection,
  notes: CalendarNotes,
): Partial<DateSelection> =>
  selection.skipNoClassDays && isNoClassDay(notes.get(date))
    ? { restoredDates: toggleItem(selection.restoredDates, date) }
    : { excludedDates: toggleItem(selection.excludedDates, date) };
