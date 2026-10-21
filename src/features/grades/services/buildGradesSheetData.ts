import { getClassInfo, getStudentNames } from '@/features/classroom/services/classForm';
import { SUMMARY_OPTIONS } from '@/features/grades/constants';
import type { GradeSummary, GradesFormValues, GradesSheetData } from '@/features/grades/types';
import { parseLines } from '@/lib/text/parseLines';

const toNumberedTitles = (count: number): string[] =>
  Array.from({ length: count }, (_, index) => `Nota ${index + 1}`);

export const getGradeTitles = ({
  columnMode,
  gradeCount,
  gradeTitlesText,
}: GradesFormValues): string[] =>
  columnMode === 'count' ? toNumberedTitles(gradeCount) : parseLines(gradeTitlesText);

/** Title of the calculated column, or `undefined` when the teacher chose no calculation. */
export const getSummaryColumnTitle = (summary: GradeSummary): string | undefined =>
  SUMMARY_OPTIONS.find(({ value }) => value === summary)?.columnTitle;

export const buildGradesSheetData = (values: GradesFormValues): GradesSheetData => ({
  classInfo: getClassInfo(values),
  studentNames: getStudentNames(values),
  gradeTitles: getGradeTitles(values),
  summary: values.summary,
  maxGrade: values.maxGrade,
});
