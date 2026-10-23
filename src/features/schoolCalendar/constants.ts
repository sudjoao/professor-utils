import type { SchoolCalendar } from '@/features/schoolCalendar/types';

/**
 * School calendars of the SEEDF public network, copied from the official calendar.
 * Holidays are not listed here: they are calculated for any year (see `holidays.ts`).
 * To add a year, copy its terms, recesses and movable days; the test checks the day counts.
 */
export const SEEDF_CALENDARS: Record<number, SchoolCalendar> = {
  2026: {
    source: 'Calendário escolar 2026 da SEEDF',
    terms: [
      { term: 1, start: '2026-02-12', end: '2026-04-29', schoolDays: 50 },
      { term: 2, start: '2026-04-30', end: '2026-07-10', schoolDays: 50 },
      { term: 3, start: '2026-07-27', end: '2026-10-05', schoolDays: 50 },
      { term: 4, start: '2026-10-06', end: '2026-12-21', schoolDays: 50 },
    ],
    recesses: [
      { start: '2026-01-02', end: '2026-01-07', label: 'Recesso escolar' },
      { start: '2026-02-16', end: '2026-02-18', label: 'Recesso de Carnaval' },
      { start: '2026-07-11', end: '2026-07-26', label: 'Recesso de meio de ano' },
      { start: '2026-12-23', end: '2026-12-24', label: 'Recesso escolar' },
      { start: '2026-12-26', end: '2026-12-31', label: 'Recesso escolar' },
    ],
    movableDays: ['2026-04-20', '2026-06-05', '2026-10-16', '2026-10-28'],
  },
};
