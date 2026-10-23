import { getStudentNames } from '@/features/classroom/services/classForm';
import { STUDENT_PLACEHOLDER } from '@/features/reports/constants';
import {
  EMPTY_EVALUATION,
  getClassTermKey,
  getStudentKey,
} from '@/features/reports/services/studentEvaluations';
import type { ReportDocumentData, ReportFormValues } from '@/features/reports/types';
import { formatLongDate, isIsoDate } from '@/lib/date/isoDate';

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

/** The common text first, then what was written for the student, with a blank line between. */
export const buildStudentParagraphs = (
  commonText: string,
  studentText: string,
  studentName: string,
): string[] => {
  const common = buildEvaluationParagraphs(commonText, studentName);
  const own = buildEvaluationParagraphs(studentText, studentName);

  return common.length > 0 && own.length > 0 ? [...common, '', ...own] : [...common, ...own];
};

export const buildReportData = (values: ReportFormValues): ReportDocumentData => {
  const classTermKey = getClassTermKey(values.classroomName, values.term);

  return {
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
    students: getStudentNames(values).map((name) => {
      const { text, absences } =
        values.evaluations[getStudentKey(classTermKey, name)] ?? EMPTY_EVALUATION;

      return {
        name: toUpperCase(name),
        paragraphs: buildStudentParagraphs(values.commonText, text, name),
        absences,
      };
    }),
  };
};

/**
 * Like `buildReportData`, for the HTML preview and print, which show the form while it is
 * still being filled in: without a valid date, the place-and-date line stays blank.
 */
export const buildPrintableReportData = (values: ReportFormValues) => {
  const hasPlaceAndDate = isIsoDate(values.documentDate);
  return {
    data: buildReportData(hasPlaceAndDate ? values : { ...values, documentDate: '2000-01-01' }),
    hasPlaceAndDate,
  };
};
