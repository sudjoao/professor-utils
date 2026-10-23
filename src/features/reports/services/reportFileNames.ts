// Characters Windows does not accept in file names.
const FORBIDDEN_CHARACTERS = /[\\/:*?"<>|]/g;

const cleanFileName = (text: string): string =>
  text.replace(FORBIDDEN_CHARACTERS, '').replace(/\s+/g, ' ').trim();

/**
 * Name of one student's report inside the .zip, readable and in class order:
 * `01 - Ana Souza - RAv 2º bimestre.docx`.
 */
export const getStudentReportFileName = (
  index: number,
  studentName: string,
  term: number,
): string =>
  `${String(index + 1).padStart(2, '0')} - ${cleanFileName(studentName)} - RAv ${term}º bimestre.docx`;
