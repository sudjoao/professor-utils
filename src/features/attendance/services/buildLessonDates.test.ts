import { describe, expect, it } from 'vitest';

import {
  buildLessonDates,
  fillEmptyDates,
  isValidRange,
  selectLessonDates,
} from '@/features/attendance/services/buildLessonDates';
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

describe('selectLessonDates', () => {
  it('removes the excluded dates, like holidays', () => {
    const dates = selectLessonDates({
      dateRanges: [range('2026-03-02', '2026-03-04')],
      weekdays: ALL_WEEKDAYS,
      excludedDates: ['2026-03-03'],
    });

    expect(dates).toEqual(['2026-03-02', '2026-03-04']);
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
