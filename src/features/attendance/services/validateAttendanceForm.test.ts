import { describe, expect, it } from 'vitest';

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
  lessonCount: 10,
  ...overrides,
});

describe('buildAttendanceSheetData', () => {
  it('sorts students alphabetically ignoring case and trims the header', () => {
    const data = buildAttendanceSheetData(buildValues());

    expect(data.studentNames).toEqual(['ana souza', 'Bruno Lima', 'Carla Dias']);
    expect(data.header.classroomName).toBe('7º A');
  });

  it('keeps the typed order when sorting is off', () => {
    const data = buildAttendanceSheetData(buildValues({ sortStudents: false }));

    expect(data.studentNames).toEqual(['Carla Dias', 'ana souza', 'Bruno Lima']);
  });

  it('creates one column per lesson date with weekday and day/month', () => {
    const { columns } = buildAttendanceSheetData(buildValues({ excludedDates: ['2026-03-03'] }));

    expect(columns).toHaveLength(4);
    expect(columns[0]).toEqual({ label: 'seg', caption: '02/03' });
    expect(columns[1]).toEqual({ label: 'qua', caption: '04/03' });
  });

  it('creates numbered columns in count mode', () => {
    const { columns } = buildAttendanceSheetData(
      buildValues({ columnMode: 'count', lessonCount: 3 }),
    );

    expect(columns.map(({ label }) => label)).toEqual(['1', '2', '3']);
  });
});

describe('validateAttendanceForm', () => {
  it('accepts a complete form', () => {
    expect(validateAttendanceForm(buildValues())).toEqual([]);
  });

  it('requires at least one student', () => {
    expect(validateAttendanceForm(buildValues({ studentsText: '  \n ' }))).toEqual([
      'Informe pelo menos um aluno.',
    ]);
  });

  it('reports incomplete and inverted ranges', () => {
    const errors = validateAttendanceForm(
      buildValues({
        dateRanges: [
          { id: '1', start: '2026-03-02', end: '' },
          { id: '2', start: '2026-03-10', end: '2026-03-09' },
        ],
      }),
    );

    expect(errors).toEqual([
      'Preencha a data inicial e a data final de todos os períodos.',
      'A data final de cada período deve ser igual ou posterior à data inicial.',
    ]);
  });

  it('reports when no date matches the selected weekdays', () => {
    const errors = validateAttendanceForm(
      buildValues({ dateRanges: [{ id: '1', start: '2026-03-07', end: '2026-03-08' }] }),
    );

    expect(errors).toEqual(['Nenhuma data encontrada nos períodos e dias da semana selecionados.']);
  });

  it('requires at least one weekday', () => {
    expect(validateAttendanceForm(buildValues({ weekdays: [] }))).toEqual([
      'Selecione pelo menos um dia da semana.',
    ]);
  });

  it('limits the lesson count', () => {
    const errors = validateAttendanceForm(
      buildValues({ columnMode: 'count', lessonCount: MAX_LESSON_COLUMNS + 1 }),
    );

    expect(errors).toEqual([`Informe uma quantidade de aulas entre 1 e ${MAX_LESSON_COLUMNS}.`]);
  });
});
