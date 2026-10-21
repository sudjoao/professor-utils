import type { Classroom, ClassFormValues, ClassInfo } from '@/features/classroom/types';
import type { FormError } from '@/lib/forms/formErrors';
import { parseLines } from '@/lib/text/parseLines';

export const INITIAL_CLASS_FORM_VALUES: ClassFormValues = {
  classroomName: '',
  subject: '',
  teacherName: '',
  studentsText: '',
  sortStudents: true,
};

const compareNames = (first: string, second: string): number =>
  first.localeCompare(second, 'pt-BR', { sensitivity: 'base' });

const sortByName = (names: string[]): string[] => [...names].sort(compareNames);

/** Same name ignoring case and accents: "7º a" and "7º A" are the same classroom. */
export const isSameName = (first: string, second: string): boolean =>
  compareNames(first.trim(), second.trim()) === 0;

/**
 * Loading a saved classroom would throw away students the teacher already typed,
 * unless the field is empty or already has exactly those students.
 */
export const wouldReplaceStudents = (currentNames: string[], classroom: Classroom): boolean =>
  currentNames.length > 0 &&
  (currentNames.length !== classroom.students.length ||
    currentNames.some((name, index) => !isSameName(name, classroom.students[index].name)));

export const getStudentNames = ({
  studentsText,
  sortStudents,
}: Pick<ClassFormValues, 'studentsText' | 'sortStudents'>): string[] => {
  const names = parseLines(studentsText);
  return sortStudents ? sortByName(names) : names;
};

export const getClassInfo = ({ classroomName, subject, teacherName }: ClassInfo): ClassInfo => ({
  classroomName: classroomName.trim(),
  subject: subject.trim(),
  teacherName: teacherName.trim(),
});

export const toClassFormValues = ({
  name,
  students,
}: Classroom): Pick<ClassFormValues, 'classroomName' | 'studentsText'> => ({
  classroomName: name,
  studentsText: students.map((student) => student.name).join('\n'),
});

export const validateStudents = (values: ClassFormValues): FormError[] =>
  getStudentNames(values).length === 0
    ? [{ field: 'studentsText', message: 'Escreva o nome de pelo menos um aluno.' }]
    : [];
