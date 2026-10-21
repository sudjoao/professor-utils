import ExcelJS, { type Worksheet } from 'exceljs';

import { MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import type { AttendanceColumn, AttendanceSheetData } from '@/features/attendance/types';
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
import type { ClassInfo, SheetStyle } from '@/features/classroom/types';
import { chunk } from '@/lib/array/chunk';
import { styleHeaderCell } from '@/lib/excel/styles';

const HEADER_LABEL_ROW = FIRST_HEADER_ROW;
const HEADER_CAPTION_ROW = FIRST_HEADER_ROW + 1;
const FIRST_STUDENT_ROW = HEADER_CAPTION_ROW + 1;

const LESSON_COLUMN_WIDTH = 5.2;
const LESSON_HEADER_FONT_SIZE = 9;
const LESSON_HEADER_ROW_HEIGHT = 16;

type AttendancePage = {
  sheetName: string;
  title: string;
  classInfo: ClassInfo;
  studentNames: string[];
  columns: AttendanceColumn[];
  style: SheetStyle;
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

const addAttendancePage = (workbook: ExcelJS.Workbook, page: AttendancePage) => {
  const worksheet = workbook.addWorksheet(page.sheetName);
  const lastColumn = FIRST_DATA_COLUMN + page.columns.length - 1;

  setColumnWidths(
    worksheet,
    page.columns.map(() => scaleSize(LESSON_COLUMN_WIDTH, page.style)),
  );
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
  configureA4Printing(worksheet, { orientation: 'landscape', lastHeaderRow: HEADER_CAPTION_ROW });
};

/**
 * Builds the attendance workbook. When there are more lessons than fit across one page,
 * the remaining ones go to new worksheets ("Página 2", "Página 3"...), each repeating the students.
 */
export const buildAttendanceWorkbook = ({
  classInfo,
  studentNames,
  columns,
  style,
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
      classInfo,
      studentNames,
      columns: pageColumns,
      style,
    });
  });

  return workbook;
};
