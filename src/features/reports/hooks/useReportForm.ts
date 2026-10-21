import { useMemo, useState } from 'react';

import {
  getStudentNames,
  INITIAL_CLASS_FORM_VALUES,
} from '@/features/classroom/services/classForm';
import type { ClassFormValues } from '@/features/classroom/types';
import {
  INITIAL_REPORT_SETTINGS,
  REPORT_SETTINGS_KEYS,
  selectReportSettings,
  updateReportSettings,
} from '@/features/reports/reportSettingsSlice';
import { validateReportForm } from '@/features/reports/services/validateReportForm';
import type { ReportFormValues, ReportSettings } from '@/features/reports/types';
import { useToday } from '@/lib/date/useToday';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

/** What changes on every export; school data lives in the persisted `reportSettings` slice. */
type LocalValues = ClassFormValues &
  Pick<ReportFormValues, 'schoolYear' | 'documentDate' | 'commonText'>;

const INITIAL_LOCAL_VALUES: LocalValues = {
  ...INITIAL_CLASS_FORM_VALUES,
  schoolYear: '',
  documentDate: '',
  commonText: '',
};

const isSettingsKey = (key: string): key is keyof ReportSettings =>
  (REPORT_SETTINGS_KEYS as string[]).includes(key);

const splitChanges = (changes: Partial<ReportFormValues>) => {
  const entries = Object.entries(changes);

  return {
    settings: Object.fromEntries(
      entries.filter(([key]) => isSettingsKey(key)),
    ) as Partial<ReportSettings>,
    local: Object.fromEntries(
      entries.filter(([key]) => !isSettingsKey(key)),
    ) as Partial<LocalValues>,
  };
};

export const useReportForm = () => {
  const dispatch = useAppDispatch();
  const settings = usePersistedSelector(selectReportSettings, INITIAL_REPORT_SETTINGS);
  const [localValues, setLocalValues] = useState<LocalValues>(INITIAL_LOCAL_VALUES);
  const today = useToday();

  const values = useMemo<ReportFormValues>(
    () => ({
      ...localValues,
      ...settings,
      // Blank fields count as today, like the attendance dates.
      schoolYear: localValues.schoolYear || today?.slice(0, 4) || '',
      documentDate: localValues.documentDate || today || '',
    }),
    [localValues, settings, today],
  );

  const updateValues = (changes: Partial<ReportFormValues>) => {
    const { settings: settingsChanges, local } = splitChanges(changes);

    if (Object.keys(settingsChanges).length > 0) {
      dispatch(updateReportSettings(settingsChanges));
    }
    if (Object.keys(local).length > 0) {
      setLocalValues((current) => ({ ...current, ...local }));
    }
  };

  const studentNames = useMemo(() => getStudentNames(values), [values]);
  const errors = useMemo(() => validateReportForm(values), [values]);

  return { values, updateValues, studentNames, errors };
};
