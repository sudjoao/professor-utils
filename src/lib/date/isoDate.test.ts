import { describe, expect, it } from 'vitest';

import {
  daysBetween,
  eachDayOfRange,
  formatDayMonth,
  formatLongDate,
  formatMonthYear,
  getWeekday,
  groupByMonth,
  isIsoDate,
} from '@/lib/date/isoDate';

describe('isIsoDate', () => {
  it('accepts valid calendar dates', () => {
    expect(isIsoDate('2026-03-02')).toBe(true);
    expect(isIsoDate('2028-02-29')).toBe(true);
  });

  it('rejects empty, malformed and impossible dates', () => {
    expect(isIsoDate('')).toBe(false);
    expect(isIsoDate('02/03/2026')).toBe(false);
    expect(isIsoDate('2026-02-30')).toBe(false);
  });
});

describe('eachDayOfRange', () => {
  it('includes both ends of the range', () => {
    expect(eachDayOfRange('2026-02-27', '2026-03-02')).toEqual([
      '2026-02-27',
      '2026-02-28',
      '2026-03-01',
      '2026-03-02',
    ]);
  });

  it('returns a single day when start and end are equal', () => {
    expect(eachDayOfRange('2026-03-02', '2026-03-02')).toEqual(['2026-03-02']);
  });

  it('returns nothing when the end is before the start', () => {
    expect(eachDayOfRange('2026-03-02', '2026-03-01')).toEqual([]);
  });
});

describe('date helpers', () => {
  it('counts days between dates across daylight saving changes', () => {
    expect(daysBetween('2026-10-01', '2026-11-01')).toBe(31);
  });

  it('returns the weekday of a date', () => {
    expect(getWeekday('2026-03-02')).toBe(1);
    expect(getWeekday('2026-03-08')).toBe(0);
  });

  it('formats dates in pt-BR', () => {
    expect(formatDayMonth('2026-03-02')).toBe('02/03');
    expect(formatMonthYear('2026-03-02')).toBe('março de 2026');
    expect(formatLongDate('2022-04-28')).toBe('28 de abril de 2022');
    expect(formatLongDate('2022-05-01')).toBe('1 de maio de 2022');
  });

  it('groups dates by month', () => {
    expect([...groupByMonth(['2026-03-30', '2026-03-31', '2026-04-01'])]).toEqual([
      ['2026-03', ['2026-03-30', '2026-03-31']],
      ['2026-04', ['2026-04-01']],
    ]);
  });
});
