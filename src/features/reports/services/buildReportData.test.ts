import { describe, expect, it } from 'vitest';

import { buildReportValues } from '@/features/reports/__fixtures__/reportValues';
import {
  buildEvaluationParagraphs,
  buildReportData,
} from '@/features/reports/services/buildReportData';

describe('buildEvaluationParagraphs', () => {
  it('returns no paragraphs when there is no common text', () => {
    expect(buildEvaluationParagraphs('  \n ', 'Ana')).toEqual([]);
  });

  it('keeps one paragraph per line, including blank lines between them', () => {
    expect(buildEvaluationParagraphs('\nPrimeiro.\n\nSegundo.  \n\n', 'Ana')).toEqual([
      'Primeiro.',
      '',
      'Segundo.',
    ]);
  });

  it('replaces every [ALUNO], in any case, with the student name', () => {
    expect(buildEvaluationParagraphs('[ALUNO] leu. Depois [aluno] escreveu.', 'Ana Souza')).toEqual(
      ['Ana Souza leu. Depois Ana Souza escreveu.'],
    );
  });
});

describe('buildReportData', () => {
  it('fills the document data, with names in capital letters and the long date', () => {
    const data = buildReportData(buildReportValues());

    expect(data.teacherName).toBe('SANDRA MARIA DOS SANTOS');
    expect(data.placeAndDate).toBe('Gama/DF, 11 de julho de 2022.');
    expect(data.students.map(({ name }) => name)).toEqual([
      'ALICE SOUSA SILVESTRE',
      'BERNARDO ANDRADE',
    ]);
  });

  it('writes the student name as typed inside the common text', () => {
    const data = buildReportData(buildReportValues({ commonText: '[ALUNO] participou.' }));

    expect(data.students[0].paragraphs).toEqual(['Alice Sousa Silvestre participou.']);
  });
});
