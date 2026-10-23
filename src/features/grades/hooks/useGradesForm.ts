import { useMemo, useState } from 'react';

import { useClassDraft } from '@/features/classroom/hooks/useClassDraft';
import { useSheetStyle } from '@/features/classroom/hooks/useSheetStyle';
import type { ClassFormValues } from '@/features/classroom/types';
import {
  DEFAULT_GRADE_COUNT,
  DEFAULT_MAX_GRADE,
  DEFAULT_PASSING_GRADE,
} from '@/features/grades/constants';
import {
  buildGradesSheetData,
  getResultColumnTitles,
} from '@/features/grades/services/buildGradesSheetData';
import { validateGradesForm } from '@/features/grades/services/validateGradesForm';
import type { GradesFormValues } from '@/features/grades/types';

/** What only this form uses; the class and students come from the shared draft. */
type GradeValues = Omit<GradesFormValues, keyof ClassFormValues>;

const INITIAL_VALUES: GradeValues = {
  columnMode: 'count',
  gradeCount: DEFAULT_GRADE_COUNT,
  gradeTitlesText: '',
  summary: 'average',
  maxGrade: DEFAULT_MAX_GRADE,
  weighted: false,
  weights: [],
  includeRecovery: false,
  includeStatus: false,
  passingGrade: DEFAULT_PASSING_GRADE,
};

export const useGradesForm = () => {
  const { classDraft, splitChanges } = useClassDraft();
  const sheetStyle = useSheetStyle();
  const [gradeValues, setValues] = useState<GradeValues>(INITIAL_VALUES);
  const values = useMemo<GradesFormValues>(
    () => ({ ...classDraft, ...gradeValues }),
    [classDraft, gradeValues],
  );

  const updateValues = (changes: Partial<GradesFormValues>) => {
    const gradeChanges = splitChanges(changes);
    setValues((current) => ({ ...current, ...gradeChanges }));
  };

  const sheetData = useMemo(
    () => buildGradesSheetData(values, sheetStyle.style),
    [values, sheetStyle.style],
  );
  const errors = useMemo(() => validateGradesForm(values), [values]);
  const resultTitles = getResultColumnTitles(sheetData);

  return { values, updateValues, sheetData, sheetStyle, errors, resultTitles };
};
