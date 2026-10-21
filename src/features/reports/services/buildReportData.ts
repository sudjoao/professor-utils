import { getStudentNames } from '@/features/classroom/services/classForm';
import { STUDENT_PLACEHOLDER } from '@/features/reports/constants';
import type { ReportDocumentData, ReportFormValues } from '@/features/reports/types';
import { formatLongDate } from '@/lib/date/isoDate';

const LINE_BREAK = /\r?\n/;
const EDGE_BLANK_LINES = /^\s*\n|\n\s*$/g;

const toUpperCase = (text: string): string => text.trim().toLocaleUpperCase('pt-BR');

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const STUDENT_PLACEHOLDER_PATTERN = new RegExp(escapeRegExp(STUDENT_PLACEHOLDER), 'gi');

/**
 * Splits the common text into paragraphs (one per line, blank lines kept as spacing)
 * and puts the student's name wherever the teacher wrote `[ALUNO]`.
 */
export const buildEvaluationParagraphs = (commonText: string, studentName: string): string[] => {
  const text = commonText.replace(EDGE_BLANK_LINES, '');

  if (text.trim().length === 0) {
    return [];
  }

  return text
    .split(LINE_BREAK)
    .map((line) => line.trimEnd().replace(STUDENT_PLACEHOLDER_PATTERN, studentName));
};

export const buildReportData = (values: ReportFormValues): ReportDocumentData => ({
  schoolYear: values.schoolYear.trim(),
  stage: values.stage.trim(),
  regionalCoordination: values.regionalCoordination.trim(),
  schoolName: values.schoolName.trim(),
  grade: values.grade.trim(),
  classroomName: values.classroomName.trim(),
  shift: values.shift,
  // The official form writes people's names in capital letters.
  teacherName: toUpperCase(values.teacherName),
  term: values.term,
  schoolDays: values.schoolDays,
  placeAndDate: `${values.city.trim()}, ${formatLongDate(values.documentDate)}.`,
  teacherRegistration: values.teacherRegistration.trim(),
  coordinatorRegistration: values.coordinatorRegistration.trim(),
  students: getStudentNames(values).map((name) => ({
    name: toUpperCase(name),
    paragraphs: buildEvaluationParagraphs(values.commonText, name),
  })),
});
