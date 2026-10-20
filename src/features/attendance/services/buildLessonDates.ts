import { MAX_RANGE_DAYS } from '@/features/attendance/constants';
import type { AttendanceFormValues, DateRange } from '@/features/attendance/types';
import {
  daysBetween,
  eachDayOfRange,
  getWeekday,
  isIsoDate,
  type IsoDate,
} from '@/lib/date/isoDate';

type LessonDatesOptions = Pick<AttendanceFormValues, 'dateRanges' | 'weekdays'>;

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

export const selectLessonDates = (
  options: LessonDatesOptions & Pick<AttendanceFormValues, 'excludedDates'>,
): IsoDate[] => {
  const excludedDates = new Set(options.excludedDates);
  return buildLessonDates(options).filter((date) => !excludedDates.has(date));
};
