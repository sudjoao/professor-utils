import { MAX_LESSON_COLUMNS, MAX_RANGE_DAYS } from '@/features/attendance/constants';
import { getAttendanceColumns } from '@/features/attendance/services/buildAttendanceSheetData';
import { getRangeLength, isCompleteRange } from '@/features/attendance/services/buildLessonDates';
import type { AttendanceFormValues } from '@/features/attendance/types';
import { validateStudents } from '@/features/classroom/services/classForm';
import type { FormError } from '@/lib/forms/formErrors';

const dateRangesError = (message: string): FormError => ({ field: 'dateRanges', message });

const validateDateRanges = ({ dateRanges, weekdays }: AttendanceFormValues): FormError[] => {
  const completeRanges = dateRanges.filter(isCompleteRange);
  const errors: FormError[] = [];

  if (dateRanges.length === 0) {
    errors.push(dateRangesError('Adicione pelo menos um período de aulas.'));
  }
  if (completeRanges.length < dateRanges.length) {
    errors.push(dateRangesError('Preencha as duas datas ("De" e "Até") de todos os períodos.'));
  }
  if (completeRanges.some((range) => getRangeLength(range) < 1)) {
    errors.push(
      dateRangesError('Em cada período, a data "Até" precisa ser igual ou depois da data "De".'),
    );
  }
  if (completeRanges.some((range) => getRangeLength(range) > MAX_RANGE_DAYS)) {
    errors.push(
      dateRangesError(
        `Cada período pode ter no máximo ${MAX_RANGE_DAYS} dias. Divida em períodos menores.`,
      ),
    );
  }
  if (weekdays.length === 0) {
    errors.push({ field: 'weekdays', message: 'Escolha pelo menos um dia da semana com aula.' });
  }

  return errors;
};

const validateLessonCount = ({ lessonCount }: AttendanceFormValues): FormError[] =>
  Number.isInteger(lessonCount) && lessonCount >= 1 && lessonCount <= MAX_LESSON_COLUMNS
    ? []
    : [
        {
          field: 'lessonCount',
          message: `A quantidade de aulas precisa ser um número de 1 a ${MAX_LESSON_COLUMNS}.`,
        },
      ];

const validateColumnsCount = (values: AttendanceFormValues): FormError[] => {
  const columnsCount = getAttendanceColumns(values).length;

  if (columnsCount === 0) {
    return [
      dateRangesError(
        'Nenhuma data de aula encontrada. Confira o período e os dias da semana escolhidos.',
      ),
    ];
  }
  if (columnsCount > MAX_LESSON_COLUMNS) {
    return [
      dateRangesError(
        `A lista pode ter no máximo ${MAX_LESSON_COLUMNS} aulas, mas o período escolhido tem ${columnsCount}. Diminua o período.`,
      ),
    ];
  }
  return [];
};

/** Returns the messages to show the teacher; an empty list means the sheet can be generated. */
export const validateAttendanceForm = (values: AttendanceFormValues): FormError[] => {
  if (values.columnMode === 'signature') {
    return validateStudents(values);
  }

  const columnErrors =
    values.columnMode === 'dates' ? validateDateRanges(values) : validateLessonCount(values);

  return [
    ...validateStudents(values),
    ...columnErrors,
    ...(columnErrors.length === 0 ? validateColumnsCount(values) : []),
  ];
};
