import ExcelJS, { type Worksheet } from 'exceljs';

import { MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import {
  buildAbsencesFormula,
  buildFrequencyFormula,
  type LessonRange,
  MIN_ATTENDANCE,
} from '@/features/attendance/services/attendanceFormulas';
import type { AttendanceColumn, AttendanceSheetData } from '@/features/attendance/types';
import {
  addSheetNote,
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
import type { ClassInfo, SheetStyle } from '@/features/classroom/types';
import { chunk } from '@/lib/array/chunk';
import { columnLetter } from '@/lib/excel/columnLetter';
import { solidFill, styleHeaderCell } from '@/lib/excel/styles';

const HEADER_LABEL_ROW = FIRST_HEADER_ROW;
const HEADER_CAPTION_ROW = FIRST_HEADER_ROW + 1;
const FIRST_STUDENT_ROW = HEADER_CAPTION_ROW + 1;

const LESSON_COLUMN_WIDTH = 5.2;
const LESSON_HEADER_FONT_SIZE = 9;
const LESSON_HEADER_ROW_HEIGHT = 16;
const TOTAL_COLUMN_WIDTH = 7;

const SIGNATURE_COLUMN_WIDTH = 55;
const SIGNATURE_ROW_HEIGHT = 30;

const LEGEND = 'Legenda: P = presente  ·  F = falta  ·  J = falta justificada.';
const TOTALS_LEGEND = `Faltas e Freq. (frequência) são calculadas sozinhas com as aulas já marcadas; abaixo de ${MIN_ATTENDANCE * 100}%, a frequência fica em vermelho.`;

const LOW_ATTENDANCE_STYLE = {
  fill: { ...solidFill('FFFECACA'), bgColor: { argb: 'FFFECACA' } },
  font: { bold: true, color: { argb: 'FF991B1B' } },
};

type AttendancePage = {
  sheetName: string;
  title: string;
  classInfo: ClassInfo;
  studentNames: string[];
  columns: AttendanceColumn[];
  style: SheetStyle;
  /** Only the last page gets the totals, which count the lessons of every page. */
  totalsOf?: LessonRange[];
};

const addLessonHeaders = (worksheet: Worksheet, columns: AttendanceColumn[], style: SheetStyle) => {
  const fontSize = scaleSize(LESSON_HEADER_FONT_SIZE, style);

  columns.forEach(({ label, caption }, index) => {
    const columnNumber = FIRST_DATA_COLUMN + index;
    const labelCell = worksheet.getCell(HEADER_LABEL_ROW, columnNumber);
    const captionCell = worksheet.getCell(HEADER_CAPTION_ROW, columnNumber);

    labelCell.value = label;
    captionCell.value = caption;
    styleHeaderCell(labelCell, style.headerFill, fontSize);
    styleHeaderCell(captionCell, style.headerFill, fontSize);
  });

  worksheet.getRow(HEADER_LABEL_ROW).height = scaleSize(LESSON_HEADER_ROW_HEIGHT, style);
  worksheet.getRow(HEADER_CAPTION_ROW).height = scaleSize(LESSON_HEADER_ROW_HEIGHT, style);
};

/** "Faltas" and "Freq." headers, each merged down both header rows. */
const addTotalHeaders = (worksheet: Worksheet, firstColumn: number, style: SheetStyle) =>
  ['Faltas', 'Freq.'].forEach((title, index) => {
    const column = firstColumn + index;
    worksheet.mergeCells(HEADER_LABEL_ROW, column, HEADER_CAPTION_ROW, column);
    const cell = worksheet.getCell(HEADER_LABEL_ROW, column);
    cell.value = title;
    styleHeaderCell(cell, style.headerFill, scaleSize(LESSON_HEADER_FONT_SIZE, style));
  });

const addTotalFormulas = (
  worksheet: Worksheet,
  {
    firstColumn,
    studentCount,
    ranges,
  }: { firstColumn: number; studentCount: number; ranges: LessonRange[] },
) => {
  const absencesLetter = columnLetter(firstColumn);
  const frequencyLetter = columnLetter(firstColumn + 1);

  for (let index = 0; index < studentCount; index++) {
    const row = FIRST_STUDENT_ROW + index;
    const absencesCell = worksheet.getCell(row, firstColumn);
    const frequencyCell = worksheet.getCell(row, firstColumn + 1);

    absencesCell.value = { formula: buildAbsencesFormula(ranges, row) };
    absencesCell.font = { ...absencesCell.font, bold: true };
    frequencyCell.value = {
      formula: buildFrequencyFormula(ranges, row, `${absencesLetter}${row}`),
    };
    frequencyCell.numFmt = '0%';
    frequencyCell.font = { ...frequencyCell.font, bold: true };
  }

  if (studentCount > 0) {
    worksheet.addConditionalFormatting({
      ref: `${frequencyLetter}${FIRST_STUDENT_ROW}:${frequencyLetter}${FIRST_STUDENT_ROW + studentCount - 1}`,
      rules: [
        {
          type: 'cellIs',
          operator: 'lessThan',
          formulae: [MIN_ATTENDANCE],
          priority: 1,
          style: LOW_ATTENDANCE_STYLE,
        },
      ],
    });
  }
};

const addAttendancePage = (workbook: ExcelJS.Workbook, page: AttendancePage) => {
  const worksheet = workbook.addWorksheet(page.sheetName);
  const lastLessonColumn = FIRST_DATA_COLUMN + page.columns.length - 1;
  const totalsColumn = lastLessonColumn + 1;
  const lastColumn = page.totalsOf ? totalsColumn + 1 : lastLessonColumn;

  setColumnWidths(worksheet, [
    ...page.columns.map(() => scaleSize(LESSON_COLUMN_WIDTH, page.style)),
    ...(page.totalsOf ? [TOTAL_COLUMN_WIDTH, TOTAL_COLUMN_WIDTH] : []),
  ]);
  addSheetTitle(worksheet, {
    title: page.title,
    info: formatClassInfo(page.classInfo),
    lastColumn,
  });
  addStudentHeaders(worksheet, HEADER_CAPTION_ROW, page.style);
  addLessonHeaders(worksheet, page.columns, page.style);
  addStudentRows(worksheet, {
    studentNames: page.studentNames,
    firstRow: FIRST_STUDENT_ROW,
    lastColumn,
    style: page.style,
  });

  if (page.totalsOf) {
    addTotalHeaders(worksheet, totalsColumn, page.style);
    addTotalFormulas(worksheet, {
      firstColumn: totalsColumn,
      studentCount: page.studentNames.length,
      ranges: page.totalsOf,
    });
  }

  addSheetNote(worksheet, {
    row: FIRST_STUDENT_ROW + page.studentNames.length + 1,
    lastColumn,
    text: page.totalsOf ? `${LEGEND} ${TOTALS_LEGEND}` : LEGEND,
  });
  configureA4Printing(worksheet, { orientation: 'landscape', lastHeaderRow: HEADER_CAPTION_ROW });
};

const buildLessonWorkbook = (workbook: ExcelJS.Workbook, data: AttendanceSheetData) => {
  const pages = chunk(data.columns, MAX_COLUMNS_PER_PAGE);
  const sheetName = (index: number) => `Página ${index + 1}`;
  const ranges: LessonRange[] = pages.map((pageColumns, index) => ({
    sheetName: sheetName(index),
    firstColumn: columnLetter(FIRST_DATA_COLUMN),
    lastColumn: columnLetter(FIRST_DATA_COLUMN + pageColumns.length - 1),
  }));

  pages.forEach((pageColumns, index) => {
    const pageNumber = index + 1;
    const isLastPage = pageNumber === pages.length;

    addAttendancePage(workbook, {
      sheetName: sheetName(index),
      title:
        pages.length > 1 ? `Lista de chamada (${pageNumber}/${pages.length})` : 'Lista de chamada',
      classInfo: data.classInfo,
      studentNames: data.studentNames,
      columns: pageColumns,
      style: data.style,
      totalsOf: data.includeTotals && isLastPage ? ranges : undefined,
    });
  });
};

/** One wide column for each student (or a guardian) to sign, e.g. for a parents' meeting. */
const buildSignatureWorkbook = (workbook: ExcelJS.Workbook, data: AttendanceSheetData) => {
  const worksheet = workbook.addWorksheet('Assinaturas');
  const headerRow = FIRST_HEADER_ROW;

  setColumnWidths(worksheet, [SIGNATURE_COLUMN_WIDTH]);
  addSheetTitle(worksheet, {
    title: data.signatureTitle || 'Lista de assinaturas',
    info: formatClassInfo(data.classInfo),
    lastColumn: FIRST_DATA_COLUMN,
  });
  addStudentHeaders(worksheet, headerRow, data.style);

  const signatureHeader = worksheet.getCell(headerRow, FIRST_DATA_COLUMN);
  signatureHeader.value = 'Assinatura';
  styleHeaderCell(signatureHeader, data.style.headerFill, scaleSize(10, data.style));
  worksheet.getRow(headerRow).height = scaleSize(20, data.style);

  addStudentRows(worksheet, {
    studentNames: data.studentNames,
    firstRow: headerRow + 1,
    lastColumn: FIRST_DATA_COLUMN,
    style: data.style,
    rowHeight: SIGNATURE_ROW_HEIGHT,
  });
  configureA4Printing(worksheet, { orientation: 'portrait', lastHeaderRow: headerRow });
};

/**
 * Builds the attendance workbook. When there are more lessons than fit across one page,
 * the remaining ones go to new worksheets ("Página 2", "Página 3"...), each repeating the students.
 */
export const buildAttendanceWorkbook = (data: AttendanceSheetData): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Professor Utils';
  workbook.calcProperties.fullCalcOnLoad = true;

  if (data.mode === 'signature') {
    buildSignatureWorkbook(workbook, data);
  } else {
    buildLessonWorkbook(workbook, data);
  }

  return workbook;
};
