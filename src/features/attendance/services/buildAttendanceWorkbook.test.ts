import ExcelJS from 'exceljs';
import { describe, expect, it } from 'vitest';

import { MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import { buildAttendanceWorkbook } from '@/features/attendance/services/buildAttendanceWorkbook';
import { toNumberedColumns } from '@/features/attendance/services/buildAttendanceColumns';
import type { AttendanceSheetData } from '@/features/attendance/types';
import { buildSheetStyle } from '@/features/classroom/__fixtures__/sheetStyle';
import type { SheetStyle } from '@/features/classroom/types';

const buildSheetData = (
  columnsCount: number,
  style: SheetStyle = buildSheetStyle(),
  overrides: Partial<AttendanceSheetData> = {},
): AttendanceSheetData => ({
  mode: 'count',
  classInfo: { classroomName: '7º A', subject: 'Matemática', teacherName: 'Joana' },
  studentNames: ['Ana Souza', 'Bruno Lima', 'Carla Dias'],
  columns: toNumberedColumns(columnsCount),
  includeTotals: false,
  signatureTitle: '',
  style,
  ...overrides,
});

const fillColor = (cell: ExcelJS.Cell) =>
  cell.fill?.type === 'pattern' ? cell.fill.fgColor?.argb : undefined;

describe('buildAttendanceWorkbook', () => {
  it('creates a single landscape A4 page that fits the width', () => {
    const workbook = buildAttendanceWorkbook(buildSheetData(10));
    const [worksheet] = workbook.worksheets;

    expect(workbook.worksheets).toHaveLength(1);
    expect(worksheet.name).toBe('Página 1');
    expect(worksheet.pageSetup).toMatchObject({
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    });
  });

  it('writes the header info, students and lesson columns', () => {
    const [worksheet] = buildAttendanceWorkbook(buildSheetData(3)).worksheets;

    expect(worksheet.getCell('A1').value).toBe('Lista de chamada');
    expect(worksheet.getCell('A2').value).toBe(
      'Turma: 7º A     Disciplina: Matemática     Professor(a): Joana',
    );
    expect(worksheet.getCell('B3').value).toBe('Aluno(a)');
    expect(worksheet.getCell('C3').value).toBe('1');
    expect(worksheet.getCell('E3').value).toBe('3');
    expect(worksheet.getCell('A5').value).toBe(1);
    expect(worksheet.getCell('B6').value).toBe('Bruno Lima');
    expect(worksheet.columnCount).toBe(5);
  });

  it('moves the lessons that do not fit to new pages, repeating the students', () => {
    const workbook = buildAttendanceWorkbook(buildSheetData(MAX_COLUMNS_PER_PAGE + 5));
    const [firstPage, secondPage] = workbook.worksheets;

    expect(workbook.worksheets.map(({ name }) => name)).toEqual(['Página 1', 'Página 2']);
    expect(firstPage.getCell('A1').value).toBe('Lista de chamada (1/2)');
    expect(firstPage.columnCount).toBe(2 + MAX_COLUMNS_PER_PAGE);
    expect(secondPage.columnCount).toBe(2 + 5);
    expect(secondPage.getCell('C3').value).toBe(String(MAX_COLUMNS_PER_PAGE + 1));
    expect(secondPage.getCell('B5').value).toBe('Ana Souza');
  });

  it('paints the header and every other student row with the chosen palette', () => {
    const [worksheet] = buildAttendanceWorkbook(
      buildSheetData(3, buildSheetStyle({ paletteId: 'blue' })),
    ).worksheets;

    expect(fillColor(worksheet.getCell('B3'))).toBe('FFBFDBFE');
    expect(fillColor(worksheet.getCell('C4'))).toBe('FFBFDBFE');
    expect(fillColor(worksheet.getCell('B5'))).toBeUndefined();
    expect(fillColor(worksheet.getCell('B6'))).toBe('FFDBEAFE');
  });

  it('leaves student rows white when stripes are off', () => {
    const [worksheet] = buildAttendanceWorkbook(
      buildSheetData(3, buildSheetStyle({ stripes: false })),
    ).worksheets;

    expect(fillColor(worksheet.getCell('B6'))).toBeUndefined();
  });

  it('uses bigger letters and rows when the large size is chosen', () => {
    const [worksheet] = buildAttendanceWorkbook(
      buildSheetData(3, buildSheetStyle({ fontSize: 'large' })),
    ).worksheets;

    expect(worksheet.getCell('B5').font.size).toBe(12);
    expect(worksheet.getRow(5).height).toBe(21.6);
  });

  it('adds absences and attendance columns on the last page, counting every page', () => {
    const workbook = buildAttendanceWorkbook(
      buildSheetData(MAX_COLUMNS_PER_PAGE + 5, buildSheetStyle(), { includeTotals: true }),
    );
    const [firstPage, lastPage] = workbook.worksheets;

    expect(firstPage.columnCount).toBe(2 + MAX_COLUMNS_PER_PAGE);
    expect(lastPage.columnCount).toBe(2 + 5 + 2);
    expect(lastPage.getCell('H3').value).toBe('Faltas');
    expect(lastPage.getCell('I3').value).toBe('Freq.');

    const absences = lastPage.getCell('H5').value as { formula: string };
    expect(absences.formula).toContain(`'Página 1'!C5:AA5`);
    expect(absences.formula).toContain(`'Página 2'!C5:G5`);
    expect((lastPage.getCell('I5').value as { formula: string }).formula).toContain('1-H5/');
    expect(lastPage.getCell('I5').numFmt).toBe('0%');
  });

  it('writes the legend below the students', () => {
    const [worksheet] = buildAttendanceWorkbook(buildSheetData(3)).worksheets;

    expect(String(worksheet.getCell('A9').value)).toContain('F = falta');
  });

  it('builds a signature sheet with one wide column', () => {
    const workbook = buildAttendanceWorkbook(
      buildSheetData(0, buildSheetStyle(), {
        mode: 'signature',
        columns: [],
        signatureTitle: 'Reunião de pais',
      }),
    );
    const [worksheet] = workbook.worksheets;

    expect(worksheet.name).toBe('Assinaturas');
    expect(worksheet.getCell('A1').value).toBe('Reunião de pais');
    expect(worksheet.getCell('C3').value).toBe('Assinatura');
    expect(worksheet.getCell('B4').value).toBe('Ana Souza');
    expect(worksheet.getRow(4).height).toBe(30);
    expect(worksheet.pageSetup.orientation).toBe('portrait');
  });

  it('generates a valid xlsx file', async () => {
    const buffer = await buildAttendanceWorkbook(
      buildSheetData(30, buildSheetStyle(), { includeTotals: true }),
    ).xlsx.writeBuffer();
    const reloaded = new ExcelJS.Workbook();
    await reloaded.xlsx.load(buffer);

    expect(reloaded.worksheets).toHaveLength(2);
    expect(reloaded.worksheets[0].pageSetup.orientation).toBe('landscape');
  });
});
