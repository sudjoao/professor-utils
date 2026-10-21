import { describe, expect, it } from 'vitest';

import { slugify, toFileName } from '@/lib/text/slugify';

describe('slugify', () => {
  it('removes accents, lowercases and joins words with hyphens', () => {
    expect(slugify('  7º Ano – Matemática ')).toBe('7o-ano-matematica');
  });

  it('returns an empty string when there is nothing alphanumeric', () => {
    expect(slugify(' -- ')).toBe('');
  });
});

describe('toFileName', () => {
  it('joins the slug of each part', () => {
    expect(toFileName('Lista de notas', '7º A')).toBe('lista-de-notas-7o-a');
  });

  it('skips blank parts', () => {
    expect(toFileName('Lista de chamada', '  ')).toBe('lista-de-chamada');
  });
});
