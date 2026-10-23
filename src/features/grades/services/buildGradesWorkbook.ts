import ExcelJS, { type Worksheet } from 'exceljs';

import {
  addSheetTitle,
  addStudentHeaders,
  addStudentRows,
  configureA4Printing,
  FIRST_DATA_COLUMN,
  FIRST_HEADER_ROW,
  formatClassInfo,
  NAME_COLUMN,
  setColumnWidths,
} from '@/features/classroom/services/classSheet';
import { scaleSize } from '@/features/classroom/services/sheetStyle';
import type { SheetStyle } from '@/features/classroom/types';
import { getResultColumnTitles } from '@/features/grades/services/buildGradesSheetData';
import {
  buildAverageFormula,
  buildFinalFormula,
  buildStatusFormula,
  buildSumFormula,
  type GradeRow,
  STATUS_BELOW,
} from '@/features/grades/services/gradesFormulas';
import type { GradesSheetData } from '@/features/grades/types';
import { columnLetter } from '@/lib/excel/columnLetter';
import { solidFill, styleHeaderCell, THIN_BORDER } from '@/lib/excel/styles';

const HEADER_ROW = FIRST_HEADER_ROW;

/** Up to this many columns the sheet still fits, readable, on a portrait A4 page. */
const PORTRAIT_MAX_COLUMNS = 6;

const GRADE_FORMAT = '0.0#';
const SUMMARY_FORMAT = '0.0';
const MIN_COLUMN_WIDTH = 8;
const MAX_COLUMN_WIDTH = 14;
const STATUS_COLUMN_WIDTH = 16;
const HEADER_FONT_SIZE = 9;
const HEADER_ROW_HEIGHT = 32;

const BELOW_STYLE = {
  fill: { ...solidFill('FFFECACA'), bgColor: { argb: 'FFFECACA' } },
  font: { bold: true, color: { argb: 'FF991B1B' } },
};
const WEIGHT_FILL = solidFill('FFFFFFFF');

type Layout = {
  weightsRow?: number;
  firstStudentRow: number;
  studentCount: number;
};

const formatNumber = (value: number): string => value.toLocaleString('pt-BR');

// Long titles wrap inside the header instead of widening the column forever.
const getColumnWidth = (title: string): number =>
  title === 'Situação'
    ? STATUS_COLUMN_WIDTH
    : Math.min(Math.max(title.length + 2, MIN_COLUMN_WIDTH), MAX_COLUMN_WIDTH);

const forEachStudentCell = (
  worksheet: Worksheet,
  { firstStudentRow, studentCount }: Layout,
  column: number,
  callback: (cell: ExcelJS.Cell, row: number) => void,
) => {
  for (let index = 0; index < studentCount; index++) {
    const row = firstStudentRow + index;
    callback(worksheet.getCell(row, column), row);
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

/** A row under the titles with each grade's weight; the teacher can still change it in Excel. */
const addWeightsRow = (
  worksheet: Worksheet,
  { row, weights, lastColumn }: { row: number; weights: number[]; lastColumn: number },
) => {
  const label = worksheet.getCell(row, NAME_COLUMN);
  label.value = 'Peso de cada nota';
  label.font = { italic: true, bold: true, size: 9 };

  for (let column = 1; column <= lastColumn; column++) {
    worksheet.getCell(row, column).border = THIN_BORDER;
  }

  weights.forEach((weight, index) => {
    const cell = worksheet.getCell(row, FIRST_DATA_COLUMN + index);
    cell.value = weight;
    cell.fill = WEIGHT_FILL;
    cell.font = { italic: true, bold: true, size: 9 };
    cell.alignment = { horizontal: 'center' };
    cell.dataValidation = {
      type: 'decimal',
      operator: 'greaterThan',
      formulae: [0],
      showErrorMessage: true,
      errorStyle: 'stop',
      errorTitle: 'Peso inválido',
      error: 'O peso deve ser um número maior que 0.',
    };
  });
};

/** Only accepts numbers from 0 to the max grade, so typos like "75" instead of "7,5" are caught. */
const restrictGradeValues = (
  worksheet: Worksheet,
  layout: Layout,
  columns: number[],
  maxGrade: number,
) =>
  columns.forEach((column) =>
    forEachStudentCell(worksheet, layout, column, (cell) => {
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
    }),
  );

const setFormulas = (
  worksheet: Worksheet,
  layout: Layout,
  column: number,
  buildFormula: (row: number) => string,
  numFmt?: string,
) =>
  forEachStudentCell(worksheet, layout, column, (cell, row) => {
    cell.value = { formula: buildFormula(row) };
    cell.font = { ...cell.font, bold: true };
    if (numFmt) {
      cell.numFmt = numFmt;
    }
  });

const highlightBelow = (
  worksheet: Worksheet,
  { firstStudentRow, studentCount }: Layout,
  column: number,
  rule: { operator: 'lessThan' | 'equal'; value: number | string },
) => {
  if (studentCount === 0) {
    return;
  }

  const letter = columnLetter(column);
  worksheet.addConditionalFormatting({
    ref: `${letter}${firstStudentRow}:${letter}${firstStudentRow + studentCount - 1}`,
    rules: [
      {
        type: 'cellIs',
        operator: rule.operator,
        formulae: [typeof rule.value === 'string' ? `"${rule.value}"` : rule.value],
        priority: 1,
        style: BELOW_STYLE,
      },
    ],
  });
};

export const buildGradesWorkbook = (data: GradesSheetData): ExcelJS.Workbook => {
  const { classInfo, studentNames, gradeTitles, summary, maxGrade, weights, style } = data;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Professor Utils';
  workbook.calcProperties.fullCalcOnLoad = true;

  const worksheet = workbook.addWorksheet('Notas');
  const resultTitles = getResultColumnTitles(data);
  const columnTitles = [...gradeTitles, ...resultTitles];
  const lastColumn = FIRST_DATA_COLUMN + columnTitles.length - 1;
  const lastGradeColumn = FIRST_DATA_COLUMN + gradeTitles.length - 1;
  const weightsRow = weights ? HEADER_ROW + 1 : undefined;
  const layout: Layout = {
    weightsRow,
    firstStudentRow: (weightsRow ?? HEADER_ROW) + 1,
    studentCount: studentNames.length,
  };
  const usesPassingGrade = data.includeRecovery || data.includeStatus;

  setColumnWidths(worksheet, columnTitles.map(getColumnWidth));
  addSheetTitle(worksheet, {
    title: 'Lista de notas',
    info: formatClassInfo(classInfo, [
      `Nota máxima: ${formatNumber(maxGrade)}`,
      ...(usesPassingGrade ? [`Média mínima: ${formatNumber(data.passingGrade)}`] : []),
    ]),
    lastColumn,
  });
  // Only the title row: the weights row has its own label under "Aluno(a)".
  addStudentHeaders(worksheet, HEADER_ROW, style);
  addColumnHeaders(worksheet, columnTitles, style);
  if (weightsRow && weights) {
    addWeightsRow(worksheet, { row: weightsRow, weights, lastColumn });
  }
  addStudentRows(worksheet, {
    studentNames,
    firstRow: layout.firstStudentRow,
    lastColumn,
    style,
  });

  const gradeColumns = gradeTitles.map((_, index) => FIRST_DATA_COLUMN + index);
  const gradeRow = (row: number): GradeRow => ({
    row,
    firstColumn: columnLetter(FIRST_DATA_COLUMN),
    lastColumn: columnLetter(lastGradeColumn),
  });

  if (summary !== 'none') {
    const summaryColumn = lastGradeColumn + 1;
    const buildSummary = summary === 'average' ? buildAverageFormula : buildSumFormula;
    let resultColumn = summaryColumn;

    setFormulas(
      worksheet,
      layout,
      summaryColumn,
      (row) => buildSummary(gradeRow(row), weightsRow),
      SUMMARY_FORMAT,
    );

    if (data.includeRecovery) {
      const recoveryColumn = summaryColumn + 1;
      resultColumn = summaryColumn + 2;
      restrictGradeValues(worksheet, layout, [recoveryColumn], maxGrade);
      setFormulas(
        worksheet,
        layout,
        resultColumn,
        (row) =>
          buildFinalFormula(
            `${columnLetter(summaryColumn)}${row}`,
            `${columnLetter(recoveryColumn)}${row}`,
          ),
        SUMMARY_FORMAT,
      );
    }

    if (usesPassingGrade) {
      highlightBelow(worksheet, layout, resultColumn, {
        operator: 'lessThan',
        value: data.passingGrade,
      });
    }

    if (data.includeStatus) {
      const statusColumn = resultColumn + 1;
      setFormulas(worksheet, layout, statusColumn, (row) =>
        buildStatusFormula(`${columnLetter(resultColumn)}${row}`, data.passingGrade),
      );
      highlightBelow(worksheet, layout, statusColumn, { operator: 'equal', value: STATUS_BELOW });
    }
  }

  restrictGradeValues(worksheet, layout, gradeColumns, maxGrade);
  configureA4Printing(worksheet, {
    orientation: columnTitles.length <= PORTRAIT_MAX_COLUMNS ? 'portrait' : 'landscape',
    lastHeaderRow: weightsRow ?? HEADER_ROW,
  });

  return workbook;
};
