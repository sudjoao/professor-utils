import ExcelJS from 'exceljs';
import { describe, expect, it } from 'vitest';

import { MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import { buildAttendanceWorkbook } from '@/features/attendance/services/buildAttendanceWorkbook';
import { toNumberedColumns } from '@/features/attendance/services/buildAttendanceColumns';
import type { AttendanceSheetData } from '@/features/attendance/types';

const buildSheetData = (columnsCount: number): AttendanceSheetData => ({
  classInfo: { classroomName: '7º A', subject: 'Matemática', teacherName: 'Joana' },
  studentNames: ['Ana Souza', 'Bruno Lima'],
  columns: toNumberedColumns(columnsCount),
});

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

  it('generates a valid xlsx file', async () => {
    const buffer = await buildAttendanceWorkbook(buildSheetData(30)).xlsx.writeBuffer();
    const reloaded = new ExcelJS.Workbook();
    await reloaded.xlsx.load(buffer);

    expect(reloaded.worksheets).toHaveLength(2);
    expect(reloaded.worksheets[0].pageSetup.orientation).toBe('landscape');
  });
});
