import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SeatingChart } from '@/features/seating/types';

export type SeatingState = {
  /** By classroom key (see `normalizeKey`). */
  charts: Record<string, SeatingChart>;
};

export const INITIAL_SEATING: SeatingState = { charts: {} };

const seatingSlice = createSlice({
  name: 'seating',
  initialState: INITIAL_SEATING,
  reducers: {
    saveSeatingChart: (state, action: PayloadAction<{ key: string; chart: SeatingChart }>) => {
      state.charts[action.payload.key] = action.payload.chart;
    },
  },
  selectors: {
    selectSeatingCharts: (state) => state.charts,
  },
});

export const { saveSeatingChart } = seatingSlice.actions;
export const { selectSeatingCharts } = seatingSlice.selectors;
export const seatingReducer = seatingSlice.reducer;
