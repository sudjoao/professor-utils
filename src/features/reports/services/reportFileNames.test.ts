import { describe, expect, it } from 'vitest';

import { getStudentReportFileName } from '@/features/reports/services/reportFileNames';

describe('getStudentReportFileName', () => {
  it('keeps the class order and the readable name', () => {
    expect(getStudentReportFileName(0, 'ANA SOUZA', 2)).toBe(
      '01 - ANA SOUZA - RAv 2º bimestre.docx',
    );
    expect(getStudentReportFileName(11, 'Bruno Lima', 4)).toBe(
      '12 - Bruno Lima - RAv 4º bimestre.docx',
    );
  });

  it('removes characters that Windows does not accept', () => {
    expect(getStudentReportFileName(0, 'Ana / Souza: "A"', 1)).toBe(
      '01 - Ana Souza A - RAv 1º bimestre.docx',
    );
  });
});
