/**
 * Desks seen from the teacher: row 1 is the front, next to the board. `seats` lists the desks
 * row by row, left to right; `null` is an empty desk.
 */
export type SeatingChart = {
  rows: number;
  columns: number;
  seats: (string | null)[];
};

export type SeatingOrder = 'alphabetical' | 'random';
