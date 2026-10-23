import { describe, expect, it } from 'vitest';

import {
  clearClassTerm,
  INITIAL_STUDENT_EVALUATIONS,
  putStudentEvaluations,
  studentEvaluationsReducer,
  updateCommonText,
  updateStudentEvaluation,
} from '@/features/reports/studentEvaluationsSlice';

const reduce = studentEvaluationsReducer;

describe('studentEvaluationsSlice', () => {
  it('merges changes of a student and drops evaluations left empty', () => {
    const withText = reduce(
      INITIAL_STUDENT_EVALUATIONS,
      updateStudentEvaluation({ key: '7º a|2|ana', changes: { text: 'Leu bem.' } }),
    );
    const withAbsences = reduce(
      withText,
      updateStudentEvaluation({ key: '7º a|2|ana', changes: { absences: 2 } }),
    );

    expect(withAbsences.evaluations).toEqual({ '7º a|2|ana': { text: 'Leu bem.', absences: 2 } });

    const emptied = reduce(
      withAbsences,
      updateStudentEvaluation({ key: '7º a|2|ana', changes: { text: '', absences: null } }),
    );
    expect(emptied.evaluations).toEqual({});
  });

  it('clears one class and term, and puts it back', () => {
    const state = {
      evaluations: {
        '7º a|2|ana': { text: 'A', absences: null },
        '7º a|1|ana': { text: 'B', absences: null },
      },
      commonTexts: { '7º a|2': 'Comum' },
    };
    const cleared = reduce(state, clearClassTerm('7º a|2'));

    expect(cleared).toEqual({
      evaluations: { '7º a|1|ana': { text: 'B', absences: null } },
      commonTexts: { '7º a|2': 'Comum' },
    });
    expect(reduce(cleared, putStudentEvaluations(state))).toEqual(state);
  });

  it('keeps the common text per class and term', () => {
    const state = reduce(
      INITIAL_STUDENT_EVALUATIONS,
      updateCommonText({ key: '7º a|2', text: 'Oi' }),
    );

    expect(state.commonTexts).toEqual({ '7º a|2': 'Oi' });
    expect(reduce(state, updateCommonText({ key: '7º a|2', text: '' })).commonTexts).toEqual({});
  });
});
