import type { Classroom, ClassFormValues, SheetStylePreferences } from '@/features/classroom/types';
import type { ReportSettings } from '@/features/reports/types';

/** Everything the app keeps in the browser that is worth taking to another computer. */
export type BackupData = {
  classrooms: Classroom[];
  classDraft: ClassFormValues;
  sheetStyle: SheetStylePreferences;
  reportSettings: ReportSettings;
  headerImage: string | null;
};

export type BackupFile = {
  app: string;
  version: number;
  /** When the copy was made, as an ISO timestamp. */
  createdAt: string;
  data: BackupData;
};

export type BackupParseResult =
  { status: 'ok'; backup: BackupFile } | { status: 'invalid' | 'notBackup' | 'newer' };
