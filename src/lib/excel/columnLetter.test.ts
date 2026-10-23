import { describe, expect, it } from 'vitest';

import { columnLetter } from '@/lib/excel/columnLetter';

describe('columnLetter', () => {
  it('converts column numbers to letters', () => {
    expect(columnLetter(1)).toBe('A');
    expect(columnLetter(26)).toBe('Z');
    expect(columnLetter(27)).toBe('AA');
    expect(columnLetter(52)).toBe('AZ');
    expect(columnLetter(703)).toBe('AAA');
  });
});
