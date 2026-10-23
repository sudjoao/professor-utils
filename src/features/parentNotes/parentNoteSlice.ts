import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { INITIAL_PARENT_NOTE } from '@/features/parentNotes/services/buildParentNotes';
import type { ParentNoteDraft } from '@/features/parentNotes/types';

const parentNoteSlice = createSlice({
  name: 'parentNote',
  initialState: INITIAL_PARENT_NOTE,
  reducers: {
    updateParentNote: (state, action: PayloadAction<Partial<ParentNoteDraft>>) => ({
      ...state,
      ...action.payload,
    }),
  },
  selectors: {
    selectParentNote: (state) => state,
  },
});

export const { updateParentNote } = parentNoteSlice.actions;
export const { selectParentNote } = parentNoteSlice.selectors;
export const parentNoteReducer = parentNoteSlice.reducer;
