import { describe, expect, it } from 'vitest';

import { parseLines } from '@/lib/text/parseLines';

describe('parseLines', () => {
  it('returns one item per line', () => {
    expect(parseLines('Ana Souza\nBruno Lima\r\nCarla Dias')).toEqual([
      'Ana Souza',
      'Bruno Lima',
      'Carla Dias',
    ]);
  });

  it('trims names and collapses inner whitespace', () => {
    expect(parseLines('   Ana    Souza  \n\tBruno Lima')).toEqual(['Ana Souza', 'Bruno Lima']);
  });

  it('ignores blank lines', () => {
    expect(parseLines('\nAna Souza\n   \n\nBruno Lima\n')).toEqual(['Ana Souza', 'Bruno Lima']);
  });

  it('keeps students that share the same name', () => {
    expect(parseLines('Ana Souza\nAna Souza')).toEqual(['Ana Souza', 'Ana Souza']);
  });

  it('returns an empty list for empty input', () => {
    expect(parseLines('')).toEqual([]);
  });
});
