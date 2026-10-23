import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  belongsToClassTerm,
  EMPTY_EVALUATION,
  isEmptyEvaluation,
} from '@/features/reports/services/studentEvaluations';
import type { StudentEvaluation } from '@/features/reports/types';

/** What the teacher writes in the reports, saved so a closed page never loses it. */
export type StudentEvaluationsState = {
  /** By student key (class, term and student). */
  evaluations: Record<string, StudentEvaluation>;
  /** The text repeated in every report, by class-term key. */
  commonTexts: Record<string, string>;
};

export const INITIAL_STUDENT_EVALUATIONS: StudentEvaluationsState = {
  evaluations: {},
  commonTexts: {},
};

type EvaluationChange = { key: string; changes: Partial<StudentEvaluation> };

const studentEvaluationsSlice = createSlice({
  name: 'studentEvaluations',
  initialState: INITIAL_STUDENT_EVALUATIONS,
  reducers: {
    updateStudentEvaluation: (state, action: PayloadAction<EvaluationChange>) => {
      const { key, changes } = action.payload;
      const evaluation = { ...(state.evaluations[key] ?? EMPTY_EVALUATION), ...changes };

      if (isEmptyEvaluation(evaluation)) {
        delete state.evaluations[key];
      } else {
        state.evaluations[key] = evaluation;
      }
    },
    updateCommonText: (state, action: PayloadAction<{ key: string; text: string }>) => {
      const { key, text } = action.payload;

      if (text.length === 0) {
        delete state.commonTexts[key];
      } else {
        state.commonTexts[key] = text;
      }
    },
    /** Clears the evaluations of a class and term (the common text stays). */
    clearClassTerm: (state, action: PayloadAction<string>) => {
      Object.keys(state.evaluations)
        .filter((key) => belongsToClassTerm(key, action.payload))
        .forEach((key) => delete state.evaluations[key]);
    },
    /** Puts back what was cleared (after "Desfazer"). */
    putStudentEvaluations: (state, action: PayloadAction<StudentEvaluationsState>) => {
      Object.assign(state.evaluations, action.payload.evaluations);
      Object.assign(state.commonTexts, action.payload.commonTexts);
    },
  },
  selectors: {
    selectStudentEvaluations: (state) => state,
  },
});

export const { updateStudentEvaluation, updateCommonText, clearClassTerm, putStudentEvaluations } =
  studentEvaluationsSlice.actions;
export const { selectStudentEvaluations } = studentEvaluationsSlice.selectors;
export const studentEvaluationsReducer = studentEvaluationsSlice.reducer;
