import { describe, expect, it } from 'vitest';

import { buildReportValues } from '@/features/reports/__fixtures__/reportValues';
import { validateReportForm } from '@/features/reports/services/validateReportForm';

describe('validateReportForm', () => {
  it('accepts a complete form', () => {
    expect(validateReportForm(buildReportValues())).toEqual([]);
  });

  it('points each missing field separately', () => {
    const errors = validateReportForm(buildReportValues({ schoolName: ' ', city: '' }));

    expect(errors).toEqual([
      { field: 'schoolName', message: 'Preencha o campo "Unidade Escolar".' },
      { field: 'city', message: 'Preencha o campo "Local".' },
    ]);
  });

  it('checks the school year, school days and document date', () => {
    const errors = validateReportForm(
      buildReportValues({ schoolYear: '26', schoolDays: 0, documentDate: '' }),
    );

    expect(errors.map(({ field }) => field)).toEqual(['schoolYear', 'schoolDays', 'documentDate']);
  });

  it('requires at least one student', () => {
    expect(validateReportForm(buildReportValues({ studentsText: '' }))).toEqual([
      { field: 'studentsText', message: 'Escreva o nome de pelo menos um aluno.' },
    ]);
  });
});
