/** Screen colors the teacher can pick; `globals.css` defines the tokens of each one. */
export const THEMES = ['light', 'dark', 'contrast'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'light';

export const THEME_STORAGE_KEY = 'professor-utils:theme';

export const THEME_LABELS: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Escuro',
  contrast: 'Alto contraste',
};

export const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);
