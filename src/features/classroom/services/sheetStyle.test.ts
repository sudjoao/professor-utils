import { describe, expect, it } from 'vitest';

import { INITIAL_SHEET_STYLE } from '@/features/classroom/constants';
import {
  argbToCss,
  getSheetPalette,
  resolveSheetStyle,
  scaleSize,
} from '@/features/classroom/services/sheetStyle';
import type { SheetPaletteId } from '@/features/classroom/types';

describe('resolveSheetStyle', () => {
  it('uses the header and stripe colors of the chosen palette', () => {
    const style = resolveSheetStyle({ ...INITIAL_SHEET_STYLE, paletteId: 'blue' });

    expect(style.headerFill).toMatchObject({ fgColor: { argb: 'FFBFDBFE' } });
    expect(style.stripeFill).toMatchObject({ fgColor: { argb: 'FFDBEAFE' } });
    expect(style.textScale).toBe(1);
  });

  it('has no stripe color when stripes are off', () => {
    expect(resolveSheetStyle({ ...INITIAL_SHEET_STYLE, stripes: false }).stripeFill).toBeNull();
  });

  it('scales sizes for the large letter size', () => {
    const style = resolveSheetStyle({ ...INITIAL_SHEET_STYLE, fontSize: 'large' });

    expect(scaleSize(10, style)).toBe(12);
    expect(scaleSize(18, style)).toBe(21.6);
  });
});

describe('getSheetPalette', () => {
  it('falls back to the first palette for an unknown id', () => {
    expect(getSheetPalette('red' as SheetPaletteId).id).toBe('gray');
  });
});

describe('argbToCss', () => {
  it('drops the alpha part', () => {
    expect(argbToCss('FFBFDBFE')).toBe('#BFDBFE');
  });
});
