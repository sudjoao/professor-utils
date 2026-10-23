export type NotesPerPage = 1 | 2 | 3 | 4;

/** What the teacher writes once; saved in the browser so a closed page does not lose it. */
export type ParentNoteDraft = {
  title: string;
  message: string;
  includeReceipt: boolean;
  notesPerPage: NotesPerPage;
};

export type ParentNote = {
  studentName: string;
  title: string;
  schoolName: string;
  paragraphs: string[];
  /** Place and date, e.g. "Gama/DF, 23 de outubro de 2026", or blank. */
  dateLine: string;
  signature: string;
  includeReceipt: boolean;
};
