import ExcelJS, { type Worksheet } from 'exceljs';

import {
  addSheetTitle,
  addStudentHeaders,
  addStudentRows,
  configureA4Printing,
  FIRST_DATA_COLUMN,
  FIRST_HEADER_ROW,
  formatClassInfo,
  setColumnWidths,
} from '@/features/classroom/services/classSheet';
import { scaleSize } from '@/features/classroom/services/sheetStyle';
import type { SheetStyle } from '@/features/classroom/types';
import { getSummaryColumnTitle } from '@/features/grades/services/buildGradesSheetData';
import type { GradesSheetData } from '@/features/grades/types';
import { styleHeaderCell } from '@/lib/excel/styles';

const HEADER_ROW = FIRST_HEADER_ROW;
const FIRST_STUDENT_ROW = HEADER_ROW + 1;

/** Up to this many grade columns the sheet still fits, readable, on a portrait A4 page. */
const PORTRAIT_MAX_COLUMNS = 6;

const GRADE_FORMAT = '0.0#';
const SUMMARY_FORMAT = '0.0';
const MIN_COLUMN_WIDTH = 8;
const MAX_COLUMN_WIDTH = 14;
const HEADER_FONT_SIZE = 9;
const HEADER_ROW_HEIGHT = 32;

const SUMMARY_FUNCTIONS = { average: 'AVERAGE', sum: 'SUM' } as const;

type GradeCells = {
  studentCount: number;
  firstColumn: number;
  lastColumn: number;
};

const formatNumber = (value: number): string => value.toLocaleString('pt-BR');

// Long titles wrap inside the header instead of widening the column forever.
const getColumnWidth = (title: string): number =>
  Math.min(Math.max(title.length + 2, MIN_COLUMN_WIDTH), MAX_COLUMN_WIDTH);

const forEachCell = (
  worksheet: Worksheet,
  { studentCount, firstColumn, lastColumn }: GradeCells,
  callback: (cell: ExcelJS.Cell, rowNumber: number) => void,
) => {
  for (let index = 0; index < studentCount; index++) {
    const rowNumber = FIRST_STUDENT_ROW + index;

    for (let columnNumber = firstColumn; columnNumber <= lastColumn; columnNumber++) {
      callback(worksheet.getCell(rowNumber, columnNumber), rowNumber);
    }
  }
};

const addColumnHeaders = (worksheet: Worksheet, titles: string[], style: SheetStyle) => {
  titles.forEach((title, index) => {
    const cell = worksheet.getCell(HEADER_ROW, FIRST_DATA_COLUMN + index);
    cell.value = title;
    styleHeaderCell(cell, style.headerFill, scaleSize(HEADER_FONT_SIZE, style));
  });

  worksheet.getRow(HEADER_ROW).height = scaleSize(HEADER_ROW_HEIGHT, style);
};

/** Only accepts numbers from 0 to the max grade, so typos like "75" instead of "7,5" are caught. */
const restrictGradeValues = (worksheet: Worksheet, cells: GradeCells, maxGrade: number) =>
  forEachCell(worksheet, cells, (cell) => {
    cell.numFmt = GRADE_FORMAT;
    cell.dataValidation = {
      type: 'decimal',
      operator: 'between',
      allowBlank: true,
      formulae: [0, maxGrade],
      showErrorMessage: true,
      errorStyle: 'stop',
      errorTitle: 'Nota inválida',
      error: `A nota deve ser um número entre 0 e ${formatNumber(maxGrade)}.`,
    };
  });

const addSummaryFormulas = (
  worksheet: Worksheet,
  { studentCount, firstColumn, lastColumn }: GradeCells,
  summaryFunction: string,
) => {
  const summaryColumn = lastColumn + 1;
  const firstLetter = worksheet.getColumn(firstColumn).letter;
  const lastLetter = worksheet.getColumn(lastColumn).letter;

  forEachCell(
    worksheet,
    { studentCount, firstColumn: summaryColumn, lastColumn: summaryColumn },
    (cell, rowNumber) => {
      const gradesRange = `${firstLetter}${rowNumber}:${lastLetter}${rowNumber}`;
      // Stays blank until the student has at least one grade.
      cell.value = {
        formula: `IF(COUNT(${gradesRange})=0,"",${summaryFunction}(${gradesRange}))`,
      };
      cell.numFmt = SUMMARY_FORMAT;
      cell.font = { ...cell.font, bold: true };
    },
  );
};

export const buildGradesWorkbook = ({
  classInfo,
  studentNames,
  gradeTitles,
  summary,
  maxGrade,
  style,
}: GradesSheetData): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Professor Utils';
  workbook.calcProperties.fullCalcOnLoad = true;

  const worksheet = workbook.addWorksheet('Notas');
  const summaryTitle = getSummaryColumnTitle(summary);
  const columnTitles = summaryTitle ? [...gradeTitles, summaryTitle] : gradeTitles;
  const lastColumn = FIRST_DATA_COLUMN + columnTitles.length - 1;
  const gradeCells: GradeCells = {
    studentCount: studentNames.length,
    firstColumn: FIRST_DATA_COLUMN,
    lastColumn: FIRST_DATA_COLUMN + gradeTitles.length - 1,
  };

  setColumnWidths(worksheet, columnTitles.map(getColumnWidth));
  addSheetTitle(worksheet, {
    title: 'Lista de notas',
    info: formatClassInfo(classInfo, [`Nota máxima: ${formatNumber(maxGrade)}`]),
    lastColumn,
  });
  addStudentHeaders(worksheet, HEADER_ROW, style);
  addColumnHeaders(worksheet, columnTitles, style);
  addStudentRows(worksheet, { studentNames, firstRow: FIRST_STUDENT_ROW, lastColumn, style });
  restrictGradeValues(worksheet, gradeCells, maxGrade);

  if (summary !== 'none') {
    addSummaryFormulas(worksheet, gradeCells, SUMMARY_FUNCTIONS[summary]);
  }

  configureA4Printing(worksheet, {
    orientation: columnTitles.length <= PORTRAIT_MAX_COLUMNS ? 'portrait' : 'landscape',
    lastHeaderRow: HEADER_ROW,
  });

  return workbook;
};
