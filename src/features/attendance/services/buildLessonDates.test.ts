import { describe, expect, it } from 'vitest';

import {
  buildLessonDates,
  fillEmptyDates,
  fillRangeDefaults,
  isValidRange,
  selectLessonDates,
  toggleLessonDate,
} from '@/features/attendance/services/buildLessonDates';
import { getCalendarNotes } from '@/features/schoolCalendar/services/schoolCalendar';
import type { SchoolTerm } from '@/features/schoolCalendar/types';
import { ALL_WEEKDAYS, BUSINESS_DAYS } from '@/lib/date/weekdays';

// 2026-03-02 is a Monday.
const range = (start: string, end: string) => ({ id: `${start}-${end}`, start, end });

describe('buildLessonDates', () => {
  it('keeps only the selected weekdays', () => {
    const dates = buildLessonDates({
      dateRanges: [range('2026-03-02', '2026-03-08')],
      weekdays: BUSINESS_DAYS,
    });

    expect(dates).toEqual(['2026-03-02', '2026-03-03', '2026-03-04', '2026-03-05', '2026-03-06']);
  });

  it('supports specific weekdays, like lessons only on Monday and Wednesday', () => {
    const dates = buildLessonDates({
      dateRanges: [range('2026-03-02', '2026-03-15')],
      weekdays: [1, 3],
    });

    expect(dates).toEqual(['2026-03-02', '2026-03-04', '2026-03-09', '2026-03-11']);
  });

  it('merges several ranges, sorting them and removing overlaps', () => {
    const dates = buildLessonDates({
      dateRanges: [
        range('2026-03-10', '2026-03-11'),
        range('2026-03-02', '2026-03-03'),
        range('2026-03-11', '2026-03-12'),
      ],
      weekdays: ALL_WEEKDAYS,
    });

    expect(dates).toEqual(['2026-03-02', '2026-03-03', '2026-03-10', '2026-03-11', '2026-03-12']);
  });

  it('ignores incomplete or inverted ranges', () => {
    const dates = buildLessonDates({
      dateRanges: [range('', '2026-03-03'), range('2026-03-05', '2026-03-04')],
      weekdays: ALL_WEEKDAYS,
    });

    expect(dates).toEqual([]);
  });
});

const selection = { excludedDates: [], skipNoClassDays: true, restoredDates: [] };

// 2026-10-12 (Monday) is a holiday; 2026-10-16 (Friday) is a movable school day.
const octoberWeek = { dateRanges: [range('2026-10-12', '2026-10-16')], weekdays: BUSINESS_DAYS };

describe('selectLessonDates', () => {
  it('removes the dates the teacher took out', () => {
    const dates = selectLessonDates({
      dateRanges: [range('2026-03-02', '2026-03-04')],
      weekdays: ALL_WEEKDAYS,
      ...selection,
      excludedDates: ['2026-03-03'],
    });

    expect(dates).toEqual(['2026-03-02', '2026-03-04']);
  });

  it('removes holidays and recesses, but keeps movable school days', () => {
    expect(selectLessonDates({ ...octoberWeek, ...selection })).toEqual([
      '2026-10-13',
      '2026-10-14',
      '2026-10-16',
    ]);
  });

  it('keeps a holiday the teacher put back', () => {
    const dates = selectLessonDates({
      ...octoberWeek,
      ...selection,
      restoredDates: ['2026-10-12'],
    });

    expect(dates).toContain('2026-10-12');
  });

  it('keeps every date when the calendar is turned off', () => {
    expect(
      selectLessonDates({ ...octoberWeek, ...selection, skipNoClassDays: false }),
    ).toHaveLength(5);
  });
});

describe('toggleLessonDate', () => {
  const notes = getCalendarNotes(['2026-10-12']);

  it('puts back a holiday taken out by the calendar', () => {
    expect(toggleLessonDate('2026-10-12', selection, notes)).toEqual({
      restoredDates: ['2026-10-12'],
    });
  });

  it('takes out a regular date by hand', () => {
    expect(toggleLessonDate('2026-10-13', selection, notes)).toEqual({
      excludedDates: ['2026-10-13'],
    });
  });

  it('treats holidays as regular dates when the calendar is turned off', () => {
    expect(toggleLessonDate('2026-10-12', { ...selection, skipNoClassDays: false }, notes)).toEqual(
      { excludedDates: ['2026-10-12'] },
    );
  });
});

describe('fillRangeDefaults', () => {
  const term: SchoolTerm = { term: 4, start: '2026-10-06', end: '2026-12-21', schoolDays: 50 };

  it('fills an untouched range with the term', () => {
    expect(fillRangeDefaults(range('', ''), '2026-10-23', term)).toMatchObject({
      start: '2026-10-06',
      end: '2026-12-21',
    });
  });

  it('keeps the dates the teacher chose', () => {
    expect(fillRangeDefaults(range('2026-11-02', ''), '2026-10-23', term)).toMatchObject({
      start: '2026-11-02',
      end: '2026-11-02',
    });
  });

  it('falls back to today without a term', () => {
    expect(fillRangeDefaults(range('', ''), '2026-10-23')).toMatchObject({
      start: '2026-10-23',
      end: '2026-10-23',
    });
  });
});

describe('fillEmptyDates', () => {
  const today = '2026-03-10';

  it('uses today for both dates of an untouched range', () => {
    expect(fillEmptyDates(range('', ''), today)).toMatchObject({ start: today, end: today });
  });

  it('ends today when only a past start was chosen', () => {
    expect(fillEmptyDates(range('2026-03-02', ''), today)).toMatchObject({
      start: '2026-03-02',
      end: today,
    });
  });

  it('becomes a single day when only a future start was chosen', () => {
    expect(fillEmptyDates(range('2026-03-20', ''), today)).toMatchObject({
      start: '2026-03-20',
      end: '2026-03-20',
    });
  });

  it('starts today when only a future end was chosen', () => {
    expect(fillEmptyDates(range('', '2026-03-20'), today)).toMatchObject({
      start: today,
      end: '2026-03-20',
    });
  });

  it('becomes a single day when only a past end was chosen', () => {
    expect(fillEmptyDates(range('', '2026-03-02'), today)).toMatchObject({
      start: '2026-03-02',
      end: '2026-03-02',
    });
  });

  it('keeps ranges that are already filled', () => {
    expect(fillEmptyDates(range('2026-03-02', '2026-03-05'), today)).toMatchObject({
      start: '2026-03-02',
      end: '2026-03-05',
    });
  });
});

describe('isValidRange', () => {
  it('accepts ranges of up to one year', () => {
    expect(isValidRange(range('2026-01-01', '2026-12-31'))).toBe(true);
    expect(isValidRange(range('2026-01-01', '2027-01-03'))).toBe(false);
  });
});
