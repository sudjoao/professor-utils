import { describe, expect, it } from 'vitest';

import { INITIAL_SHEET_STYLE } from '@/features/classroom/constants';
import { sheetStyleReducer, updateSheetStyle } from '@/features/classroom/sheetStyleSlice';

describe('sheetStyleSlice', () => {
  it('starts gray, with stripes and normal letters', () => {
    expect(sheetStyleReducer(undefined, { type: 'init' })).toEqual(INITIAL_SHEET_STYLE);
  });

  it('updates only the given preferences', () => {
    expect(
      sheetStyleReducer(INITIAL_SHEET_STYLE, updateSheetStyle({ paletteId: 'green' })),
    ).toEqual({ ...INITIAL_SHEET_STYLE, paletteId: 'green' });
  });
});
