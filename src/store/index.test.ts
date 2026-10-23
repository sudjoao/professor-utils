import { describe, expect, it } from 'vitest';

import { saveClassroom } from '@/features/classroom/classroomSlice';
import { INITIAL_SHEET_STYLE } from '@/features/classroom/constants';
import { INITIAL_CLASS_FORM_VALUES } from '@/features/classroom/services/classForm';
import { INITIAL_REPORT_SETTINGS } from '@/features/reports/reportSettingsSlice';
import { makeStore } from '@/store';
import { stateRestored } from '@/store/actions';

describe('store', () => {
  it('replaces the saved slices when a backup is restored, keeping the others', () => {
    const store = makeStore();
    store.dispatch(saveClassroom({ name: 'Antiga', subject: '', studentNames: ['Ana'] }));

    const restored = {
      classroom: { classrooms: [{ id: '1', name: '7º A', students: [] }] },
      classDraft: { ...INITIAL_CLASS_FORM_VALUES, teacherName: 'Sandra' },
      sheetStyle: { ...INITIAL_SHEET_STYLE, paletteId: 'green' as const },
      reportSettings: { ...INITIAL_REPORT_SETTINGS, schoolName: 'EC 18' },
      studentEvaluations: { evaluations: {}, commonTexts: { '7º a|2': 'Comum.' } },
      phraseBank: { customPhrases: [] },
      seating: { charts: {} },
    };
    store.dispatch(stateRestored(restored));

    expect(store.getState()).toMatchObject(restored);
    expect(store.getState().backup).toEqual({ lastBackupAt: null, remindAfter: null });
  });
});
