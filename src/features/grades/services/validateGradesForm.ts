import { getStudentNames } from '@/features/classroom/services/classForm';
import { MAX_GRADE_COLUMNS, MAX_GRADE_LIMIT } from '@/features/grades/constants';
import { getGradeTitles } from '@/features/grades/services/buildGradesSheetData';
import type { GradesFormValues } from '@/features/grades/types';

const validateGradeColumns = (values: GradesFormValues): string[] => {
  if (values.columnMode === 'count') {
    const { gradeCount } = values;
    const isValidCount =
      Number.isInteger(gradeCount) && gradeCount >= 1 && gradeCount <= MAX_GRADE_COLUMNS;

    return isValidCount ? [] : [`Informe uma quantidade de notas entre 1 e ${MAX_GRADE_COLUMNS}.`];
  }

  const titlesCount = getGradeTitles(values).length;

  if (titlesCount === 0) {
    return ['Informe o título de pelo menos uma nota.'];
  }
  if (titlesCount > MAX_GRADE_COLUMNS) {
    return [`A lista pode ter no máximo ${MAX_GRADE_COLUMNS} notas (hoje são ${titlesCount}).`];
  }
  return [];
};

const validateMaxGrade = ({ maxGrade }: GradesFormValues): string[] =>
  Number.isFinite(maxGrade) && maxGrade > 0 && maxGrade <= MAX_GRADE_LIMIT
    ? []
    : [`Informe uma nota máxima maior que 0 e até ${MAX_GRADE_LIMIT}.`];

/** Returns the messages to show the teacher; an empty list means the sheet can be generated. */
export const validateGradesForm = (values: GradesFormValues): string[] => [
  ...(getStudentNames(values).length === 0 ? ['Informe pelo menos um aluno.'] : []),
  ...validateGradeColumns(values),
  ...validateMaxGrade(values),
];
