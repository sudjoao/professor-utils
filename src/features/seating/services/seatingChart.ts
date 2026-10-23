import type { SeatingChart, SeatingOrder } from '@/features/seating/types';
import { type RandomSource, shuffle } from '@/lib/random/shuffle';

export const MAX_ROWS = 12;
export const MAX_COLUMNS = 12;
const DEFAULT_COLUMNS = 6;

/** A grid that fits the class: 6 desks per row, as many rows as needed. */
export const getDefaultSize = (studentCount: number) => ({
  columns: DEFAULT_COLUMNS,
  rows: Math.min(Math.max(Math.ceil(studentCount / DEFAULT_COLUMNS), 1), MAX_ROWS),
});

const fillSeats = (names: string[], seatCount: number): (string | null)[] =>
  Array.from({ length: seatCount }, (_, index) => names[index] ?? null);

export const createSeatingChart = (
  names: string[],
  { rows, columns, order }: { rows: number; columns: number; order: SeatingOrder },
  random: RandomSource = Math.random,
): SeatingChart => ({
  rows,
  columns,
  seats: fillSeats(order === 'random' ? shuffle(names, random) : names, rows * columns),
});

/** Changes the number of desks, keeping the students in reading order (front to back). */
export const resizeSeatingChart = (
  chart: SeatingChart,
  { rows, columns }: { rows: number; columns: number },
): SeatingChart => ({
  rows,
  columns,
  seats: fillSeats(
    chart.seats.filter((name): name is string => name !== null),
    rows * columns,
  ),
});

export const swapSeats = (chart: SeatingChart, first: number, second: number): SeatingChart => {
  const seats = [...chart.seats];
  [seats[first], seats[second]] = [seats[second], seats[first]];
  return { ...chart, seats };
};

/**
 * Brings the chart up to date with the class list: students who left free their desks and
 * new students take the first empty ones. Those without a desk come back in `unseated`.
 */
export const syncSeatingChart = (
  chart: SeatingChart,
  names: string[],
): { chart: SeatingChart; unseated: string[] } => {
  const remaining = [...names];
  const seats = chart.seats.map((name) => {
    const index = name === null ? -1 : remaining.indexOf(name);
    if (index === -1) {
      return null;
    }
    remaining.splice(index, 1);
    return name;
  });

  const newcomers = [...remaining];
  const filled = seats.map((name) => name ?? newcomers.shift() ?? null);

  return { chart: { ...chart, seats: filled }, unseated: newcomers };
};
