import { describe, expect, it } from 'vitest';

import { buildSheetStyle } from '@/features/classroom/__fixtures__/sheetStyle';
import { MAX_GRADE_COLUMNS, MAX_GRADE_LIMIT } from '@/features/grades/constants';
import {
  buildGradesSheetData,
  getSummaryColumnTitle,
} from '@/features/grades/services/buildGradesSheetData';
import { validateGradesForm } from '@/features/grades/services/validateGradesForm';
import type { GradesFormValues } from '@/features/grades/types';

const buildValues = (overrides: Partial<GradesFormValues> = {}): GradesFormValues => ({
  classroomName: ' 7º A ',
  subject: 'Matemática',
  teacherName: '',
  studentsText: 'Carla Dias\nAna Souza',
  sortStudents: true,
  columnMode: 'count',
  gradeCount: 3,
  gradeTitlesText: '',
  summary: 'average',
  maxGrade: 10,
  ...overrides,
});

describe('buildGradesSheetData', () => {
  it('numbers the grades in count mode', () => {
    expect(buildGradesSheetData(buildValues(), buildSheetStyle()).gradeTitles).toEqual([
      'Nota 1',
      'Nota 2',
      'Nota 3',
    ]);
  });

  it('uses one title per line in titles mode', () => {
    const data = buildGradesSheetData(
      buildValues({ columnMode: 'titles', gradeTitlesText: ' Prova 1 \n\nTrabalho em grupo\n' }),
      buildSheetStyle(),
    );

    expect(data.gradeTitles).toEqual(['Prova 1', 'Trabalho em grupo']);
  });

  it('sorts students and trims the class info', () => {
    const data = buildGradesSheetData(buildValues(), buildSheetStyle());

    expect(data.studentNames).toEqual(['Ana Souza', 'Carla Dias']);
    expect(data.classInfo.classroomName).toBe('7º A');
  });
});

describe('getSummaryColumnTitle', () => {
  it('names the calculated column', () => {
    expect(getSummaryColumnTitle('average')).toBe('Média');
    expect(getSummaryColumnTitle('sum')).toBe('Total');
    expect(getSummaryColumnTitle('none')).toBeUndefined();
  });
});

const validationMessages = (values: GradesFormValues): string[] =>
  validateGradesForm(values).map(({ message }) => message);

describe('validateGradesForm', () => {
  it('accepts a complete form', () => {
    expect(validateGradesForm(buildValues())).toEqual([]);
  });

  it('requires at least one student', () => {
    expect(validateGradesForm(buildValues({ studentsText: '' }))).toEqual([
      { field: 'studentsText', message: 'Escreva o nome de pelo menos um aluno.' },
    ]);
  });

  it('limits the grade count', () => {
    expect(validateGradesForm(buildValues({ gradeCount: 0 }))).toEqual([
      {
        field: 'gradeCount',
        message: `A quantidade de notas precisa ser um número de 1 a ${MAX_GRADE_COLUMNS}.`,
      },
    ]);
  });

  it('requires at least one title in titles mode', () => {
    expect(
      validationMessages(buildValues({ columnMode: 'titles', gradeTitlesText: ' \n ' })),
    ).toEqual(['Escreva o nome de pelo menos uma nota.']);
  });

  it('limits the number of titles', () => {
    const gradeTitlesText = Array.from({ length: MAX_GRADE_COLUMNS + 1 }, (_, i) => `P${i}`).join(
      '\n',
    );

    expect(validationMessages(buildValues({ columnMode: 'titles', gradeTitlesText }))).toEqual([
      `A lista pode ter no máximo ${MAX_GRADE_COLUMNS} notas, mas você escreveu ${MAX_GRADE_COLUMNS + 1}.`,
    ]);
  });

  it('requires a positive max grade', () => {
    expect(validationMessages(buildValues({ maxGrade: 0 }))).toEqual([
      `A nota máxima precisa ser maior que 0 e no máximo ${MAX_GRADE_LIMIT}.`,
    ]);
  });
});
