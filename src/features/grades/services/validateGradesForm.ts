import { validateStudents } from '@/features/classroom/services/classForm';
import { MAX_GRADE_COLUMNS, MAX_GRADE_LIMIT, MAX_WEIGHT } from '@/features/grades/constants';
import { getGradeTitles, getGradeWeights } from '@/features/grades/services/buildGradesSheetData';
import type { GradesFormValues } from '@/features/grades/types';
import type { FormError } from '@/lib/forms/formErrors';
import { formatNumberInput } from '@/lib/number/numberInput';

const validateGradeColumns = (values: GradesFormValues): FormError[] => {
  if (values.columnMode === 'count') {
    const { gradeCount } = values;
    const isValidCount =
      Number.isInteger(gradeCount) && gradeCount >= 1 && gradeCount <= MAX_GRADE_COLUMNS;

    return isValidCount
      ? []
      : [
          {
            field: 'gradeCount',
            message: `A quantidade de notas precisa ser um número de 1 a ${MAX_GRADE_COLUMNS}.`,
          },
        ];
  }

  const titlesCount = getGradeTitles(values).length;

  if (titlesCount === 0) {
    return [{ field: 'gradeTitlesText', message: 'Escreva o nome de pelo menos uma nota.' }];
  }
  if (titlesCount > MAX_GRADE_COLUMNS) {
    return [
      {
        field: 'gradeTitlesText',
        message: `A lista pode ter no máximo ${MAX_GRADE_COLUMNS} notas, mas você escreveu ${titlesCount}.`,
      },
    ];
  }
  return [];
};

const validateMaxGrade = ({ maxGrade }: GradesFormValues): FormError[] =>
  Number.isFinite(maxGrade) && maxGrade > 0 && maxGrade <= MAX_GRADE_LIMIT
    ? []
    : [
        {
          field: 'maxGrade',
          message: `A nota máxima precisa ser maior que 0 e no máximo ${formatNumberInput(MAX_GRADE_LIMIT)}.`,
        },
      ];

const validateWeights = (values: GradesFormValues): FormError[] => {
  if (!values.weighted) {
    return [];
  }

  const weights = getGradeWeights(values.weights, getGradeTitles(values).length);
  const isValid = weights.every(
    (weight) => Number.isFinite(weight) && weight > 0 && weight <= MAX_WEIGHT,
  );

  return isValid
    ? []
    : [
        {
          field: 'weights',
          message: `Cada peso precisa ser um número maior que 0 e no máximo ${MAX_WEIGHT}.`,
        },
      ];
};

const validatePassingGrade = (values: GradesFormValues): FormError[] => {
  const usesPassingGrade =
    values.summary !== 'none' && (values.includeRecovery || values.includeStatus);
  const { passingGrade, maxGrade, summary } = values;

  if (!usesPassingGrade) {
    return [];
  }
  if (!Number.isFinite(passingGrade) || passingGrade <= 0) {
    return [{ field: 'passingGrade', message: 'A média mínima precisa ser maior que 0.' }];
  }
  if (summary === 'average' && passingGrade > maxGrade) {
    return [
      {
        field: 'passingGrade',
        message: `A média mínima não pode passar da nota máxima (${formatNumberInput(maxGrade)}).`,
      },
    ];
  }
  return [];
};

/** Returns the messages to show the teacher; an empty list means the sheet can be generated. */
export const validateGradesForm = (values: GradesFormValues): FormError[] => [
  ...validateStudents(values),
  ...validateGradeColumns(values),
  ...validateMaxGrade(values),
  ...validateWeights(values),
  ...validatePassingGrade(values),
];
