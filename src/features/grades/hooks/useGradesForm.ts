import { useMemo, useState } from 'react';

import { INITIAL_CLASS_FORM_VALUES } from '@/features/classroom/services/classForm';
import { DEFAULT_GRADE_COUNT, DEFAULT_MAX_GRADE } from '@/features/grades/constants';
import {
  buildGradesSheetData,
  getSummaryColumnTitle,
} from '@/features/grades/services/buildGradesSheetData';
import { validateGradesForm } from '@/features/grades/services/validateGradesForm';
import type { GradesFormValues } from '@/features/grades/types';

const INITIAL_VALUES: GradesFormValues = {
  ...INITIAL_CLASS_FORM_VALUES,
  columnMode: 'count',
  gradeCount: DEFAULT_GRADE_COUNT,
  gradeTitlesText: '',
  summary: 'average',
  maxGrade: DEFAULT_MAX_GRADE,
};

export const useGradesForm = () => {
  const [values, setValues] = useState<GradesFormValues>(INITIAL_VALUES);

  const updateValues = (changes: Partial<GradesFormValues>) =>
    setValues((current) => ({ ...current, ...changes }));

  const sheetData = useMemo(() => buildGradesSheetData(values), [values]);
  const errors = useMemo(() => validateGradesForm(values), [values]);
  const summaryColumnTitle = getSummaryColumnTitle(values.summary);

  return { values, updateValues, sheetData, errors, summaryColumnTitle };
};
