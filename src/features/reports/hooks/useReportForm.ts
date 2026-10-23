import { useMemo, useState } from 'react';

import { useClassDraft } from '@/features/classroom/hooks/useClassDraft';
import { getStudentNames } from '@/features/classroom/services/classForm';
import { headerImageStorage } from '@/features/reports/headerImageStorage';
import {
  INITIAL_REPORT_SETTINGS,
  REPORT_SETTINGS_KEYS,
  selectReportSettings,
  updateReportSettings,
} from '@/features/reports/reportSettingsSlice';
import { validateReportForm } from '@/features/reports/services/validateReportForm';
import type { ReportFormValues } from '@/features/reports/types';
import {
  findCurrentOrLastTerm,
  getSchoolTerm,
} from '@/features/schoolCalendar/services/schoolCalendar';
import { useToday } from '@/lib/date/useToday';
import { hasEntries, splitByKeys } from '@/lib/object/splitByKeys';
import { useStoredValue } from '@/lib/storage/useStoredValue';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

/**
 * What changes on every export. The class comes from the shared draft and the school data
 * from the persisted `reportSettings` slice.
 */
type LocalValues = Pick<ReportFormValues, 'schoolYear' | 'documentDate' | 'commonText'>;

const INITIAL_LOCAL_VALUES: LocalValues = {
  schoolYear: '',
  documentDate: '',
  commonText: '',
};

export const useReportForm = () => {
  const dispatch = useAppDispatch();
  const { classDraft, splitChanges } = useClassDraft();
  const settings = usePersistedSelector(selectReportSettings, INITIAL_REPORT_SETTINGS);
  const [localValues, setLocalValues] = useState<LocalValues>(INITIAL_LOCAL_VALUES);
  const headerImage = useStoredValue(headerImageStorage);
  const today = useToday();

  const schoolYear = localValues.schoolYear || today?.slice(0, 4) || '';
  const calendarSchoolDays = getSchoolTerm(Number(schoolYear), settings.term)?.schoolDays;
  const isSchoolDaysFromCalendar = !settings.schoolDays && calendarSchoolDays !== undefined;
  const currentTerm = today ? findCurrentOrLastTerm(today) : undefined;

  const values = useMemo<ReportFormValues>(
    () => ({
      ...classDraft,
      ...localValues,
      ...settings,
      // Blank fields count as today, like the attendance dates, and as the school calendar.
      schoolYear,
      documentDate: localValues.documentDate || today || '',
      schoolDays: settings.schoolDays || calendarSchoolDays || 0,
      headerImage,
    }),
    [classDraft, localValues, settings, today, schoolYear, calendarSchoolDays, headerImage],
  );

  // The header image is saved apart, with `saveHeaderImage`.
  const updateValues = (changes: Partial<Omit<ReportFormValues, 'headerImage'>>) => {
    const [settingsChanges, local] = splitByKeys(splitChanges(changes), REPORT_SETTINGS_KEYS);
    if (hasEntries(settingsChanges)) {
      dispatch(updateReportSettings(settingsChanges));
    }
    if (hasEntries(local)) {
      setLocalValues((current) => ({ ...current, ...local }));
    }
  };

  const studentNames = useMemo(() => getStudentNames(values), [values]);
  const errors = useMemo(() => validateReportForm(values), [values]);

  /** Returns `false` when the browser has no room left for the image. */
  const saveHeaderImage = (image: string | null): boolean => headerImageStorage.write(image);

  return {
    values,
    updateValues,
    saveHeaderImage,
    studentNames,
    errors,
    currentTerm,
    isSchoolDaysFromCalendar,
  };
};
