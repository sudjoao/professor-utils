import { SHEET_PALETTES } from '@/features/classroom/constants';
import type {
  SheetPalette,
  SheetPaletteId,
  SheetStyle,
  SheetStylePreferences,
} from '@/features/classroom/types';
import { solidFill } from '@/lib/excel/styles';

const TEXT_SCALES = { normal: 1, large: 1.2 } as const;

/** Unknown ids (e.g. a palette removed later) fall back to the first one. */
export const getSheetPalette = (paletteId: SheetPaletteId): SheetPalette =>
  SHEET_PALETTES.find(({ id }) => id === paletteId) ?? SHEET_PALETTES[0];

/** `FFBFDBFE` → `#BFDBFE`, to show an Excel color on the page. */
export const argbToCss = (argb: string): string => `#${argb.slice(2)}`;

export const resolveSheetStyle = ({
  paletteId,
  stripes,
  fontSize,
}: SheetStylePreferences): SheetStyle => {
  const palette = getSheetPalette(paletteId);

  return {
    headerFill: solidFill(palette.headerArgb),
    stripeFill: stripes ? solidFill(palette.stripeArgb) : null,
    textScale: TEXT_SCALES[fontSize] ?? TEXT_SCALES.normal,
  };
};

/** A size (font, row height, column width) adjusted to the chosen letter size. */
export const scaleSize = (size: number, { textScale }: SheetStyle): number =>
  Math.round(size * textScale * 10) / 10;
