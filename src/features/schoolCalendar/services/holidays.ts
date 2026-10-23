import type { CalendarNote } from '@/features/schoolCalendar/types';
import { addDays, type IsoDate } from '@/lib/date/isoDate';

type FixedHoliday = {
  /** `MM-DD` */
  monthDay: string;
  label: string;
};

// National holidays, plus the ones of the Distrito Federal and the SEEDF school calendar.
const FIXED_HOLIDAYS: FixedHoliday[] = [
  { monthDay: '01-01', label: 'Confraternização Universal' },
  { monthDay: '04-21', label: 'Tiradentes / Aniversário de Brasília' },
  { monthDay: '05-01', label: 'Dia do Trabalho' },
  { monthDay: '09-07', label: 'Independência do Brasil' },
  { monthDay: '10-12', label: 'Nossa Senhora Aparecida' },
  { monthDay: '10-15', label: 'Dia do Professor' },
  { monthDay: '11-02', label: 'Finados' },
  { monthDay: '11-15', label: 'Proclamação da República' },
  { monthDay: '11-20', label: 'Consciência Negra' },
  { monthDay: '11-30', label: 'Dia do Evangélico' },
  { monthDay: '12-25', label: 'Natal' },
];

// Days counted from Easter Sunday.
const EASTER_HOLIDAYS: { offset: number; label: string }[] = [
  { offset: -47, label: 'Carnaval' },
  { offset: -2, label: 'Paixão de Cristo' },
  { offset: 60, label: 'Corpus Christi' },
];

/** Easter Sunday of a year (anonymous Gregorian algorithm). */
export const getEasterDate = (year: number): IsoDate => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/** Holidays without classes in the SEEDF network, sorted by date. */
export const getHolidays = (year: number): CalendarNote[] => {
  const easter = getEasterDate(year);

  return [
    ...FIXED_HOLIDAYS.map(({ monthDay, label }) => ({ date: `${year}-${monthDay}`, label })),
    ...EASTER_HOLIDAYS.map(({ offset, label }) => ({ date: addDays(easter, offset), label })),
  ]
    .map(({ date, label }) => ({ date, label, kind: 'holiday' as const }))
    .sort((first, second) => first.date.localeCompare(second.date));
};
