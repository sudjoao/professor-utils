import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { INITIAL_CLASS_FORM_VALUES } from '@/features/classroom/services/classForm';
import type { ClassFormValues } from '@/features/classroom/types';

/**
 * The class the teacher is working on (name, subject, teacher, students), shared by every tool
 * and kept in the browser: going from the attendance list to the grades list, or reloading
 * the page, keeps everything already typed.
 */
const classDraftSlice = createSlice({
  name: 'classDraft',
  initialState: INITIAL_CLASS_FORM_VALUES,
  reducers: {
    updateClassDraft: (state, action: PayloadAction<Partial<ClassFormValues>>) => ({
      ...state,
      ...action.payload,
    }),
  },
  selectors: {
    selectClassDraft: (state) => state,
  },
});

export const { updateClassDraft } = classDraftSlice.actions;
export const { selectClassDraft } = classDraftSlice.selectors;
export const classDraftReducer = classDraftSlice.reducer;
