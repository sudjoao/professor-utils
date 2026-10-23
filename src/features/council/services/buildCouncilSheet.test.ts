import { describe, expect, it } from 'vitest';

import { buildSheetStyle } from '@/features/classroom/__fixtures__/sheetStyle';
import { INITIAL_CLASS_FORM_VALUES } from '@/features/classroom/services/classForm';
import { DEFAULT_COUNCIL_COLUMNS } from '@/features/council/constants';
import {
  buildCouncilPrint,
  buildCouncilSheetData,
  getCouncilColumns,
  validateCouncilForm,
} from '@/features/council/services/buildCouncilSheet';
import { buildCouncilWorkbook } from '@/features/council/services/buildCouncilWorkbook';
import type { CouncilFormValues } from '@/features/council/types';

const councilValues: CouncilFormValues = {
  term: 2,
  columns: DEFAULT_COUNCIL_COLUMNS,
  customColumnsText: 'Adequação curricular\n',
  tallRows: false,
};
const values = {
  ...INITIAL_CLASS_FORM_VALUES,
  ...councilValues,
  classroomName: '3º A',
  studentsText: 'Bruno\nAna',
};

describe('getCouncilColumns', () => {
  it('keeps the usual order and adds the teacher columns at the end', () => {
    expect(
      getCouncilColumns({ columns: ['learning', 'absences'], customColumnsText: 'Outro' }),
    ).toEqual([
      { title: 'Faltas', isText: false },
      { title: 'Aprendizagens', isText: true },
      { title: 'Outro', isText: true },
    ]);
  });
});

describe('validateCouncilForm', () => {
  it('needs students and at least one column', () => {
    const errors = validateCouncilForm({
      ...values,
      studentsText: '',
      columns: [],
      customColumnsText: '',
    });
    expect(errors.map(({ field }) => field)).toEqual(['studentsText', 'councilColumns']);
  });
});

describe('council sheet', () => {
  const data = buildCouncilSheetData(values, buildSheetStyle());

  it('prints text columns three times wider', () => {
    const [page] = buildCouncilPrint(data).pages;

    expect(page.info).toBe('Turma: 3º A     2º bimestre');
    expect(page.columns.map(({ weight }) => weight)).toEqual([1, 1, 3, 3, 3, 3]);
  });

  it('builds the spreadsheet with wide, wrapping text columns', () => {
    const [worksheet] = buildCouncilWorkbook(data).worksheets;

    expect(worksheet.getCell('A1').value).toBe('Ficha de conselho de classe');
    expect(worksheet.getCell('C3').value).toBe('Faltas');
    expect(worksheet.getCell('H3').value).toBe('Adequação curricular');
    expect(worksheet.getCell('B4').value).toBe('Ana');
    expect(worksheet.getColumn('E').width).toBe(32);
    expect(worksheet.getCell('E4').alignment).toMatchObject({ wrapText: true, vertical: 'top' });
    expect(worksheet.pageSetup.orientation).toBe('landscape');
  });
});
