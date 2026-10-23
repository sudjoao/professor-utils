import { describe, expect, it } from 'vitest';

import { createSeededRandom, shuffle } from '@/lib/random/shuffle';

describe('shuffle', () => {
  it('keeps every item exactly once and does not change the original', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const shuffled = shuffle(items, createSeededRandom(1));

    expect([...shuffled].sort()).toEqual(items);
    expect(items).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('gives the same order for the same seed', () => {
    const items = [1, 2, 3, 4, 5, 6];
    expect(shuffle(items, createSeededRandom(7))).toEqual(shuffle(items, createSeededRandom(7)));
  });
});
