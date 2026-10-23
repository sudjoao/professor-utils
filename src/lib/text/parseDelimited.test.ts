import { describe, expect, it } from 'vitest';

import { parseDelimited } from '@/lib/text/parseDelimited';

describe('parseDelimited', () => {
  it('splits cells pasted from Excel (tabs)', () => {
    expect(parseDelimited('1\tAna Souza\n2\tBruno Lima\n')).toEqual([
      ['1', 'Ana Souza'],
      ['2', 'Bruno Lima'],
    ]);
  });

  it('detects semicolons, the Brazilian CSV default', () => {
    expect(parseDelimited('Nº;Nome\r\n1;Ana Souza')).toEqual([
      ['Nº', 'Nome'],
      ['1', 'Ana Souza'],
    ]);
  });

  it('keeps commas inside quotes', () => {
    expect(parseDelimited('1,"Souza, Ana"\n2,"Lima, Bruno"')).toEqual([
      ['1', 'Souza, Ana'],
      ['2', 'Lima, Bruno'],
    ]);
  });

  it('returns one cell per line when there is no delimiter', () => {
    expect(parseDelimited('Ana Souza\n\nBruno Lima')).toEqual([['Ana Souza'], ['Bruno Lima']]);
  });

  it('only splits by the allowed delimiters', () => {
    expect(parseDelimited('Souza, Ana\nLima, Bruno', ['\t'])).toEqual([
      ['Souza, Ana'],
      ['Lima, Bruno'],
    ]);
  });
});
