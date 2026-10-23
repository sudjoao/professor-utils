import type { BackupData, BackupFile, BackupParseResult } from '@/features/backup/types';
import { INITIAL_SHEET_STYLE } from '@/features/classroom/constants';
import { INITIAL_CLASS_FORM_VALUES } from '@/features/classroom/services/classForm';
import type { Classroom } from '@/features/classroom/types';
import { INITIAL_REPORT_SETTINGS } from '@/features/reports/reportSettingsSlice';
import { daysBetween, type IsoDate } from '@/lib/date/isoDate';
import { mergeKnownFields } from '@/lib/object/mergeKnownFields';

export const BACKUP_APP_ID = 'professor-utils';
export const BACKUP_VERSION = 1;

/** After this many days without a copy, the home page reminds the teacher to make one. */
export const BACKUP_REMINDER_DAYS = 30;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';

const toClassroom = (value: unknown): Classroom | null => {
  if (!isRecord(value) || !isString(value.id) || !isString(value.name)) {
    return null;
  }

  const students = Array.isArray(value.students) ? value.students : [];
  return {
    id: value.id,
    name: value.name,
    ...(isString(value.subject) ? { subject: value.subject } : {}),
    students: students.filter(
      (student): student is Classroom['students'][number] =>
        isRecord(student) && isString(student.id) && isString(student.name),
    ),
  };
};

const toHeaderImage = (value: unknown): string | null =>
  isString(value) && value.startsWith('data:image/') ? value : null;

/** Reads the data of a backup without trusting it: unknown or broken parts get the defaults. */
export const normalizeBackupData = (data: unknown): BackupData => {
  const source = isRecord(data) ? data : {};

  return {
    classrooms: (Array.isArray(source.classrooms) ? source.classrooms : [])
      .map(toClassroom)
      .filter((classroom): classroom is Classroom => classroom !== null),
    classDraft: mergeKnownFields(INITIAL_CLASS_FORM_VALUES, source.classDraft),
    sheetStyle: mergeKnownFields(INITIAL_SHEET_STYLE, source.sheetStyle),
    reportSettings: mergeKnownFields(INITIAL_REPORT_SETTINGS, source.reportSettings),
    headerImage: toHeaderImage(source.headerImage),
  };
};

export const serializeBackup = (data: BackupData, createdAt: string): string =>
  JSON.stringify({
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    createdAt,
    data,
  } satisfies BackupFile);

export const parseBackup = (text: string): BackupParseResult => {
  let file: unknown;
  try {
    file = JSON.parse(text);
  } catch {
    return { status: 'invalid' };
  }

  if (!isRecord(file) || file.app !== BACKUP_APP_ID) {
    return { status: 'notBackup' };
  }
  if (typeof file.version !== 'number' || file.version > BACKUP_VERSION) {
    return { status: 'newer' };
  }

  return {
    status: 'ok',
    backup: {
      app: BACKUP_APP_ID,
      version: file.version,
      createdAt: isString(file.createdAt) ? file.createdAt : '',
      data: normalizeBackupData(file.data),
    },
  };
};

export const getBackupFileName = (today: IsoDate): string => `professor-utils-copia-${today}.json`;

export const summarizeBackup = ({
  classrooms,
  reportSettings,
  headerImage,
}: Pick<BackupData, 'classrooms' | 'reportSettings' | 'headerImage'>) => ({
  classroomCount: classrooms.length,
  studentCount: classrooms.reduce((total, { students }) => total + students.length, 0),
  hasSchoolData: reportSettings.schoolName.trim().length > 0,
  hasHeaderImage: headerImage !== null,
});

type BackupReminderOptions = {
  classroomCount: number;
  lastBackupAt: IsoDate | null;
  remindAfter: IsoDate | null;
  today: IsoDate;
};

/** Reminds when there are saved classrooms and no copy in the last month (unless postponed). */
export const shouldRemindBackup = ({
  classroomCount,
  lastBackupAt,
  remindAfter,
  today,
}: BackupReminderOptions): boolean =>
  classroomCount > 0 &&
  (!remindAfter || today >= remindAfter) &&
  (!lastBackupAt || daysBetween(lastBackupAt, today) >= BACKUP_REMINDER_DAYS);
