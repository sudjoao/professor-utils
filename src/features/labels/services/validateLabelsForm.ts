import { validateStudents } from '@/features/classroom/services/classForm';
import type { ClassFormValues } from '@/features/classroom/types';
import { MAX_COPIES_PER_STUDENT } from '@/features/labels/constants';
import { getLabelModel, labelsPerSheet } from '@/features/labels/services/buildLabelSheets';
import type { LabelsFormValues } from '@/features/labels/types';
import type { FormError } from '@/lib/forms/formErrors';

const isWholeNumberBetween = (value: number, min: number, max: number): boolean =>
  Number.isInteger(value) && value >= min && value <= max;

export const validateLabelsForm = (values: ClassFormValues & LabelsFormValues): FormError[] => {
  const perSheet = labelsPerSheet(getLabelModel(values.modelId));

  return [
    ...validateStudents(values),
    ...(isWholeNumberBetween(values.copiesPerStudent, 1, MAX_COPIES_PER_STUDENT)
      ? []
      : [
          {
            field: 'copiesPerStudent',
            message: `As etiquetas por aluno precisam ser um número de 1 a ${MAX_COPIES_PER_STUDENT}.`,
          },
        ]),
    ...(isWholeNumberBetween(values.startAt, 1, perSheet)
      ? []
      : [
          {
            field: 'startAt',
            message: `A etiqueta de começo precisa ser um número de 1 a ${perSheet}.`,
          },
        ]),
  ];
};
