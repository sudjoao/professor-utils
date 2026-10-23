import { nanoid } from '@reduxjs/toolkit';
import { useMemo, useState } from 'react';

import { DEFAULT_LESSON_COUNT, MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import { buildAttendanceSheetData } from '@/features/attendance/services/buildAttendanceSheetData';
import {
  buildLessonDates,
  fillRangeDefaults,
  toggleLessonDate,
} from '@/features/attendance/services/buildLessonDates';
import { validateAttendanceForm } from '@/features/attendance/services/validateAttendanceForm';
import type { AttendanceFormValues, DateRange } from '@/features/attendance/types';
import { useClassDraft } from '@/features/classroom/hooks/useClassDraft';
import { useSheetStyle } from '@/features/classroom/hooks/useSheetStyle';
import type { ClassFormValues } from '@/features/classroom/types';
import {
  findCurrentOrNextTerm,
  getCalendarNotes,
  getSchoolCalendar,
} from '@/features/schoolCalendar/services/schoolCalendar';
import type { SchoolTerm } from '@/features/schoolCalendar/types';
import type { IsoDate } from '@/lib/date/isoDate';
import { useToday } from '@/lib/date/useToday';
import { BUSINESS_DAYS, type Weekday } from '@/lib/date/weekdays';

type DateRangeChanges = Partial<Pick<DateRange, 'start' | 'end'>>;

/** What only this form uses; the class and students come from the shared draft. */
type LessonValues = Omit<AttendanceFormValues, keyof ClassFormValues>;

const INITIAL_VALUES: LessonValues = {
  columnMode: 'dates',
  dateRanges: [{ id: 'initial-range', start: '', end: '' }],
  weekdays: BUSINESS_DAYS,
  excludedDates: [],
  skipNoClassDays: true,
  restoredDates: [],
  lessonCount: DEFAULT_LESSON_COUNT,
  includeTotals: true,
  signatureTitle: '',
};

// An untouched range covers the current term (or today, when the year's calendar is unknown).
const fillRange = (range: DateRange, today: IsoDate | null, defaultTerm?: SchoolTerm): DateRange =>
  today ? fillRangeDefaults(range, today, defaultTerm) : range;

const toggleItem = <T>(items: T[], item: T): T[] =>
  items.includes(item) ? items.filter((current) => current !== item) : [...items, item];

export const useAttendanceForm = () => {
  const { classDraft, splitChanges } = useClassDraft();
  const sheetStyle = useSheetStyle();
  const [lessonValues, setValues] = useState<LessonValues>(INITIAL_VALUES);
  const today = useToday();
  const defaultTerm = today ? findCurrentOrNextTerm(today) : undefined;
  const schoolTerms = today ? (getSchoolCalendar(Number(today.slice(0, 4)))?.terms ?? []) : [];

  // What the teacher sees and what goes to the sheet: blank dates already filled in.
  const values = useMemo<AttendanceFormValues>(
    () => ({
      ...classDraft,
      ...lessonValues,
      dateRanges: lessonValues.dateRanges.map((range) => fillRange(range, today, defaultTerm)),
    }),
    [classDraft, lessonValues, today, defaultTerm],
  );

  const updateValues = (changes: Partial<AttendanceFormValues>) => {
    const lessonChanges = splitChanges(changes);
    setValues((current) => ({ ...current, ...lessonChanges }));
  };

  const addDateRange = () =>
    setValues((current) => ({
      ...current,
      dateRanges: [...current.dateRanges, { id: nanoid(), start: '', end: '' }],
    }));

  const updateDateRange = (id: string, changes: DateRangeChanges) =>
    setValues((current) => ({
      ...current,
      // Starts from the dates on screen, so changing one keeps the other suggested date.
      dateRanges: current.dateRanges.map((range) =>
        range.id === id ? { ...fillRange(range, today, defaultTerm), ...changes } : range,
      ),
    }));

  const removeDateRange = (id: string) =>
    setValues((current) => ({
      ...current,
      dateRanges: current.dateRanges.filter((range) => range.id !== id),
    }));

  const toggleWeekday = (weekday: Weekday) =>
    setValues((current) => ({ ...current, weekdays: toggleItem(current.weekdays, weekday) }));

  const applyTerm = ({ start, end }: SchoolTerm) =>
    setValues((current) => ({ ...current, dateRanges: [{ id: nanoid(), start, end }] }));

  const candidateDates = useMemo(() => buildLessonDates(values), [values]);
  const calendarNotes = useMemo(() => getCalendarNotes(candidateDates), [candidateDates]);

  const toggleDate = (date: IsoDate) =>
    setValues((current) => ({ ...current, ...toggleLessonDate(date, current, calendarNotes) }));

  const resetDates = () =>
    setValues((current) => ({ ...current, excludedDates: [], restoredDates: [] }));

  const sheetData = useMemo(
    () => buildAttendanceSheetData(values, sheetStyle.style),
    [values, sheetStyle.style],
  );
  const errors = useMemo(() => validateAttendanceForm(values), [values]);
  const pageCount =
    values.columnMode === 'signature'
      ? 1
      : Math.max(Math.ceil(sheetData.columns.length / MAX_COLUMNS_PER_PAGE), 1);

  return {
    values,
    updateValues,
    addDateRange,
    updateDateRange,
    removeDateRange,
    toggleWeekday,
    toggleDate,
    resetDates,
    applyTerm,
    schoolTerms,
    currentTerm: defaultTerm,
    candidateDates,
    calendarNotes,
    sheetData,
    sheetStyle,
    errors,
    pageCount,
  };
};

export type AttendanceForm = ReturnType<typeof useAttendanceForm>;
