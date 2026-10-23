import { getClassInfo, getStudentNames } from '@/features/classroom/services/classForm';
import type { SheetStyle } from '@/features/classroom/types';
import { DEFAULT_WEIGHT, SUMMARY_OPTIONS } from '@/features/grades/constants';
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

/** The weight of each grade, by position; grades without one weigh `DEFAULT_WEIGHT`. */
export const getGradeWeights = (weights: number[], gradeCount: number): number[] =>
  Array.from({ length: gradeCount }, (_, index) => weights[index] ?? DEFAULT_WEIGHT);

type ResultOptions = Pick<GradesSheetData, 'summary' | 'includeRecovery' | 'includeStatus'>;

/** The calculated columns after the grades, in order. */
export const getResultColumnTitles = ({
  summary,
  includeRecovery,
  includeStatus,
}: ResultOptions): string[] => {
  const summaryTitle = getSummaryColumnTitle(summary);

  return summaryTitle
    ? [
        summaryTitle,
        ...(includeRecovery ? ['Recup.', 'Final'] : []),
        ...(includeStatus ? ['Situação'] : []),
      ]
    : [];
};

export const buildGradesSheetData = (
  values: GradesFormValues,
  style: SheetStyle,
): GradesSheetData => {
  const gradeTitles = getGradeTitles(values);
  // Recovery and status need a calculated column to compare with.
  const hasSummary = values.summary !== 'none';

  return {
    classInfo: getClassInfo(values),
    studentNames: getStudentNames(values),
    gradeTitles,
    summary: values.summary,
    maxGrade: values.maxGrade,
    weights: values.weighted ? getGradeWeights(values.weights, gradeTitles.length) : null,
    includeRecovery: hasSummary && values.includeRecovery,
    includeStatus: hasSummary && values.includeStatus,
    passingGrade: values.passingGrade,
    style,
  };
};
