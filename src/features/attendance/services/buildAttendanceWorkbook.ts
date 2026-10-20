import ExcelJS, { type Borders, type Cell, type Fill, type Worksheet } from 'exceljs';

import { MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import type {
  AttendanceColumn,
  AttendanceSheetData,
  AttendanceSheetHeader,
} from '@/features/attendance/types';
import { chunk } from '@/lib/array/chunk';

const A4_PAPER_SIZE = 9;

const TITLE_ROW = 1;
const INFO_ROW = 2;
const HEADER_LABEL_ROW = 3;
const HEADER_CAPTION_ROW = 4;
const FIRST_STUDENT_ROW = 5;

const NUMBER_COLUMN = 1;
const NAME_COLUMN = 2;
const FIRST_LESSON_COLUMN = 3;

const COLUMN_WIDTHS = { number: 4.5, name: 34, lesson: 5.2 };
const STUDENT_ROW_HEIGHT = 18;

const THIN_BORDER: Partial<Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

const solidFill = (argb: string): Fill => ({
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb },
});
const HEADER_FILL = solidFill('FFE5E7EB');
const STRIPE_FILL = solidFill('FFF5F5F5');

type AttendancePage = {
  sheetName: string;
  title: string;
  header: AttendanceSheetHeader;
  studentNames: string[];
  columns: AttendanceColumn[];
};

const formatHeaderInfo = ({ classroomName, subject, teacherName }: AttendanceSheetHeader): string =>
  [
    classroomName && `Turma: ${classroomName}`,
    subject && `Disciplina: ${subject}`,
    teacherName && `Professor(a): ${teacherName}`,
  ]
    .filter(Boolean)
    .join('     ');

const styleHeaderCell = (cell: Cell, fontSize = 10) => {
  cell.font = { bold: true, size: fontSize };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.border = THIN_BORDER;
  cell.fill = HEADER_FILL;
};

const configurePrinting = (worksheet: Worksheet) => {
  worksheet.pageSetup = {
    paperSize: A4_PAPER_SIZE,
    orientation: 'landscape',
    // Fit every column across one page width; rows flow to as many pages as needed.
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
    printTitlesRow: `${HEADER_LABEL_ROW}:${HEADER_CAPTION_ROW}`,
  };
  worksheet.views = [{ state: 'frozen', xSplit: NAME_COLUMN, ySplit: HEADER_CAPTION_ROW }];
};

const addTitleRows = (worksheet: Worksheet, page: AttendancePage, lastColumn: number) => {
  worksheet.mergeCells(TITLE_ROW, NUMBER_COLUMN, TITLE_ROW, lastColumn);
  const titleCell = worksheet.getCell(TITLE_ROW, NUMBER_COLUMN);
  titleCell.value = page.title;
  titleCell.font = { bold: true, size: 14 };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(TITLE_ROW).height = 24;

  worksheet.mergeCells(INFO_ROW, NUMBER_COLUMN, INFO_ROW, lastColumn);
  const infoCell = worksheet.getCell(INFO_ROW, NUMBER_COLUMN);
  infoCell.value = formatHeaderInfo(page.header);
  infoCell.font = { size: 11 };
  infoCell.alignment = { horizontal: 'left', vertical: 'middle' };
  worksheet.getRow(INFO_ROW).height = 20;
};

const addColumnHeaders = (worksheet: Worksheet, columns: AttendanceColumn[]) => {
  worksheet.mergeCells(HEADER_LABEL_ROW, NUMBER_COLUMN, HEADER_CAPTION_ROW, NUMBER_COLUMN);
  worksheet.getCell(HEADER_LABEL_ROW, NUMBER_COLUMN).value = 'Nº';
  worksheet.mergeCells(HEADER_LABEL_ROW, NAME_COLUMN, HEADER_CAPTION_ROW, NAME_COLUMN);
  worksheet.getCell(HEADER_LABEL_ROW, NAME_COLUMN).value = 'Aluno(a)';

  columns.forEach(({ label, caption }, index) => {
    const columnNumber = FIRST_LESSON_COLUMN + index;
    worksheet.getCell(HEADER_LABEL_ROW, columnNumber).value = label;
    worksheet.getCell(HEADER_CAPTION_ROW, columnNumber).value = caption;
  });

  [HEADER_LABEL_ROW, HEADER_CAPTION_ROW].forEach((rowNumber) => {
    const row = worksheet.getRow(rowNumber);
    row.height = 16;
    row.eachCell({ includeEmpty: true }, (cell, columnNumber) =>
      styleHeaderCell(cell, columnNumber >= FIRST_LESSON_COLUMN ? 9 : 10),
    );
  });
};

const addStudentRows = (worksheet: Worksheet, studentNames: string[], lastColumn: number) => {
  studentNames.forEach((name, index) => {
    const row = worksheet.getRow(FIRST_STUDENT_ROW + index);
    row.height = STUDENT_ROW_HEIGHT;
    row.getCell(NUMBER_COLUMN).value = index + 1;
    row.getCell(NAME_COLUMN).value = name;

    for (let columnNumber = NUMBER_COLUMN; columnNumber <= lastColumn; columnNumber++) {
      const cell = row.getCell(columnNumber);
      cell.border = THIN_BORDER;
      cell.font = { size: 10 };
      cell.alignment = {
        vertical: 'middle',
        horizontal: columnNumber === NAME_COLUMN ? 'left' : 'center',
        shrinkToFit: columnNumber === NAME_COLUMN,
      };
      if (index % 2 === 1) {
        cell.fill = STRIPE_FILL;
      }
    }
  });
};

const addAttendancePage = (workbook: ExcelJS.Workbook, page: AttendancePage) => {
  const worksheet = workbook.addWorksheet(page.sheetName);
  const lastColumn = FIRST_LESSON_COLUMN + page.columns.length - 1;

  worksheet.columns = [
    { width: COLUMN_WIDTHS.number },
    { width: COLUMN_WIDTHS.name },
    ...page.columns.map(() => ({ width: COLUMN_WIDTHS.lesson })),
  ];

  addTitleRows(worksheet, page, lastColumn);
  addColumnHeaders(worksheet, page.columns);
  addStudentRows(worksheet, page.studentNames, lastColumn);
  configurePrinting(worksheet);
};

/**
 * Builds the attendance workbook. When there are more lessons than fit across one page,
 * the remaining ones go to new worksheets ("Página 2", "Página 3"...), each repeating the students.
 */
export const buildAttendanceWorkbook = ({
  header,
  studentNames,
  columns,
}: AttendanceSheetData): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Professor Utils';

  const pages = chunk(columns, MAX_COLUMNS_PER_PAGE);

  pages.forEach((pageColumns, index) => {
    const pageNumber = index + 1;

    addAttendancePage(workbook, {
      sheetName: `Página ${pageNumber}`,
      title:
        pages.length > 1 ? `Lista de chamada (${pageNumber}/${pages.length})` : 'Lista de chamada',
      header,
      studentNames,
      columns: pageColumns,
    });
  });

  return workbook;
};
