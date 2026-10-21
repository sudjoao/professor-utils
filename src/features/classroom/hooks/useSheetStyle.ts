import { useMemo } from 'react';

import { INITIAL_SHEET_STYLE } from '@/features/classroom/constants';
import { resolveSheetStyle } from '@/features/classroom/services/sheetStyle';
import { selectSheetStyle, updateSheetStyle } from '@/features/classroom/sheetStyleSlice';
import type { SheetStylePreferences } from '@/features/classroom/types';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

export const useSheetStyle = () => {
  const dispatch = useAppDispatch();
  const preferences = usePersistedSelector(selectSheetStyle, INITIAL_SHEET_STYLE);
  const style = useMemo(() => resolveSheetStyle(preferences), [preferences]);

  const updatePreferences = (changes: Partial<SheetStylePreferences>) =>
    dispatch(updateSheetStyle(changes));

  return { preferences, style, updatePreferences };
};
