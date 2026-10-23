import type { ClassFormValues } from '@/features/classroom/types';
import type { IsoDate } from '@/lib/date/isoDate';

export type Shift = 'morning' | 'afternoon' | 'fullTime';

export type Term = 1 | 2 | 3 | 4;

/** School data that rarely changes, kept in the browser between one term and the next. */
export type ReportSettings = {
  regionalCoordination: string;
  schoolName: string;
  stage: string;
  grade: string;
  shift: Shift;
  /** `null` until the teacher picks one: the report follows the school calendar meanwhile. */
  term: Term | null;
  schoolDays: number;
  city: string;
  teacherRegistration: string;
  coordinatorRegistration: string;
};

/** What the teacher writes for one student in the app (all optional). */
export type StudentEvaluation = {
  text: string;
  /** `null` while not filled in: the document keeps the blank to fill in Word. */
  absences: number | null;
};

export type ReportFormValues = ClassFormValues &
  Omit<ReportSettings, 'term'> & {
    term: Term;
    schoolYear: string;
    documentDate: IsoDate;
    commonText: string;
    /** Uploaded header image as a data URL; `null` uses the default DF coat of arms. */
    headerImage: string | null;
    /** Evaluations by student key (see `getStudentKey`). */
    evaluations: Record<string, StudentEvaluation>;
  };

export type StudentReport = {
  name: string;
  /** Evaluation paragraphs; empty when the teacher will write everything in Word. */
  paragraphs: string[];
  absences: number | null;
};

export type ReportDocumentData = {
  schoolYear: string;
  stage: string;
  regionalCoordination: string;
  schoolName: string;
  grade: string;
  classroomName: string;
  shift: Shift;
  teacherName: string;
  term: Term;
  schoolDays: number;
  /** Place and date already formatted, e.g. `Gama/DF, 28 de abril de 2022.` */
  placeAndDate: string;
  teacherRegistration: string;
  coordinatorRegistration: string;
  students: StudentReport[];
};

export type HeaderImage = {
  data: ArrayBuffer;
  type: 'png' | 'jpg';
  width: number;
  height: number;
};
