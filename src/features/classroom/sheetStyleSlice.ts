import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { INITIAL_SHEET_STYLE } from '@/features/classroom/constants';
import type { SheetStylePreferences } from '@/features/classroom/types';

const sheetStyleSlice = createSlice({
  name: 'sheetStyle',
  initialState: INITIAL_SHEET_STYLE,
  reducers: {
    updateSheetStyle: (state, action: PayloadAction<Partial<SheetStylePreferences>>) => ({
      ...state,
      ...action.payload,
    }),
  },
  selectors: {
    selectSheetStyle: (state) => state,
  },
});

export const { updateSheetStyle } = sheetStyleSlice.actions;
export const { selectSheetStyle } = sheetStyleSlice.selectors;
export const sheetStyleReducer = sheetStyleSlice.reducer;
