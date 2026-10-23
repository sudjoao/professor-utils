import ExcelJS from 'exceljs';

import {
  addSheetTitle,
  addStudentHeaders,
  addStudentRows,
  configureA4Printing,
  FIRST_DATA_COLUMN,
  FIRST_HEADER_ROW,
  setColumnWidths,
} from '@/features/classroom/services/classSheet';
import { scaleSize } from '@/features/classroom/services/sheetStyle';
import { COUNCIL_TITLE, formatCouncilInfo } from '@/features/council/services/buildCouncilSheet';
import type { CouncilSheetData } from '@/features/council/types';
import { styleHeaderCell } from '@/lib/excel/styles';

const HEADER_ROW = FIRST_HEADER_ROW;
const FIRST_STUDENT_ROW = HEADER_ROW + 1;
const SHORT_COLUMN_WIDTH = 10;
const TEXT_COLUMN_WIDTH = 32;
const ROW_HEIGHT = 30;
const TALL_ROW_HEIGHT = 48;

export const buildCouncilWorkbook = (data: CouncilSheetData): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Professor Utils';

  const worksheet = workbook.addWorksheet('Conselho de classe');
  const lastColumn = FIRST_DATA_COLUMN + data.columns.length - 1;

  setColumnWidths(
    worksheet,
    data.columns.map(({ isText }) => (isText ? TEXT_COLUMN_WIDTH : SHORT_COLUMN_WIDTH)),
  );
  addSheetTitle(worksheet, { title: COUNCIL_TITLE, info: formatCouncilInfo(data), lastColumn });
  addStudentHeaders(worksheet, HEADER_ROW, data.style);

  data.columns.forEach(({ title }, index) => {
    const cell = worksheet.getCell(HEADER_ROW, FIRST_DATA_COLUMN + index);
    cell.value = title;
    styleHeaderCell(cell, data.style.headerFill, scaleSize(10, data.style));
  });
  worksheet.getRow(HEADER_ROW).height = scaleSize(30, data.style);

  addStudentRows(worksheet, {
    studentNames: data.studentNames,
    firstRow: FIRST_STUDENT_ROW,
    lastColumn,
    style: data.style,
    rowHeight: data.tallRows ? TALL_ROW_HEIGHT : ROW_HEIGHT,
  });

  // What the teacher types in the text columns wraps inside the cell, from the top.
  data.columns.forEach(({ isText }, index) => {
    if (!isText) {
      return;
    }
    for (let row = 0; row < data.studentNames.length; row++) {
      const cell = worksheet.getCell(FIRST_STUDENT_ROW + row, FIRST_DATA_COLUMN + index);
      cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    }
  });

  configureA4Printing(worksheet, { orientation: 'landscape', lastHeaderRow: HEADER_ROW });
  return workbook;
};
