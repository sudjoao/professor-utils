/** One column of a printed class sheet: up to two header lines and an optional fixed value. */
export type PrintColumn = {
  label: string;
  caption?: string;
  /**
   * Share of the free width compared to the other columns (default 1): a text column with
   * weight 3 is three times as wide as a number column.
   */
  weight?: number;
};

/** One printed page: the same students, with a slice of the columns. */
export type PrintPage = {
  title: string;
  info: string;
  columns: PrintColumn[];
  /** A row under the headers with a value per column (e.g. the weight of each grade). */
  extraRow?: { label: string; values: (string | number)[] };
  legend?: string;
};

/** Width of each data column, in % of the table, sharing what Nº and the name leave free. */
export const getColumnWidths = (columns: PrintColumn[], freeWidth: number): number[] => {
  const weights = columns.map(({ weight = 1 }) => weight);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map((weight) => (total > 0 ? (weight / total) * freeWidth : 0));
};

export type PrintableSheet = {
  orientation: 'portrait' | 'landscape';
  /** Taller rows leave room to sign. */
  tallRows: boolean;
  studentNames: string[];
  pages: PrintPage[];
};
