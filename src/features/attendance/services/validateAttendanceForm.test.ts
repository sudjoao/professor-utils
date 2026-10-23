import { describe, expect, it } from 'vitest';

import { buildSheetStyle } from '@/features/classroom/__fixtures__/sheetStyle';
import { MAX_LESSON_COLUMNS } from '@/features/attendance/constants';
import { buildAttendanceSheetData } from '@/features/attendance/services/buildAttendanceSheetData';
import { validateAttendanceForm } from '@/features/attendance/services/validateAttendanceForm';
import type { AttendanceFormValues } from '@/features/attendance/types';
import { BUSINESS_DAYS } from '@/lib/date/weekdays';

const buildValues = (overrides: Partial<AttendanceFormValues> = {}): AttendanceFormValues => ({
  classroomName: ' 7º A ',
  subject: '',
  teacherName: '',
  studentsText: 'Carla Dias\nana souza\nBruno Lima',
  sortStudents: true,
  columnMode: 'dates',
  dateRanges: [{ id: '1', start: '2026-03-02', end: '2026-03-08' }],
  weekdays: BUSINESS_DAYS,
  excludedDates: [],
  skipNoClassDays: true,
  restoredDates: [],
  lessonCount: 10,
  includeTotals: true,
  signatureTitle: '',
  ...overrides,
});

describe('buildAttendanceSheetData', () => {
  it('sorts the students and trims the class info', () => {
    const data = buildAttendanceSheetData(buildValues(), buildSheetStyle());

    expect(data.studentNames).toEqual(['ana souza', 'Bruno Lima', 'Carla Dias']);
    expect(data.classInfo.classroomName).toBe('7º A');
  });

  it('creates one column per lesson date with weekday and day/month', () => {
    const { columns } = buildAttendanceSheetData(
      buildValues({ excludedDates: ['2026-03-03'] }),
      buildSheetStyle(),
    );

    expect(columns).toHaveLength(4);
    expect(columns[0]).toEqual({ label: 'seg', caption: '02/03' });
    expect(columns[1]).toEqual({ label: 'qua', caption: '04/03' });
  });

  it('creates numbered columns in count mode', () => {
    const { columns } = buildAttendanceSheetData(
      buildValues({ columnMode: 'count', lessonCount: 3 }),
      buildSheetStyle(),
    );

    expect(columns.map(({ label }) => label)).toEqual(['1', '2', '3']);
  });
});

const validationMessages = (values: AttendanceFormValues): string[] =>
  validateAttendanceForm(values).map(({ message }) => message);

describe('validateAttendanceForm', () => {
  it('accepts a complete form', () => {
    expect(validateAttendanceForm(buildValues())).toEqual([]);
  });

  it('requires at least one student', () => {
    expect(validateAttendanceForm(buildValues({ studentsText: '  \n ' }))).toEqual([
      { field: 'studentsText', message: 'Escreva o nome de pelo menos um aluno.' },
    ]);
  });

  it('reports incomplete and inverted ranges', () => {
    const errors = validationMessages(
      buildValues({
        dateRanges: [
          { id: '1', start: '2026-03-02', end: '' },
          { id: '2', start: '2026-03-10', end: '2026-03-09' },
        ],
      }),
    );

    expect(errors).toEqual([
      'Preencha as duas datas ("De" e "Até") de todos os períodos.',
      'Em cada período, a data "Até" precisa ser igual ou depois da data "De".',
    ]);
  });

  it('reports when no date matches the selected weekdays', () => {
    const errors = validateAttendanceForm(
      buildValues({ dateRanges: [{ id: '1', start: '2026-03-07', end: '2026-03-08' }] }),
    );

    expect(errors).toEqual([
      {
        field: 'dateRanges',
        message:
          'Nenhuma data de aula encontrada. Confira o período e os dias da semana escolhidos.',
      },
    ]);
  });

  it('requires at least one weekday', () => {
    expect(validateAttendanceForm(buildValues({ weekdays: [] }))).toEqual([
      { field: 'weekdays', message: 'Escolha pelo menos um dia da semana com aula.' },
    ]);
  });

  it('limits the lesson count', () => {
    const errors = validationMessages(
      buildValues({ columnMode: 'count', lessonCount: MAX_LESSON_COLUMNS + 1 }),
    );

    expect(errors).toEqual([
      `A quantidade de aulas precisa ser um número de 1 a ${MAX_LESSON_COLUMNS}.`,
    ]);
  });

  it('only needs students for a signature sheet', () => {
    expect(
      validateAttendanceForm(
        buildValues({ columnMode: 'signature', dateRanges: [], weekdays: [] }),
      ),
    ).toEqual([]);
  });
});
