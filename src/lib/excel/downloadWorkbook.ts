import type { Workbook } from 'exceljs';

const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const downloadWorkbook = async (workbook: Workbook, fileName: string): Promise<void> => {
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer], { type: XLSX_MIME_TYPE }));

  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.xlsx`;
  link.click();

  // Revoking on the next tick gives Safari time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};
