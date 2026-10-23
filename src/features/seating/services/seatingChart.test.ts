import { describe, expect, it } from 'vitest';

import {
  createSeatingChart,
  getDefaultSize,
  resizeSeatingChart,
  swapSeats,
  syncSeatingChart,
} from '@/features/seating/services/seatingChart';
import { createSeededRandom } from '@/lib/random/shuffle';

const names = ['Ana', 'Bruno', 'Carla', 'Davi', 'Érica'];

describe('createSeatingChart', () => {
  it('seats the students in order, leaving the other desks empty', () => {
    expect(createSeatingChart(names, { rows: 2, columns: 3, order: 'alphabetical' })).toEqual({
      rows: 2,
      columns: 3,
      seats: ['Ana', 'Bruno', 'Carla', 'Davi', 'Érica', null],
    });
  });

  it('can shuffle the students', () => {
    const chart = createSeatingChart(
      names,
      { rows: 2, columns: 3, order: 'random' },
      createSeededRandom(2),
    );

    expect(chart.seats.filter(Boolean).sort()).toEqual([...names].sort());
    expect(chart.seats).not.toEqual(['Ana', 'Bruno', 'Carla', 'Davi', 'Érica', null]);
  });
});

describe('getDefaultSize', () => {
  it('uses rows of 6 desks, enough for everyone', () => {
    expect(getDefaultSize(31)).toEqual({ rows: 6, columns: 6 });
    expect(getDefaultSize(0)).toEqual({ rows: 1, columns: 6 });
  });
});

describe('swapSeats', () => {
  it('swaps two desks, empty or not', () => {
    const chart = createSeatingChart(names, { rows: 2, columns: 3, order: 'alphabetical' });

    expect(swapSeats(chart, 0, 5).seats).toEqual([null, 'Bruno', 'Carla', 'Davi', 'Érica', 'Ana']);
    expect(swapSeats(chart, 0, 3).seats).toEqual(['Davi', 'Bruno', 'Carla', 'Ana', 'Érica', null]);
  });
});

describe('resizeSeatingChart', () => {
  it('keeps the students in reading order', () => {
    const chart = { rows: 2, columns: 2, seats: [null, 'Ana', 'Bruno', null] };

    expect(resizeSeatingChart(chart, { rows: 1, columns: 3 })).toEqual({
      rows: 1,
      columns: 3,
      seats: ['Ana', 'Bruno', null],
    });
  });
});

describe('syncSeatingChart', () => {
  it('frees the desks of students who left and seats the new ones', () => {
    const chart = { rows: 1, columns: 3, seats: ['Ana', 'Bruno', null] };

    expect(syncSeatingChart(chart, ['Bruno', 'Carla', 'Davi', 'Érica'])).toEqual({
      chart: { rows: 1, columns: 3, seats: ['Carla', 'Bruno', 'Davi'] },
      unseated: ['Érica'],
    });
  });

  it('keeps two students with the same name', () => {
    const chart = { rows: 1, columns: 2, seats: ['Ana', 'Ana'] };
    expect(syncSeatingChart(chart, ['Ana', 'Ana']).chart.seats).toEqual(['Ana', 'Ana']);
  });
});
