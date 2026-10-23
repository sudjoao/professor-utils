/** The lesson cells of one worksheet ("Página 1", "Página 2"...), as column letters. */
export type LessonRange = {
  sheetName: string;
  firstColumn: string;
  lastColumn: string;
};

/** Marks that count as an absence: F (falta) and J (falta justificada), in any case. */
export const ABSENCE_MARKS = ['F', 'J'];

/** Minimum attendance before the frequency is shown in red. */
export const MIN_ATTENDANCE = 0.75;

const quoteSheetName = (sheetName: string): string => `'${sheetName.replaceAll("'", "''")}'`;

const rowRange = ({ sheetName, firstColumn, lastColumn }: LessonRange, row: number): string =>
  `${quoteSheetName(sheetName)}!${firstColumn}${row}:${lastColumn}${row}`;

/** Absences of a student over every page: COUNTIF is case-insensitive, so "f" also counts. */
export const buildAbsencesFormula = (ranges: LessonRange[], row: number): string =>
  ranges
    .flatMap((range) => ABSENCE_MARKS.map((mark) => `COUNTIF(${rowRange(range, row)},"${mark}")`))
    .join('+');

/**
 * Attendance over the lessons already marked (any mark: P, ".", F...), so it is right in the
 * middle of the term too. Blank while nothing is marked.
 */
export const buildFrequencyFormula = (
  ranges: LessonRange[],
  row: number,
  absencesCell: string,
): string => {
  const marked = ranges.map((range) => `COUNTA(${rowRange(range, row)})`).join('+');
  return `IF((${marked})=0,"",1-${absencesCell}/(${marked}))`;
};
