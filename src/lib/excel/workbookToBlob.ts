import type { Workbook } from 'exceljs';

const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const workbookToBlob = async (workbook: Workbook): Promise<Blob> =>
  new Blob([await workbook.xlsx.writeBuffer()], { type: XLSX_MIME_TYPE });
