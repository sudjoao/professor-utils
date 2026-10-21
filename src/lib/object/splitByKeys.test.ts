import { describe, expect, it } from 'vitest';

import { hasEntries, splitByKeys } from '@/lib/object/splitByKeys';

describe('splitByKeys', () => {
  it('separates the chosen keys from the others', () => {
    expect(splitByKeys({ name: '7º A', term: 2, city: 'Gama' }, ['name', 'city'])).toEqual([
      { name: '7º A', city: 'Gama' },
      { term: 2 },
    ]);
  });

  it('returns empty objects when nothing matches', () => {
    expect(splitByKeys({ term: 2 } as { term: number; name?: string }, ['name'])).toEqual([
      {},
      { term: 2 },
    ]);
  });
});

describe('hasEntries', () => {
  it('tells whether an object has any key', () => {
    expect(hasEntries({})).toBe(false);
    expect(hasEntries({ term: 2 })).toBe(true);
  });
});
