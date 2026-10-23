import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_STAGE } from '@/features/reports/constants';
import type { ReportSettings } from '@/features/reports/types';

export const INITIAL_REPORT_SETTINGS: ReportSettings = {
  regionalCoordination: '',
  schoolName: '',
  stage: DEFAULT_STAGE,
  grade: '',
  shift: 'morning',
  term: 1,
  schoolDays: 0,
  city: '',
  teacherRegistration: '',
  coordinatorRegistration: '',
};

export const REPORT_SETTINGS_KEYS = Object.keys(
  INITIAL_REPORT_SETTINGS,
) as (keyof ReportSettings)[];

const reportSettingsSlice = createSlice({
  name: 'reportSettings',
  initialState: INITIAL_REPORT_SETTINGS,
  reducers: {
    updateReportSettings: (state, action: PayloadAction<Partial<ReportSettings>>) => ({
      ...state,
      ...action.payload,
    }),
  },
  selectors: {
    selectReportSettings: (state) => state,
  },
});

export const { updateReportSettings } = reportSettingsSlice.actions;
export const { selectReportSettings } = reportSettingsSlice.selectors;
export const reportSettingsReducer = reportSettingsSlice.reducer;
