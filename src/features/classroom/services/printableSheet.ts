/** One column of a printed class sheet: up to two header lines and an optional fixed value. */
export type PrintColumn = {
  label: string;
  caption?: string;
  /** Wider column (e.g. "Assinatura"), as a share of the free width. */
  wide?: boolean;
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

export type PrintableSheet = {
  orientation: 'portrait' | 'landscape';
  /** Taller rows leave room to sign. */
  tallRows: boolean;
  studentNames: string[];
  pages: PrintPage[];
};
