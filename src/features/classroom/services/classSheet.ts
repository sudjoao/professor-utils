import type { Worksheet } from 'exceljs';

import { scaleSize } from '@/features/classroom/services/sheetStyle';
import type { ClassInfo, SheetStyle } from '@/features/classroom/types';
import { A4_PAPER_SIZE, styleHeaderCell, THIN_BORDER } from '@/lib/excel/styles';

/*
 * Layout shared by every class sheet (attendance, grades...):
 *   row 1: title · row 2: class info · row 3 on: column headers, then one row per student.
 *   column A: student number · column B: student name · column C on: the sheet's own columns.
 */
const TITLE_ROW = 1;
const INFO_ROW = 2;
export const FIRST_HEADER_ROW = 3;

export const NUMBER_COLUMN = 1;
export const NAME_COLUMN = 2;
export const FIRST_DATA_COLUMN = 3;

const NUMBER_COLUMN_WIDTH = 4.5;
const NAME_COLUMN_WIDTH = 34;
const STUDENT_ROW_HEIGHT = 18;
const STUDENT_FONT_SIZE = 10;

type SheetTitle = {
  title: string;
  info: string;
  lastColumn: number;
};

type StudentRows = {
  studentNames: string[];
  firstRow: number;
  lastColumn: number;
  style: SheetStyle;
  /** Taller rows leave room to sign; defaults to the regular height. */
  rowHeight?: number;
};

type PrintSettings = {
  orientation: 'portrait' | 'landscape';
  lastHeaderRow: number;
};

export const formatClassInfo = (
  { classroomName, subject, teacherName }: ClassInfo,
  extraInfo: string[] = [],
): string =>
  [
    classroomName && `Turma: ${classroomName}`,
    subject && `Disciplina: ${subject}`,
    teacherName && `Professor(a): ${teacherName}`,
    ...extraInfo,
  ]
    .filter(Boolean)
    .join('     ');

export const setColumnWidths = (worksheet: Worksheet, dataColumnWidths: number[]) => {
  worksheet.columns = [
    { width: NUMBER_COLUMN_WIDTH },
    { width: NAME_COLUMN_WIDTH },
    ...dataColumnWidths.map((width) => ({ width })),
  ];
};

export const addSheetTitle = (worksheet: Worksheet, { title, info, lastColumn }: SheetTitle) => {
  worksheet.mergeCells(TITLE_ROW, NUMBER_COLUMN, TITLE_ROW, lastColumn);
  const titleCell = worksheet.getCell(TITLE_ROW, NUMBER_COLUMN);
  titleCell.value = title;
  titleCell.font = { bold: true, size: 14 };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(TITLE_ROW).height = 24;

  worksheet.mergeCells(INFO_ROW, NUMBER_COLUMN, INFO_ROW, lastColumn);
  const infoCell = worksheet.getCell(INFO_ROW, NUMBER_COLUMN);
  infoCell.value = info;
  infoCell.font = { size: 11 };
  infoCell.alignment = { horizontal: 'left', vertical: 'middle' };
  worksheet.getRow(INFO_ROW).height = 20;
};

/** "Nº" and "Aluno(a)" header cells, merged down to the last header row. */
export const addStudentHeaders = (
  worksheet: Worksheet,
  lastHeaderRow: number,
  style: SheetStyle,
) => {
  worksheet.mergeCells(FIRST_HEADER_ROW, NUMBER_COLUMN, lastHeaderRow, NUMBER_COLUMN);
  worksheet.mergeCells(FIRST_HEADER_ROW, NAME_COLUMN, lastHeaderRow, NAME_COLUMN);

  const numberCell = worksheet.getCell(FIRST_HEADER_ROW, NUMBER_COLUMN);
  const nameCell = worksheet.getCell(FIRST_HEADER_ROW, NAME_COLUMN);
  numberCell.value = 'Nº';
  nameCell.value = 'Aluno(a)';
  styleHeaderCell(numberCell, style.headerFill, scaleSize(STUDENT_FONT_SIZE, style));
  styleHeaderCell(nameCell, style.headerFill, scaleSize(STUDENT_FONT_SIZE, style));
};

export const addStudentRows = (
  worksheet: Worksheet,
  { studentNames, firstRow, lastColumn, style, rowHeight = STUDENT_ROW_HEIGHT }: StudentRows,
) => {
  studentNames.forEach((name, index) => {
    const row = worksheet.getRow(firstRow + index);
    row.height = scaleSize(rowHeight, style);
    row.getCell(NUMBER_COLUMN).value = index + 1;
    row.getCell(NAME_COLUMN).value = name;

    for (let columnNumber = NUMBER_COLUMN; columnNumber <= lastColumn; columnNumber++) {
      const cell = row.getCell(columnNumber);
      cell.border = THIN_BORDER;
      cell.font = { size: scaleSize(STUDENT_FONT_SIZE, style) };
      cell.alignment = {
        vertical: 'middle',
        horizontal: columnNumber === NAME_COLUMN ? 'left' : 'center',
        shrinkToFit: columnNumber === NAME_COLUMN,
      };
      if (style.stripeFill && index % 2 === 1) {
        cell.fill = style.stripeFill;
      }
    }
  });
};

/** A line of small text across the sheet, like a legend below the students. */
export const addSheetNote = (
  worksheet: Worksheet,
  { row, lastColumn, text }: { row: number; lastColumn: number; text: string },
) => {
  worksheet.mergeCells(row, NUMBER_COLUMN, row, lastColumn);
  const cell = worksheet.getCell(row, NUMBER_COLUMN);
  cell.value = text;
  cell.font = { italic: true, size: 9 };
  cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
  worksheet.getRow(row).height = 30;
};

export const configureA4Printing = (
  worksheet: Worksheet,
  { orientation, lastHeaderRow }: PrintSettings,
) => {
  worksheet.pageSetup = {
    paperSize: A4_PAPER_SIZE,
    orientation,
    // Fit every column across one page width; rows flow to as many pages as needed.
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
    printTitlesRow: `${FIRST_HEADER_ROW}:${lastHeaderRow}`,
  };
  worksheet.views = [{ state: 'frozen', xSplit: NAME_COLUMN, ySplit: lastHeaderRow }];
};
