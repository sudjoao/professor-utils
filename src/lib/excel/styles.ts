import type { Borders, Cell, Fill } from 'exceljs';

export const A4_PAPER_SIZE = 9;

export const THIN_BORDER: Partial<Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

export const solidFill = (argb: string): Fill => ({
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb },
});

export const HEADER_FILL = solidFill('FFE5E7EB');
export const STRIPE_FILL = solidFill('FFF5F5F5');

export const styleHeaderCell = (cell: Cell, fontSize = 10) => {
  cell.font = { bold: true, size: fontSize };
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  cell.border = THIN_BORDER;
  cell.fill = HEADER_FILL;
};
