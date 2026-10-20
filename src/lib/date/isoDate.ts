import type { Weekday } from '@/lib/date/weekdays';

/** Calendar date in the `YYYY-MM-DD` format, the same used by `<input type="date">`. */
export type IsoDate = string;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const monthYearFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

// Every calculation runs in UTC so the user's time zone never shifts a date by one day.
const toUtcDate = (isoDate: IsoDate): Date => new Date(`${isoDate}T00:00:00Z`);

const toIsoDate = (date: Date): IsoDate => date.toISOString().slice(0, 10);

/** Today in the user's local time zone, unlike the other helpers, which ignore time zones. */
export const getTodayIsoDate = (): IsoDate => {
  const now = new Date();

  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, '0'))
    .join('-');
};

export const isIsoDate = (value: string): boolean =>
  ISO_DATE_PATTERN.test(value) && toIsoDate(toUtcDate(value)) === value;

export const daysBetween = (start: IsoDate, end: IsoDate): number =>
  Math.round((toUtcDate(end).getTime() - toUtcDate(start).getTime()) / MS_PER_DAY);

export const eachDayOfRange = (start: IsoDate, end: IsoDate): IsoDate[] => {
  const startTime = toUtcDate(start).getTime();
  const length = Math.max(daysBetween(start, end) + 1, 0);

  return Array.from({ length }, (_, offset) =>
    toIsoDate(new Date(startTime + offset * MS_PER_DAY)),
  );
};

export const getWeekday = (isoDate: IsoDate): Weekday => toUtcDate(isoDate).getUTCDay() as Weekday;

export const formatDayMonth = (isoDate: IsoDate): string =>
  `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`;

export const formatMonthYear = (isoDate: IsoDate): string =>
  monthYearFormatter.format(toUtcDate(isoDate));

/** Groups dates by `YYYY-MM`, keeping the original order. */
export const groupByMonth = (isoDates: IsoDate[]): Map<string, IsoDate[]> =>
  isoDates.reduce((groups, isoDate) => {
    const monthKey = isoDate.slice(0, 7);
    groups.set(monthKey, [...(groups.get(monthKey) ?? []), isoDate]);
    return groups;
  }, new Map<string, IsoDate[]>());
