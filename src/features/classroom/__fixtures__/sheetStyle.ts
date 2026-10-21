import { INITIAL_SHEET_STYLE } from '@/features/classroom/constants';
import { resolveSheetStyle } from '@/features/classroom/services/sheetStyle';
import type { SheetStyle, SheetStylePreferences } from '@/features/classroom/types';

/** The resolved sheet style, starting from the default preferences, for tests. */
export const buildSheetStyle = (overrides: Partial<SheetStylePreferences> = {}): SheetStyle =>
  resolveSheetStyle({ ...INITIAL_SHEET_STYLE, ...overrides });
