import { validateStudents } from '@/features/classroom/services/classForm';
import { MAX_SCHOOL_DAYS } from '@/features/reports/constants';
import type { ReportFormValues } from '@/features/reports/types';
import { isIsoDate } from '@/lib/date/isoDate';
import type { FormError } from '@/lib/forms/formErrors';

const SCHOOL_YEAR_PATTERN = /^\d{4}$/;

const REQUIRED_FIELDS: { name: keyof ReportFormValues; label: string }[] = [
  { name: 'classroomName', label: 'Turma' },
  { name: 'teacherName', label: 'Professor(a)' },
  { name: 'regionalCoordination', label: 'Coordenação Regional de Ensino' },
  { name: 'schoolName', label: 'Unidade Escolar' },
  { name: 'stage', label: 'Etapa' },
  { name: 'grade', label: 'Ano' },
  { name: 'city', label: 'Local' },
];

const findMissingFields = (values: ReportFormValues): FormError[] =>
  REQUIRED_FIELDS.filter(({ name }) => String(values[name]).trim().length === 0).map(
    ({ name, label }) => ({ field: name, message: `Preencha o campo "${label}".` }),
  );

/** Returns the messages to show the teacher; an empty list means the document can be generated. */
export const validateReportForm = (values: ReportFormValues): FormError[] => {
  const { schoolDays } = values;
  const errors: FormError[] = [...validateStudents(values), ...findMissingFields(values)];

  if (!SCHOOL_YEAR_PATTERN.test(values.schoolYear.trim())) {
    errors.push({
      field: 'schoolYear',
      message: 'O ano letivo precisa ter 4 números (ex.: 2026).',
    });
  }
  if (!(Number.isInteger(schoolDays) && schoolDays >= 1 && schoolDays <= MAX_SCHOOL_DAYS)) {
    errors.push({
      field: 'schoolDays',
      message: `Informe o total de dias letivos (um número de 1 a ${MAX_SCHOOL_DAYS}).`,
    });
  }
  if (!isIsoDate(values.documentDate)) {
    errors.push({ field: 'documentDate', message: 'Informe a data do documento.' });
  }

  return errors;
};
