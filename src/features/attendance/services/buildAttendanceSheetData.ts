import {
  toDateColumns,
  toNumberedColumns,
} from '@/features/attendance/services/buildAttendanceColumns';
import { selectLessonDates } from '@/features/attendance/services/buildLessonDates';
import type {
  AttendanceColumn,
  AttendanceFormValues,
  AttendanceSheetData,
} from '@/features/attendance/types';
import { getClassInfo, getStudentNames } from '@/features/classroom/services/classForm';

export const getAttendanceColumns = (values: AttendanceFormValues): AttendanceColumn[] =>
  values.columnMode === 'dates'
    ? toDateColumns(selectLessonDates(values))
    : toNumberedColumns(values.lessonCount);

export const buildAttendanceSheetData = (values: AttendanceFormValues): AttendanceSheetData => ({
  classInfo: getClassInfo(values),
  studentNames: getStudentNames(values),
  columns: getAttendanceColumns(values),
});
