import type { IsoDate } from '@/lib/date/isoDate';

export type TermNumber = 1 | 2 | 3 | 4;

export type SchoolTerm = {
  term: TermNumber;
  start: IsoDate;
  end: IsoDate;
  schoolDays: number;
};

/**
 * Why a date is special: `holiday` and `recess` have no classes;
 * a `movable` day is a school day the school may turn into a recess.
 */
export type CalendarNoteKind = 'holiday' | 'recess' | 'movable';

export type CalendarNote = {
  date: IsoDate;
  kind: CalendarNoteKind;
  label: string;
};

type DatePeriod = {
  start: IsoDate;
  end: IsoDate;
  label: string;
};

/** The official school calendar of one year: terms, recesses and movable school days. */
export type SchoolCalendar = {
  source: string;
  terms: SchoolTerm[];
  recesses: DatePeriod[];
  movableDays: IsoDate[];
};
