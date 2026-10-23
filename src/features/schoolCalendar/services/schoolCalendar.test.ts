import { describe, expect, it } from 'vitest';

import { SEEDF_CALENDARS } from '@/features/schoolCalendar/constants';
import {
  findCurrentOrLastTerm,
  findCurrentOrNextTerm,
  findTermOfDate,
  getCalendarNotes,
  getSchoolTerm,
  isNoClassDay,
  summarizeCalendarNotes,
} from '@/features/schoolCalendar/services/schoolCalendar';
import { eachDayOfRange, getWeekday } from '@/lib/date/isoDate';
import { BUSINESS_DAYS } from '@/lib/date/weekdays';

describe('SEEDF_CALENDARS', () => {
  // Guards the copied data: weekdays minus holidays and recesses must give the official count.
  it.each(Object.entries(SEEDF_CALENDARS))(
    '%s: each term has its official school days',
    (_, calendar) => {
      calendar.terms.forEach(({ start, end, schoolDays }) => {
        const dates = eachDayOfRange(start, end);
        const notes = getCalendarNotes(dates);
        const count = dates.filter(
          (date) => BUSINESS_DAYS.includes(getWeekday(date)) && !isNoClassDay(notes.get(date)),
        ).length;

        expect(count).toBe(schoolDays);
      });
    },
  );
});

describe('getCalendarNotes', () => {
  const notes = getCalendarNotes(['2026-06-04', '2026-07-20']);

  it('marks holidays, recesses and movable school days', () => {
    expect(notes.get('2026-10-12')).toMatchObject({ kind: 'holiday' });
    expect(notes.get('2026-07-20')).toMatchObject({
      kind: 'recess',
      label: 'Recesso de meio de ano',
    });
    expect(notes.get('2026-10-16')).toMatchObject({ kind: 'movable' });
    expect(notes.get('2026-03-10')).toBeUndefined();
  });

  it('keeps the holiday name when it falls inside a recess', () => {
    expect(notes.get('2026-02-17')).toMatchObject({ kind: 'holiday', label: 'Carnaval' });
  });

  it('still knows the holidays of years without a school calendar', () => {
    expect(getCalendarNotes(['2027-01-10']).get('2027-11-02')).toMatchObject({ kind: 'holiday' });
  });
});

describe('isNoClassDay', () => {
  it('is true for holidays and recesses only', () => {
    expect(isNoClassDay({ date: '2026-10-12', kind: 'holiday', label: '' })).toBe(true);
    expect(isNoClassDay({ date: '2026-07-20', kind: 'recess', label: '' })).toBe(true);
    expect(isNoClassDay({ date: '2026-10-16', kind: 'movable', label: '' })).toBe(false);
    expect(isNoClassDay(undefined)).toBe(false);
  });
});

describe('terms', () => {
  it('finds the term of a date', () => {
    expect(findTermOfDate('2026-10-23')?.term).toBe(4);
    expect(findTermOfDate('2026-07-20')).toBeUndefined();
    expect(findTermOfDate('2027-03-01')).toBeUndefined();
  });

  it('gets a term of a known year', () => {
    expect(getSchoolTerm(2026, 3)).toMatchObject({ start: '2026-07-27', end: '2026-10-05' });
    expect(getSchoolTerm(2027, 1)).toBeUndefined();
  });
});

describe('findCurrentOrNextTerm / findCurrentOrLastTerm', () => {
  it('both give the term going on', () => {
    expect(findCurrentOrNextTerm('2026-03-10')?.term).toBe(1);
    expect(findCurrentOrLastTerm('2026-03-10')?.term).toBe(1);
  });

  it('during a recess, give the next or the last term', () => {
    expect(findCurrentOrNextTerm('2026-07-20')?.term).toBe(3);
    expect(findCurrentOrLastTerm('2026-07-20')?.term).toBe(2);
  });

  it('give nothing when the calendar is unknown', () => {
    expect(findCurrentOrNextTerm('2026-12-28')).toBeUndefined();
    expect(findCurrentOrLastTerm('2025-06-01')).toBeUndefined();
  });
});

describe('summarizeCalendarNotes', () => {
  it('merges consecutive dates with the same note and keeps the others', () => {
    const dates = ['2026-07-09', '2026-07-10', '2026-07-13', '2026-07-14', '2026-07-27'];
    const summaries = summarizeCalendarNotes(dates, getCalendarNotes(dates));

    expect(summaries).toEqual([
      {
        date: '2026-07-13',
        endDate: '2026-07-14',
        kind: 'recess',
        label: 'Recesso de meio de ano',
      },
    ]);
  });
});
