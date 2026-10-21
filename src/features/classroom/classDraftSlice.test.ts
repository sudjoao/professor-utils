import { describe, expect, it } from 'vitest';

import { classDraftReducer, updateClassDraft } from '@/features/classroom/classDraftSlice';
import { INITIAL_CLASS_FORM_VALUES } from '@/features/classroom/services/classForm';

describe('classDraftSlice', () => {
  it('starts empty, sorting students', () => {
    expect(classDraftReducer(undefined, { type: 'init' })).toEqual(INITIAL_CLASS_FORM_VALUES);
  });

  it('updates only the given fields', () => {
    const state = classDraftReducer(
      { ...INITIAL_CLASS_FORM_VALUES, teacherName: 'Sandra' },
      updateClassDraft({ studentsText: 'Ana\nBruno' }),
    );

    expect(state).toEqual({
      ...INITIAL_CLASS_FORM_VALUES,
      teacherName: 'Sandra',
      studentsText: 'Ana\nBruno',
    });
  });
});
