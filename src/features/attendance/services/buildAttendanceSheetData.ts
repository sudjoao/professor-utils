import { selectLessonDates } from '@/features/attendance/services/buildLessonDates';
import {
  toDateColumns,
  toNumberedColumns,
} from '@/features/attendance/services/buildAttendanceColumns';
import type {
  AttendanceColumn,
  AttendanceFormValues,
  AttendanceSheetData,
} from '@/features/attendance/types';
import { parseStudentNames } from '@/lib/text/parseStudentNames';

const sortByName = (names: string[]): string[] =>
  [...names].sort((first, second) => first.localeCompare(second, 'pt-BR', { sensitivity: 'base' }));

export const getStudentNames = ({ studentsText, sortStudents }: AttendanceFormValues): string[] => {
  const names = parseStudentNames(studentsText);
  return sortStudents ? sortByName(names) : names;
};

export const getAttendanceColumns = (values: AttendanceFormValues): AttendanceColumn[] =>
  values.columnMode === 'dates'
    ? toDateColumns(selectLessonDates(values))
    : toNumberedColumns(values.lessonCount);

export const buildAttendanceSheetData = (values: AttendanceFormValues): AttendanceSheetData => ({
  header: {
    classroomName: values.classroomName.trim(),
    subject: values.subject.trim(),
    teacherName: values.teacherName.trim(),
  },
  studentNames: getStudentNames(values),
  columns: getAttendanceColumns(values),
});
