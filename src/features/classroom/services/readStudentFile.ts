import {
  type CleanedStudentList,
  cleanStudentList,
  cleanStudentRows,
} from '@/features/classroom/services/studentList';
import { decodeText } from '@/lib/files/decodeText';

export const ACCEPTED_STUDENT_FILES = '.xlsx,.csv,.txt';

export type StudentFileResult =
  ({ status: 'ok' } & CleanedStudentList) | { status: 'oldExcel' | 'unsupported' | 'empty' };

const getExtension = (fileName: string): string =>
  fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();

/** Starts downloading ExcelJS when the teacher is about to pick a spreadsheet. */
export const preloadStudentFileReader = () => void import('exceljs').catch(() => undefined);

/** Rows of the first sheet with content, each cell as the text Excel shows. */
const readExcelRows = async (file: File): Promise<string[][]> => {
  // ExcelJS is heavy, so it is only downloaded when the teacher opens a spreadsheet.
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  const worksheet = workbook.worksheets.find((sheet) => sheet.actualRowCount > 0);
  const rows: string[][] = [];

  worksheet?.eachRow((row) => {
    rows.push(
      Array.from({ length: row.cellCount }, (_, index) => row.getCell(index + 1).text.trim()),
    );
  });

  return rows;
};

/** Reads the student names of an Excel (.xlsx) or CSV file, cleaned like a pasted list. */
export const readStudentFile = async (file: File): Promise<StudentFileResult> => {
  const extension = getExtension(file.name);

  if (extension === 'xls') {
    return { status: 'oldExcel' };
  }
  if (extension !== 'xlsx' && extension !== 'csv' && extension !== 'txt') {
    return { status: 'unsupported' };
  }

  const list =
    extension === 'xlsx'
      ? cleanStudentRows(await readExcelRows(file))
      : cleanStudentList(decodeText(await file.arrayBuffer()), 'file');

  return list.names.length > 0 ? { status: 'ok', ...list } : { status: 'empty' };
};
