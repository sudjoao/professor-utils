import { describe, expect, it } from 'vitest';

import {
  BACKUP_VERSION,
  getBackupFileName,
  parseBackup,
  serializeBackup,
  shouldRemindBackup,
  summarizeBackup,
} from '@/features/backup/services/backup';
import type { BackupData } from '@/features/backup/types';
import { INITIAL_SHEET_STYLE } from '@/features/classroom/constants';
import { INITIAL_CLASS_FORM_VALUES } from '@/features/classroom/services/classForm';
import { INITIAL_REPORT_SETTINGS } from '@/features/reports/reportSettingsSlice';

const data: BackupData = {
  classrooms: [
    {
      id: '1',
      name: '7º A',
      subject: 'Matemática',
      students: [
        { id: 'a', name: 'Ana' },
        { id: 'b', name: 'Bruno' },
      ],
    },
  ],
  classDraft: { ...INITIAL_CLASS_FORM_VALUES, teacherName: 'Sandra' },
  sheetStyle: { ...INITIAL_SHEET_STYLE, paletteId: 'blue' },
  reportSettings: { ...INITIAL_REPORT_SETTINGS, schoolName: 'EC 18' },
  studentEvaluations: {
    evaluations: { '7º a|2|ana': { text: 'Leu bem.', absences: 2 } },
    commonTexts: { '7º a|2': 'Comum.' },
  },
  customPhrases: [{ id: 'p1', text: '[ALUNO] participou.' }],
  seatingCharts: { '7º a': { rows: 1, columns: 2, seats: ['Ana', null] } },
  headerImage: 'data:image/png;base64,AAAA',
};

describe('serializeBackup / parseBackup', () => {
  it('reads back what it saved', () => {
    const result = parseBackup(serializeBackup(data, '2026-10-23T10:00:00.000Z'));

    expect(result).toEqual({
      status: 'ok',
      backup: {
        app: 'professor-utils',
        version: BACKUP_VERSION,
        createdAt: '2026-10-23T10:00:00.000Z',
        data,
      },
    });
  });

  it('refuses text that is not JSON, other files and copies from a newer version', () => {
    expect(parseBackup('not json')).toEqual({ status: 'invalid' });
    expect(parseBackup('{"name":"other app"}')).toEqual({ status: 'notBackup' });
    expect(parseBackup('{"app":"professor-utils","version":99,"data":{}}')).toEqual({
      status: 'newer',
    });
  });

  it('fills what is missing or broken with the defaults', () => {
    const text = JSON.stringify({
      app: 'professor-utils',
      version: 1,
      data: {
        classrooms: [{ id: '1', name: '7º A', students: [{ id: 'a', name: 'Ana' }, 42] }, 'x'],
        classDraft: { teacherName: 'Sandra', sortStudents: 'yes' },
        studentEvaluations: {
          evaluations: { ok: { text: 'A', absences: 1 }, broken: { text: 3 } },
          commonTexts: { ok: 'B', broken: 4 },
        },
        customPhrases: [{ id: 'p', text: 'C' }, { text: 'no id' }],
        seatingCharts: {
          ok: { rows: 1, columns: 2, seats: ['Ana', null] },
          wrongSize: { rows: 1, columns: 2, seats: ['Ana'] },
        },
        headerImage: 'https://example.com/image.png',
      },
    });
    const result = parseBackup(text);

    expect(result.status).toBe('ok');
    if (result.status !== 'ok') return;
    expect(result.backup.data).toEqual({
      classrooms: [{ id: '1', name: '7º A', students: [{ id: 'a', name: 'Ana' }] }],
      classDraft: { ...INITIAL_CLASS_FORM_VALUES, teacherName: 'Sandra' },
      sheetStyle: INITIAL_SHEET_STYLE,
      reportSettings: INITIAL_REPORT_SETTINGS,
      studentEvaluations: {
        evaluations: { ok: { text: 'A', absences: 1 } },
        commonTexts: { ok: 'B' },
      },
      customPhrases: [{ id: 'p', text: 'C' }],
      seatingCharts: { ok: { rows: 1, columns: 2, seats: ['Ana', null] } },
      headerImage: null,
    });
  });
});

describe('summarizeBackup', () => {
  it('counts what the copy has', () => {
    expect(summarizeBackup(data)).toEqual({
      classroomCount: 1,
      studentCount: 2,
      hasSchoolData: true,
      hasHeaderImage: true,
    });
  });
});

describe('getBackupFileName', () => {
  it('names the file with the date', () => {
    expect(getBackupFileName('2026-10-23')).toBe('professor-utils-copia-2026-10-23.json');
  });
});

describe('shouldRemindBackup', () => {
  const base = { classroomCount: 2, lastBackupAt: null, remindAfter: null, today: '2026-10-23' };

  it('reminds when there are classrooms and no copy yet', () => {
    expect(shouldRemindBackup(base)).toBe(true);
  });

  it('does not remind without saved classrooms', () => {
    expect(shouldRemindBackup({ ...base, classroomCount: 0 })).toBe(false);
  });

  it('reminds again a month after the last copy', () => {
    expect(shouldRemindBackup({ ...base, lastBackupAt: '2026-10-01' })).toBe(false);
    expect(shouldRemindBackup({ ...base, lastBackupAt: '2026-09-20' })).toBe(true);
  });

  it('waits when the teacher asked to be reminded later', () => {
    expect(shouldRemindBackup({ ...base, remindAfter: '2026-10-30' })).toBe(false);
    expect(shouldRemindBackup({ ...base, remindAfter: '2026-10-23' })).toBe(true);
  });
});
