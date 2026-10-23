import { describe, expect, it } from 'vitest';

import { getEasterDate, getHolidays } from '@/features/schoolCalendar/services/holidays';

describe('getEasterDate', () => {
  it('finds Easter Sunday', () => {
    expect(getEasterDate(2025)).toBe('2025-04-20');
    expect(getEasterDate(2026)).toBe('2026-04-05');
    expect(getEasterDate(2027)).toBe('2027-03-28');
  });
});

describe('getHolidays', () => {
  it('matches the holidays of the 2026 SEEDF calendar', () => {
    expect(getHolidays(2026).map(({ date }) => date)).toEqual([
      '2026-01-01',
      '2026-02-17',
      '2026-04-03',
      '2026-04-21',
      '2026-05-01',
      '2026-06-04',
      '2026-09-07',
      '2026-10-12',
      '2026-10-15',
      '2026-11-02',
      '2026-11-15',
      '2026-11-20',
      '2026-11-30',
      '2026-12-25',
    ]);
  });

  it('moves Carnaval, Paixão de Cristo and Corpus Christi with Easter', () => {
    const holidays = getHolidays(2027);

    expect(holidays).toContainEqual({ date: '2027-02-09', kind: 'holiday', label: 'Carnaval' });
    expect(holidays).toContainEqual({
      date: '2027-03-26',
      kind: 'holiday',
      label: 'Paixão de Cristo',
    });
    expect(holidays).toContainEqual({
      date: '2027-05-27',
      kind: 'holiday',
      label: 'Corpus Christi',
    });
  });
});
