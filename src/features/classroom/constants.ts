import type { SheetPalette, SheetStylePreferences } from '@/features/classroom/types';

/** Light tones only: black text stays readable and they still look fine printed in grayscale. */
export const SHEET_PALETTES: SheetPalette[] = [
  { id: 'gray', label: 'Cinza', headerArgb: 'FFE5E7EB', stripeArgb: 'FFF3F4F6' },
  { id: 'blue', label: 'Azul', headerArgb: 'FFBFDBFE', stripeArgb: 'FFDBEAFE' },
  { id: 'green', label: 'Verde', headerArgb: 'FFBBF7D0', stripeArgb: 'FFDCFCE7' },
  { id: 'yellow', label: 'Amarelo', headerArgb: 'FFFDE68A', stripeArgb: 'FFFEF9C3' },
  { id: 'pink', label: 'Rosa', headerArgb: 'FFFBCFE8', stripeArgb: 'FFFCE7F3' },
  { id: 'purple', label: 'Lilás', headerArgb: 'FFDDD6FE', stripeArgb: 'FFEDE9FE' },
  { id: 'orange', label: 'Laranja', headerArgb: 'FFFED7AA', stripeArgb: 'FFFFEDD5' },
];

export const INITIAL_SHEET_STYLE: SheetStylePreferences = {
  paletteId: 'gray',
  stripes: true,
  fontSize: 'normal',
};

export const SHEET_FONT_SIZE_OPTIONS: {
  value: SheetStylePreferences['fontSize'];
  label: string;
}[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Grande' },
];
