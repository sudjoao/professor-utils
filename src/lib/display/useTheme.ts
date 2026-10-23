import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES, type Theme } from '@/lib/display/theme';
import { useHtmlPreference } from '@/lib/display/useHtmlPreference';

const THEME_PREFERENCE = {
  datasetKey: 'theme',
  storageKey: THEME_STORAGE_KEY,
  values: THEMES,
  defaultValue: DEFAULT_THEME,
};

export const useTheme = () => {
  const [theme, setTheme] = useHtmlPreference<Theme>(THEME_PREFERENCE);
  return { theme, setTheme };
};
