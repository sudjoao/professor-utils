import { getStudentNames } from '@/features/classroom/services/classForm';
import type { ReportFormValues } from '@/features/reports/types';
import { isIsoDate } from '@/lib/date/isoDate';

const SCHOOL_YEAR_PATTERN = /^\d{4}$/;
const MAX_SCHOOL_DAYS = 366;

const REQUIRED_FIELDS: { name: keyof ReportFormValues; label: string }[] = [
  { name: 'classroomName', label: 'Turma' },
  { name: 'teacherName', label: 'Professor(a)' },
  { name: 'regionalCoordination', label: 'Coordenação Regional de Ensino' },
  { name: 'schoolName', label: 'Unidade Escolar' },
  { name: 'stage', label: 'Etapa' },
  { name: 'grade', label: 'Ano' },
  { name: 'city', label: 'Local' },
];

const findMissingFields = (values: ReportFormValues): string[] =>
  REQUIRED_FIELDS.filter(({ name }) => String(values[name]).trim().length === 0).map(
    ({ label }) => label,
  );

/** Returns the messages to show the teacher; an empty list means the document can be generated. */
export const validateReportForm = (values: ReportFormValues): string[] => {
  const missingFields = findMissingFields(values);
  const { schoolDays } = values;

  return [
    getStudentNames(values).length === 0 && 'Informe pelo menos um aluno.',
    missingFields.length > 0 && `Preencha: ${missingFields.join(', ')}.`,
    !SCHOOL_YEAR_PATTERN.test(values.schoolYear.trim()) && 'Informe o ano letivo com 4 dígitos.',
    !(Number.isInteger(schoolDays) && schoolDays >= 1 && schoolDays <= MAX_SCHOOL_DAYS) &&
      'Informe o total de dias letivos.',
    !isIsoDate(values.documentDate) && 'Informe a data do documento.',
  ].filter((error): error is string => Boolean(error));
};
