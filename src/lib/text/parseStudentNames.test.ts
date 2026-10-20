import { describe, expect, it } from 'vitest';

import { parseStudentNames } from '@/lib/text/parseStudentNames';

describe('parseStudentNames', () => {
  it('returns one name per line', () => {
    expect(parseStudentNames('Ana Souza\nBruno Lima\r\nCarla Dias')).toEqual([
      'Ana Souza',
      'Bruno Lima',
      'Carla Dias',
    ]);
  });

  it('trims names and collapses inner whitespace', () => {
    expect(parseStudentNames('   Ana    Souza  \n\tBruno Lima')).toEqual([
      'Ana Souza',
      'Bruno Lima',
    ]);
  });

  it('ignores blank lines', () => {
    expect(parseStudentNames('\nAna Souza\n   \n\nBruno Lima\n')).toEqual([
      'Ana Souza',
      'Bruno Lima',
    ]);
  });

  it('keeps students that share the same name', () => {
    expect(parseStudentNames('Ana Souza\nAna Souza')).toEqual(['Ana Souza', 'Ana Souza']);
  });

  it('returns an empty list for empty input', () => {
    expect(parseStudentNames('')).toEqual([]);
  });
});
