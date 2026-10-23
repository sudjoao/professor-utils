/** Letters of the grade cells of one student row, e.g. `C`..`E` in row 6. */
export type GradeRow = {
  row: number;
  firstColumn: string;
  lastColumn: string;
};

const range = ({ row, firstColumn, lastColumn }: GradeRow): string =>
  `${firstColumn}${row}:${lastColumn}${row}`;

/** Same columns in the weights row, fixed with `$` so every student uses the same weights. */
const weightsRange = ({ firstColumn, lastColumn }: GradeRow, weightsRow: number): string =>
  `${firstColumn}$${weightsRow}:${lastColumn}$${weightsRow}`;

const blankUntilGraded = (grades: string, formula: string): string =>
  `IF(COUNT(${grades})=0,"",${formula})`;

export const buildAverageFormula = (grades: GradeRow, weightsRow?: number): string => {
  const cells = range(grades);

  if (weightsRow === undefined) {
    return blankUntilGraded(cells, `AVERAGE(${cells})`);
  }

  // Weighted average of the grades given so far: blank grades do not pull the average down.
  // SUMIFS adds the weights of the filled grades without array math, which some apps lack.
  const weights = weightsRange(grades, weightsRow);
  return blankUntilGraded(
    cells,
    `SUMPRODUCT(${cells},${weights})/SUMIFS(${weights},${cells},"<>")`,
  );
};

export const buildSumFormula = (grades: GradeRow, weightsRow?: number): string => {
  const cells = range(grades);
  return blankUntilGraded(
    cells,
    weightsRow === undefined
      ? `SUM(${cells})`
      : `SUMPRODUCT(${cells},${weightsRange(grades, weightsRow)})`,
  );
};

/** The final grade is the higher of the summary and the recovery grade (side by side). */
export const buildFinalFormula = (summaryCell: string, recoveryCell: string): string =>
  `IF(COUNT(${summaryCell},${recoveryCell})=0,"",MAX(${summaryCell},${recoveryCell}))`;

export const STATUS_PASSING = 'Na média';
export const STATUS_BELOW = 'Abaixo da média';

export const buildStatusFormula = (resultCell: string, passingGrade: number): string =>
  `IF(${resultCell}="","",IF(${resultCell}>=${passingGrade},"${STATUS_PASSING}","${STATUS_BELOW}"))`;
