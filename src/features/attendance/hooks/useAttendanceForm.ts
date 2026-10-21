import { nanoid } from '@reduxjs/toolkit';
import { useMemo, useState } from 'react';

import { DEFAULT_LESSON_COUNT, MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import { buildAttendanceSheetData } from '@/features/attendance/services/buildAttendanceSheetData';
import { buildLessonDates, fillEmptyDates } from '@/features/attendance/services/buildLessonDates';
import { validateAttendanceForm } from '@/features/attendance/services/validateAttendanceForm';
import type { AttendanceFormValues, DateRange } from '@/features/attendance/types';
import { INITIAL_CLASS_FORM_VALUES } from '@/features/classroom/services/classForm';
import type { IsoDate } from '@/lib/date/isoDate';
import { useToday } from '@/lib/date/useToday';
import { BUSINESS_DAYS, type Weekday } from '@/lib/date/weekdays';

type DateRangeChanges = Partial<Pick<DateRange, 'start' | 'end'>>;

const INITIAL_VALUES: AttendanceFormValues = {
  ...INITIAL_CLASS_FORM_VALUES,
  columnMode: 'dates',
  dateRanges: [{ id: 'initial-range', start: '', end: '' }],
  weekdays: BUSINESS_DAYS,
  excludedDates: [],
  lessonCount: DEFAULT_LESSON_COUNT,
};

const toggleItem = <T>(items: T[], item: T): T[] =>
  items.includes(item) ? items.filter((current) => current !== item) : [...items, item];

export const useAttendanceForm = () => {
  const [rawValues, setValues] = useState<AttendanceFormValues>(INITIAL_VALUES);
  const today = useToday();

  // What the teacher sees and what goes to the sheet: blank dates already count as today.
  const values = useMemo(
    () =>
      today
        ? {
            ...rawValues,
            dateRanges: rawValues.dateRanges.map((range) => fillEmptyDates(range, today)),
          }
        : rawValues,
    [rawValues, today],
  );

  const updateValues = (changes: Partial<AttendanceFormValues>) =>
    setValues((current) => ({ ...current, ...changes }));

  const addDateRange = () =>
    setValues((current) => ({
      ...current,
      dateRanges: [...current.dateRanges, { id: nanoid(), start: '', end: '' }],
    }));

  const updateDateRange = (id: string, changes: DateRangeChanges) =>
    setValues((current) => ({
      ...current,
      dateRanges: current.dateRanges.map((range) =>
        range.id === id ? { ...range, ...changes } : range,
      ),
    }));

  const removeDateRange = (id: string) =>
    setValues((current) => ({
      ...current,
      dateRanges: current.dateRanges.filter((range) => range.id !== id),
    }));

  const toggleWeekday = (weekday: Weekday) =>
    setValues((current) => ({ ...current, weekdays: toggleItem(current.weekdays, weekday) }));

  const toggleExcludedDate = (date: IsoDate) =>
    setValues((current) => ({
      ...current,
      excludedDates: toggleItem(current.excludedDates, date),
    }));

  const candidateDates = useMemo(() => buildLessonDates(values), [values]);
  const sheetData = useMemo(() => buildAttendanceSheetData(values), [values]);
  const errors = useMemo(() => validateAttendanceForm(values), [values]);
  const pageCount = Math.ceil(sheetData.columns.length / MAX_COLUMNS_PER_PAGE);

  return {
    values,
    updateValues,
    addDateRange,
    updateDateRange,
    removeDateRange,
    toggleWeekday,
    toggleExcludedDate,
    candidateDates,
    sheetData,
    errors,
    pageCount,
  };
};

export type AttendanceForm = ReturnType<typeof useAttendanceForm>;
