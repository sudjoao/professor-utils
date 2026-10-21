import { describe, expect, it } from 'vitest';

import {
  INITIAL_REPORT_SETTINGS,
  reportSettingsReducer,
  updateReportSettings,
} from '@/features/reports/reportSettingsSlice';

describe('reportSettingsSlice', () => {
  it('updates only the given settings', () => {
    const state = reportSettingsReducer(
      INITIAL_REPORT_SETTINGS,
      updateReportSettings({ schoolName: 'Escola Classe 18 do Gama', term: 2 }),
    );

    expect(state).toEqual({
      ...INITIAL_REPORT_SETTINGS,
      schoolName: 'Escola Classe 18 do Gama',
      term: 2,
    });
  });
});
