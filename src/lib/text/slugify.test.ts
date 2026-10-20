import { describe, expect, it } from 'vitest';

import { slugify } from '@/lib/text/slugify';

describe('slugify', () => {
  it('removes accents, lowercases and joins words with hyphens', () => {
    expect(slugify('  7º Ano – Matemática ')).toBe('7o-ano-matematica');
  });

  it('returns an empty string when there is nothing alphanumeric', () => {
    expect(slugify(' -- ')).toBe('');
  });
});
