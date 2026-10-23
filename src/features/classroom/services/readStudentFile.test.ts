import ExcelJS from 'exceljs';
import { describe, expect, it } from 'vitest';

import { readStudentFile } from '@/features/classroom/services/readStudentFile';

const buildExcelFile = async (rows: (string | number)[][]): Promise<File> => {
  const workbook = new ExcelJS.Workbook();
  workbook.addWorksheet('Turma').addRows(rows);
  return new File([await workbook.xlsx.writeBuffer()], 'turma.xlsx');
};

describe('readStudentFile', () => {
  it('reads the names column of an Excel file', async () => {
    const file = await buildExcelFile([
      ['Nº', 'Nome do estudante', 'Nascimento'],
      [1, 'ANA SOUZA', '12/03/2015'],
      [2, 'BRUNO LIMA', '01/08/2015'],
    ]);

    expect(await readStudentFile(file)).toEqual({
      status: 'ok',
      names: ['ANA SOUZA', 'BRUNO LIMA'],
      fixes: ['columns', 'header'],
    });
  });

  it('reads a CSV file saved by Excel in Portuguese (semicolons, Windows-1252)', async () => {
    const bytes = new Uint8Array([...'Nome;Turma\n'].map((char) => char.charCodeAt(0)));
    const joao = new Uint8Array([0x4a, 0x6f, 0xe3, 0x6f, 0x3b, 0x41]); // "João;A"
    const file = new File([bytes, joao], 'turma.csv');

    expect(await readStudentFile(file)).toMatchObject({ status: 'ok', names: ['João'] });
  });

  it('asks for a newer format for old .xls files and refuses other files', async () => {
    expect(await readStudentFile(new File(['x'], 'turma.xls'))).toEqual({ status: 'oldExcel' });
    expect(await readStudentFile(new File(['x'], 'turma.pdf'))).toEqual({ status: 'unsupported' });
  });

  it('reports a file without names', async () => {
    expect(await readStudentFile(new File(['1\n2\n'], 'turma.csv'))).toEqual({ status: 'empty' });
  });
});
