import { MAX_LESSON_COLUMNS, MAX_RANGE_DAYS } from '@/features/attendance/constants';
import {
  getAttendanceColumns,
  getStudentNames,
} from '@/features/attendance/services/buildAttendanceSheetData';
import { getRangeLength, isCompleteRange } from '@/features/attendance/services/buildLessonDates';
import type { AttendanceFormValues } from '@/features/attendance/types';

const validateDateRanges = ({ dateRanges, weekdays }: AttendanceFormValues): string[] => {
  const completeRanges = dateRanges.filter(isCompleteRange);
  const errors: string[] = [];

  if (dateRanges.length === 0) {
    errors.push('Adicione pelo menos um período.');
  }
  if (completeRanges.length < dateRanges.length) {
    errors.push('Preencha a data inicial e a data final de todos os períodos.');
  }
  if (completeRanges.some((range) => getRangeLength(range) < 1)) {
    errors.push('A data final de cada período deve ser igual ou posterior à data inicial.');
  }
  if (completeRanges.some((range) => getRangeLength(range) > MAX_RANGE_DAYS)) {
    errors.push(`Cada período pode ter no máximo ${MAX_RANGE_DAYS} dias.`);
  }
  if (weekdays.length === 0) {
    errors.push('Selecione pelo menos um dia da semana.');
  }

  return errors;
};

const validateLessonCount = ({ lessonCount }: AttendanceFormValues): string[] =>
  Number.isInteger(lessonCount) && lessonCount >= 1 && lessonCount <= MAX_LESSON_COLUMNS
    ? []
    : [`Informe uma quantidade de aulas entre 1 e ${MAX_LESSON_COLUMNS}.`];

const validateColumnsCount = (values: AttendanceFormValues): string[] => {
  const columnsCount = getAttendanceColumns(values).length;

  if (columnsCount === 0) {
    return ['Nenhuma data encontrada nos períodos e dias da semana selecionados.'];
  }
  if (columnsCount > MAX_LESSON_COLUMNS) {
    return [`A lista pode ter no máximo ${MAX_LESSON_COLUMNS} aulas (hoje são ${columnsCount}).`];
  }
  return [];
};

/** Returns the messages to show the teacher; an empty list means the sheet can be generated. */
export const validateAttendanceForm = (values: AttendanceFormValues): string[] => {
  const studentErrors =
    getStudentNames(values).length === 0 ? ['Informe pelo menos um aluno.'] : [];

  const columnErrors =
    values.columnMode === 'dates' ? validateDateRanges(values) : validateLessonCount(values);

  return [
    ...studentErrors,
    ...columnErrors,
    ...(columnErrors.length === 0 ? validateColumnsCount(values) : []),
  ];
};
