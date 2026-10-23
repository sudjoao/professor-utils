import type { StudentEvaluation } from '@/features/reports/types';

export const EMPTY_EVALUATION: StudentEvaluation = { text: '', absences: null };

const normalizeKeyPart = (text: string): string =>
  text.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');

/**
 * Evaluations are kept per class and term ("7º A" in the 2nd term), so the next term starts
 * blank and the previous one is still there. Names are compared ignoring case and extra spaces.
 */
export const getClassTermKey = (classroomName: string, term: number): string =>
  `${normalizeKeyPart(classroomName)}|${term}`;

export const getStudentKey = (classTermKey: string, studentName: string): string =>
  `${classTermKey}|${normalizeKeyPart(studentName)}`;

export const isEmptyEvaluation = ({ text, absences }: StudentEvaluation): boolean =>
  text.trim().length === 0 && absences === null;

/** Every key that belongs to a class and term, to clear (or put back) all of them at once. */
export const belongsToClassTerm = (key: string, classTermKey: string): boolean =>
  key.startsWith(`${classTermKey}|`);

/** "12" → 12; blank → `null` (not filled in); anything else keeps only the digits. */
export const parseAbsences = (text: string): number | null => {
  const digits = text.replace(/\D/g, '');
  return digits ? Number(digits) : null;
};
