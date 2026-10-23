import { describe, expect, it } from 'vitest';

import {
  buildAbsencesFormula,
  buildFrequencyFormula,
} from '@/features/attendance/services/attendanceFormulas';

const firstPage = { sheetName: 'Página 1', firstColumn: 'C', lastColumn: 'AA' };
const secondPage = { sheetName: 'Página 2', firstColumn: 'C', lastColumn: 'G' };

describe('buildAbsencesFormula', () => {
  it('counts F and J on every page', () => {
    expect(buildAbsencesFormula([firstPage, secondPage], 5)).toBe(
      `COUNTIF('Página 1'!C5:AA5,"F")+COUNTIF('Página 1'!C5:AA5,"J")+` +
        `COUNTIF('Página 2'!C5:G5,"F")+COUNTIF('Página 2'!C5:G5,"J")`,
    );
  });
});

describe('buildFrequencyFormula', () => {
  it('divides by the marked lessons, blank while nothing is marked', () => {
    expect(buildFrequencyFormula([firstPage], 7, 'AB7')).toBe(
      `IF((COUNTA('Página 1'!C7:AA7))=0,"",1-AB7/(COUNTA('Página 1'!C7:AA7)))`,
    );
  });
});
