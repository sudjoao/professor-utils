import { SEEDF_CALENDARS } from '@/features/schoolCalendar/constants';
import { getHolidays } from '@/features/schoolCalendar/services/holidays';
import type {
  CalendarNote,
  SchoolCalendar,
  SchoolTerm,
  TermNumber,
} from '@/features/schoolCalendar/types';
import { eachDayOfRange, type IsoDate } from '@/lib/date/isoDate';

export const getSchoolCalendar = (year: number): SchoolCalendar | undefined =>
  SEEDF_CALENDARS[year];

export const getSchoolTerm = (year: number, term: TermNumber): SchoolTerm | undefined =>
  getSchoolCalendar(year)?.terms.find((schoolTerm) => schoolTerm.term === term);

const getTermsAround = (date: IsoDate): SchoolTerm[] => {
  const year = Number(date.slice(0, 4));
  return [year - 1, year, year + 1].flatMap((each) => getSchoolCalendar(each)?.terms ?? []);
};

/** The term a date belongs to; `undefined` in recesses or years without a known calendar. */
export const findTermOfDate = (date: IsoDate): SchoolTerm | undefined =>
  getTermsAround(date).find(({ start, end }) => date >= start && date <= end);

/** The term going on, or the next one during a recess: what a new attendance list is for. */
export const findCurrentOrNextTerm = (date: IsoDate): SchoolTerm | undefined =>
  getTermsAround(date).find(({ end }) => date <= end);

/** The term going on, or the one just finished during a recess: what a report is about. */
export const findCurrentOrLastTerm = (date: IsoDate): SchoolTerm | undefined =>
  getTermsAround(date).findLast(({ start }) => date >= start);

const getCalendarNotesOfYear = (year: number): CalendarNote[] => {
  const calendar = getSchoolCalendar(year);
  const recessDays: CalendarNote[] = (calendar?.recesses ?? []).flatMap(({ start, end, label }) =>
    eachDayOfRange(start, end).map((date) => ({ date, label, kind: 'recess' as const })),
  );
  const movableDays: CalendarNote[] = (calendar?.movableDays ?? []).map((date) => ({
    date,
    label: 'Dia letivo móvel',
    kind: 'movable' as const,
  }));

  // Later entries win, so a holiday inside a recess keeps the holiday name.
  return [...movableDays, ...recessDays, ...getHolidays(year)];
};

/** Holidays, recesses and movable school days of every year the dates touch, by date. */
export const getCalendarNotes = (dates: IsoDate[]): Map<IsoDate, CalendarNote> => {
  const years = [...new Set(dates.map((date) => Number(date.slice(0, 4))))];

  return new Map(years.flatMap(getCalendarNotesOfYear).map((note) => [note.date, note] as const));
};

export const isNoClassDay = (note: CalendarNote | undefined): boolean =>
  note !== undefined && note.kind !== 'movable';

type NoteSummary = CalendarNote & {
  /** Last date of a run of consecutive dates with the same note, e.g. a recess. */
  endDate: IsoDate;
};

/** The notes of the given dates, merging runs with the same label ("13/07 a 24/07 – Recesso"). */
export const summarizeCalendarNotes = (
  dates: IsoDate[],
  notes: Map<IsoDate, CalendarNote>,
): NoteSummary[] =>
  dates.reduce<NoteSummary[]>((summaries, date, index) => {
    const note = notes.get(date);
    const previous = summaries.at(-1);

    if (!note) {
      return summaries;
    }
    if (previous && previous.label === note.label && previous.endDate === dates[index - 1]) {
      previous.endDate = date;
      return summaries;
    }
    return [...summaries, { ...note, endDate: date }];
  }, []);
