import ExcelJS from 'exceljs';
import { describe, expect, it } from 'vitest';

import { buildSheetStyle } from '@/features/classroom/__fixtures__/sheetStyle';
import { buildGradesWorkbook } from '@/features/grades/services/buildGradesWorkbook';
import type { GradesSheetData } from '@/features/grades/types';

const buildSheetData = (overrides: Partial<GradesSheetData> = {}): GradesSheetData => ({
  classInfo: { classroomName: '7º A', subject: 'Matemática', teacherName: 'Joana' },
  studentNames: ['Ana Souza', 'Bruno Lima'],
  gradeTitles: ['Prova 1', 'Prova 2', 'Trabalho'],
  summary: 'average',
  maxGrade: 10,
  weights: null,
  includeRecovery: false,
  includeStatus: false,
  passingGrade: 5,
  style: buildSheetStyle(),
  ...overrides,
});

describe('buildGradesWorkbook', () => {
  it('writes the header info, grade titles and students', () => {
    const [worksheet] = buildGradesWorkbook(buildSheetData()).worksheets;

    expect(worksheet.name).toBe('Notas');
    expect(worksheet.getCell('A1').value).toBe('Lista de notas');
    expect(worksheet.getCell('A2').value).toBe(
      'Turma: 7º A     Disciplina: Matemática     Professor(a): Joana     Nota máxima: 10',
    );
    expect(['B3', 'C3', 'D3', 'E3', 'F3'].map((cell) => worksheet.getCell(cell).value)).toEqual([
      'Aluno(a)',
      'Prova 1',
      'Prova 2',
      'Trabalho',
      'Média',
    ]);
    expect(worksheet.getCell('B5').value).toBe('Bruno Lima');
  });

  it('paints the header with the chosen palette', () => {
    const [worksheet] = buildGradesWorkbook(
      buildSheetData({ style: buildSheetStyle({ paletteId: 'green' }) }),
    ).worksheets;
    const headerFill = worksheet.getCell('F3').fill;

    expect(headerFill).toMatchObject({ fgColor: { argb: 'FFBBF7D0' } });
    expect(worksheet.getCell('C5').fill).toMatchObject({ fgColor: { argb: 'FFDCFCE7' } });
  });

  it('calculates the average of the filled grades, blank while there is none', () => {
    const [worksheet] = buildGradesWorkbook(buildSheetData()).worksheets;

    expect(worksheet.getCell('F4').value).toEqual({
      formula: 'IF(COUNT(C4:E4)=0,"",AVERAGE(C4:E4))',
    });
    expect(worksheet.getCell('F5').value).toEqual({
      formula: 'IF(COUNT(C5:E5)=0,"",AVERAGE(C5:E5))',
    });
  });

  it('adds a total column when the summary is a sum', () => {
    const [worksheet] = buildGradesWorkbook(buildSheetData({ summary: 'sum' })).worksheets;

    expect(worksheet.getCell('F3').value).toBe('Total');
    expect(worksheet.getCell('F4').value).toEqual({ formula: 'IF(COUNT(C4:E4)=0,"",SUM(C4:E4))' });
  });

  it('adds no calculated column when the summary is none', () => {
    const [worksheet] = buildGradesWorkbook(buildSheetData({ summary: 'none' })).worksheets;

    expect(worksheet.columnCount).toBe(5);
    expect(worksheet.getCell('F3').value).toBeNull();
  });

  it('only accepts grades from 0 to the max grade', () => {
    const [worksheet] = buildGradesWorkbook(buildSheetData({ maxGrade: 7.5 })).worksheets;

    expect(worksheet.getCell('E5').dataValidation).toMatchObject({
      type: 'decimal',
      operator: 'between',
      formulae: [0, 7.5],
      error: 'A nota deve ser um número entre 0 e 7,5.',
    });
    expect(worksheet.getCell('F5').dataValidation).toBeUndefined();
  });

  it('prints few columns in portrait and many in landscape, always one page wide', () => {
    const [portrait] = buildGradesWorkbook(buildSheetData()).worksheets;
    const [landscape] = buildGradesWorkbook(
      buildSheetData({ gradeTitles: Array.from({ length: 8 }, (_, i) => `Nota ${i + 1}`) }),
    ).worksheets;

    expect(portrait.pageSetup).toMatchObject({ orientation: 'portrait', fitToWidth: 1 });
    expect(landscape.pageSetup).toMatchObject({ orientation: 'landscape', fitToWidth: 1 });
  });

  it('generates a valid xlsx file', async () => {
    const buffer = await buildGradesWorkbook(buildSheetData()).xlsx.writeBuffer();
    const reloaded = new ExcelJS.Workbook();
    await reloaded.xlsx.load(buffer);

    expect(reloaded.worksheets[0].getCell('F4').formula).toBe(
      'IF(COUNT(C4:E4)=0,"",AVERAGE(C4:E4))',
    );
  });

  it('adds a weights row and a weighted average', () => {
    const [worksheet] = buildGradesWorkbook(buildSheetData({ weights: [1, 2, 1] })).worksheets;

    expect(worksheet.getCell('B3').value).toBe('Aluno(a)');
    expect(worksheet.getCell('B4').value).toBe('Peso de cada nota');
    expect(['C4', 'D4', 'E4'].map((cell) => worksheet.getCell(cell).value)).toEqual([1, 2, 1]);
    expect(worksheet.getCell('B5').value).toBe('Ana Souza');
    expect(worksheet.getCell('F5').value).toEqual({
      formula: 'IF(COUNT(C5:E5)=0,"",SUMPRODUCT(C5:E5,C$4:E$4)/SUMIFS(C$4:E$4,C5:E5,"<>"))',
    });
  });

  it('adds recovery, final and status columns that compare with the passing grade', () => {
    const [worksheet] = buildGradesWorkbook(
      buildSheetData({ includeRecovery: true, includeStatus: true, passingGrade: 6 }),
    ).worksheets;

    expect(['F3', 'G3', 'H3', 'I3'].map((cell) => worksheet.getCell(cell).value)).toEqual([
      'Média',
      'Recup.',
      'Final',
      'Situação',
    ]);
    expect(worksheet.getCell('H4').value).toEqual({ formula: 'IF(COUNT(F4,G4)=0,"",MAX(F4,G4))' });
    expect(worksheet.getCell('I4').value).toEqual({
      formula: 'IF(H4="","",IF(H4>=6,"Na média","Abaixo da média"))',
    });
    expect(worksheet.getCell('G4').dataValidation).toMatchObject({ formulae: [0, 10] });
    expect(String(worksheet.getCell('A2').value)).toContain('Média mínima: 6');
  });
});
