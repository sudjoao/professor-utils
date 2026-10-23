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
import {
  belongsToClassTerm,
  getClassTermKey,
  getStudentKey,
} from '@/features/reports/services/studentEvaluations';
import { validateReportForm } from '@/features/reports/services/validateReportForm';
import {
  clearClassTerm,
  INITIAL_STUDENT_EVALUATIONS,
  putStudentEvaluations,
  selectStudentEvaluations,
  updateCommonText,
  updateStudentEvaluation,
} from '@/features/reports/studentEvaluationsSlice';
import type { ReportFormValues, StudentEvaluation } from '@/features/reports/types';
import {
  findCurrentOrLastTerm,
  getSchoolTerm,
} from '@/features/schoolCalendar/services/schoolCalendar';
import { useToday } from '@/lib/date/useToday';
import { hasEntries, splitByKeys } from '@/lib/object/splitByKeys';
import { useStoredValue } from '@/lib/storage/useStoredValue';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

/**
 * What changes on every export. The class comes from the shared draft, the school data from
 * `reportSettings` and the texts from `studentEvaluations`, all saved in the browser.
 */
type LocalValues = Pick<ReportFormValues, 'schoolYear' | 'documentDate'>;

type EditableValues = Partial<Omit<ReportFormValues, 'headerImage' | 'evaluations'>>;

const INITIAL_LOCAL_VALUES: LocalValues = {
  schoolYear: '',
  documentDate: '',
};

export const useReportForm = () => {
  const dispatch = useAppDispatch();
  const { classDraft, splitChanges } = useClassDraft();
  const settings = usePersistedSelector(selectReportSettings, INITIAL_REPORT_SETTINGS);
  const [localValues, setLocalValues] = useState<LocalValues>(INITIAL_LOCAL_VALUES);
  const headerImage = useStoredValue(headerImageStorage);
  const { evaluations, commonTexts } = usePersistedSelector(
    selectStudentEvaluations,
    INITIAL_STUDENT_EVALUATIONS,
  );
  const today = useToday();
  const currentTerm = today ? findCurrentOrLastTerm(today) : undefined;
  // Until the teacher picks a term, the report is about the current one (school calendar).
  const term = settings.term ?? currentTerm?.term ?? 1;
  const classTermKey = getClassTermKey(classDraft.classroomName, term);

  const schoolYear = localValues.schoolYear || today?.slice(0, 4) || '';
  const calendarSchoolDays = getSchoolTerm(Number(schoolYear), term)?.schoolDays;
  const isSchoolDaysFromCalendar = !settings.schoolDays && calendarSchoolDays !== undefined;

  const values = useMemo<ReportFormValues>(
    () => ({
      ...classDraft,
      ...localValues,
      ...settings,
      term,
      // Blank fields count as today, like the attendance dates, and as the school calendar.
      schoolYear,
      documentDate: localValues.documentDate || today || '',
      schoolDays: settings.schoolDays || calendarSchoolDays || 0,
      headerImage,
      commonText: commonTexts[classTermKey] ?? '',
      evaluations,
    }),
    [
      classDraft,
      localValues,
      settings,
      term,
      today,
      schoolYear,
      calendarSchoolDays,
      headerImage,
      commonTexts,
      classTermKey,
      evaluations,
    ],
  );

  // The header image is saved apart, with `saveHeaderImage`.
  const updateValues = ({ commonText, ...changes }: EditableValues) => {
    const [settingsChanges, local] = splitByKeys(splitChanges(changes), REPORT_SETTINGS_KEYS);

    if (commonText !== undefined) {
      dispatch(updateCommonText({ key: classTermKey, text: commonText }));
    }
    if (hasEntries(settingsChanges)) {
      dispatch(updateReportSettings(settingsChanges));
    }
    if (hasEntries(local)) {
      setLocalValues((current) => ({ ...current, ...local }));
    }
  };

  const studentNames = useMemo(() => getStudentNames(values), [values]);
  const errors = useMemo(() => validateReportForm(values), [values]);

  const getEvaluation = (studentName: string): StudentEvaluation | undefined =>
    evaluations[getStudentKey(classTermKey, studentName)];

  const updateEvaluation = (studentName: string, changes: Partial<StudentEvaluation>) =>
    dispatch(updateStudentEvaluation({ key: getStudentKey(classTermKey, studentName), changes }));

  /** Clears the evaluations of this class and term; returns how to put them back. */
  const clearEvaluations = () => {
    const snapshot = {
      evaluations: Object.fromEntries(
        Object.entries(evaluations).filter(([key]) => belongsToClassTerm(key, classTermKey)),
      ),
      commonTexts: {},
    };

    dispatch(clearClassTerm(classTermKey));
    return () => dispatch(putStudentEvaluations(snapshot));
  };

  /** Returns `false` when the browser has no room left for the image. */
  const saveHeaderImage = (image: string | null): boolean => headerImageStorage.write(image);

  return {
    values,
    updateValues,
    saveHeaderImage,
    getEvaluation,
    updateEvaluation,
    clearEvaluations,
    studentNames,
    errors,
    currentTerm,
    isSchoolDaysFromCalendar,
  };
};
