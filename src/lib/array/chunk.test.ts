import { describe, expect, it } from 'vitest';

import { chunk } from '@/lib/array/chunk';

describe('chunk', () => {
  it('splits items into groups of the given size, the last one with the remainder', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('returns an empty list for no items', () => {
    expect(chunk([], 3)).toEqual([]);
  });
});
