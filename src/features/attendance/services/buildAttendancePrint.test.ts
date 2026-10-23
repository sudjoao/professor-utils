import { describe, expect, it } from 'vitest';

import { MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import { toNumberedColumns } from '@/features/attendance/services/buildAttendanceColumns';
import { buildAttendancePrint } from '@/features/attendance/services/buildAttendancePrint';
import type { AttendanceSheetData } from '@/features/attendance/types';
import { buildSheetStyle } from '@/features/classroom/__fixtures__/sheetStyle';

const buildData = (overrides: Partial<AttendanceSheetData> = {}): AttendanceSheetData => ({
  mode: 'count',
  classInfo: { classroomName: '7º A', subject: '', teacherName: '' },
  studentNames: ['Ana', 'Bruno'],
  columns: toNumberedColumns(MAX_COLUMNS_PER_PAGE + 3),
  includeTotals: true,
  signatureTitle: '',
  style: buildSheetStyle(),
  ...overrides,
});

describe('buildAttendancePrint', () => {
  it('splits the lessons in pages like the spreadsheet, totals on the last one', () => {
    const { pages, orientation } = buildAttendancePrint(buildData());

    expect(orientation).toBe('landscape');
    expect(pages.map(({ title }) => title)).toEqual([
      'Lista de chamada (1/2)',
      'Lista de chamada (2/2)',
    ]);
    expect(pages[0].columns).toHaveLength(MAX_COLUMNS_PER_PAGE);
    expect(pages[1].columns.map(({ label }) => label)).toEqual([
      '26',
      '27',
      '28',
      'Faltas',
      'Freq.',
    ]);
  });

  it('prints a signature sheet with one wide column and tall rows', () => {
    const sheet = buildAttendancePrint(buildData({ mode: 'signature', signatureTitle: 'Reunião' }));

    expect(sheet).toMatchObject({ orientation: 'portrait', tallRows: true });
    expect(sheet.pages[0]).toMatchObject({
      title: 'Reunião',
      columns: [{ label: 'Assinatura', weight: 3 }],
    });
  });
});
