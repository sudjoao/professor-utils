import type { Classroom, ClassFormValues, ClassInfo } from '@/features/classroom/types';
import { parseLines } from '@/lib/text/parseLines';

export const INITIAL_CLASS_FORM_VALUES: ClassFormValues = {
  classroomName: '',
  subject: '',
  teacherName: '',
  studentsText: '',
  sortStudents: true,
};

const sortByName = (names: string[]): string[] =>
  [...names].sort((first, second) => first.localeCompare(second, 'pt-BR', { sensitivity: 'base' }));

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
