import type { NotesPerPage, ParentNote, ParentNoteDraft } from '@/features/parentNotes/types';
import { buildEvaluationParagraphs } from '@/features/reports/services/buildReportData';
import { formatLongDate, type IsoDate, isIsoDate } from '@/lib/date/isoDate';

export const NOTES_PER_PAGE_OPTIONS: { value: NotesPerPage; label: string }[] = [
  { value: 1, label: '1 por folha' },
  { value: 2, label: '2 por folha' },
  { value: 3, label: '3 por folha' },
  { value: 4, label: '4 por folha' },
];

export const INITIAL_PARENT_NOTE: ParentNoteDraft = {
  title: 'Bilhete aos responsáveis',
  message: '',
  includeReceipt: true,
  notesPerPage: 2,
};

type NoteContext = {
  studentNames: string[];
  teacherName: string;
  schoolName: string;
  city: string;
  date: IsoDate;
};

/** One note per student, with the name where the teacher wrote `[ALUNO]`. */
export const buildParentNotes = (
  draft: ParentNoteDraft,
  { studentNames, teacherName, schoolName, city, date }: NoteContext,
): ParentNote[] => {
  const longDate = isIsoDate(date) ? formatLongDate(date) : '';
  const dateLine = [city.trim(), longDate].filter(Boolean).join(', ');

  return studentNames.map((studentName) => ({
    studentName,
    title: draft.title.trim(),
    schoolName: schoolName.trim(),
    paragraphs: buildEvaluationParagraphs(draft.message, studentName),
    dateLine,
    signature: teacherName.trim() ? `Prof.(a) ${teacherName.trim()}` : '',
    includeReceipt: draft.includeReceipt,
  }));
};

/** Smaller letters when more notes share a sheet. */
export const getNoteFontSize = (notesPerPage: NotesPerPage): number =>
  ({ 1: 13, 2: 12, 3: 11, 4: 10 })[notesPerPage];
