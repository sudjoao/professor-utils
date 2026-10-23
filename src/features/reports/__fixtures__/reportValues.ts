import { INITIAL_CLASS_FORM_VALUES } from '@/features/classroom/services/classForm';
import { INITIAL_REPORT_SETTINGS } from '@/features/reports/reportSettingsSlice';
import type { ReportFormValues } from '@/features/reports/types';

/** A complete report form, based on the official example, for tests. */
export const buildReportValues = (overrides: Partial<ReportFormValues> = {}): ReportFormValues => ({
  ...INITIAL_CLASS_FORM_VALUES,
  ...INITIAL_REPORT_SETTINGS,
  classroomName: 'A',
  teacherName: 'Sandra Maria dos Santos',
  studentsText: 'Bernardo Andrade\nAlice Sousa Silvestre',
  regionalCoordination: 'Gama',
  schoolName: 'Escola Classe 18 do Gama',
  grade: '3º',
  term: 2,
  schoolDays: 50,
  city: 'Gama/DF',
  teacherRegistration: '32215-6',
  coordinatorRegistration: '210825-9',
  schoolYear: '2022',
  documentDate: '2022-07-11',
  commonText: '',
  headerImage: null,
  evaluations: {},
  ...overrides,
});
