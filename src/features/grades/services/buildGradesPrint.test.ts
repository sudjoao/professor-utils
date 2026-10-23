import { describe, expect, it } from 'vitest';

import { buildSheetStyle } from '@/features/classroom/__fixtures__/sheetStyle';
import { buildGradesPrint } from '@/features/grades/services/buildGradesPrint';
import type { GradesSheetData } from '@/features/grades/types';

const data: GradesSheetData = {
  classInfo: { classroomName: '7º A', subject: '', teacherName: '' },
  studentNames: ['Ana'],
  gradeTitles: ['Prova', 'Trabalho'],
  summary: 'average',
  maxGrade: 10,
  weights: [2, 1],
  includeRecovery: false,
  includeStatus: true,
  passingGrade: 6,
  style: buildSheetStyle(),
};

describe('buildGradesPrint', () => {
  it('prints the grades and calculated columns, with the weights row', () => {
    const [page] = buildGradesPrint(data).pages;

    expect(page.columns.map(({ label }) => label)).toEqual([
      'Prova',
      'Trabalho',
      'Média',
      'Situação',
    ]);
    expect(page.extraRow).toEqual({ label: 'Peso de cada nota', values: ['2', '1'] });
    expect(page.info).toContain('Média mínima: 6');
  });
});
