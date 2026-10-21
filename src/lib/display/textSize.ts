/** Sizes the teacher can pick for the whole interface; `globals.css` maps each one to a font size. */
export const TEXT_SIZES = ['normal', 'large', 'x-large'] as const;

export type TextSize = (typeof TEXT_SIZES)[number];

export const DEFAULT_TEXT_SIZE: TextSize = 'normal';

export const TEXT_SIZE_STORAGE_KEY = 'professor-utils:text-size';

export const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  normal: 'normal',
  large: 'grande',
  'x-large': 'muito grande',
};

export const isTextSize = (value: unknown): value is TextSize =>
  TEXT_SIZES.includes(value as TextSize);

/** The next size up (`step = 1`) or down (`step = -1`), stopping at both ends. */
export const stepTextSize = (current: TextSize, step: 1 | -1): TextSize => {
  const index = TEXT_SIZES.indexOf(current) + step;
  return TEXT_SIZES[Math.min(Math.max(index, 0), TEXT_SIZES.length - 1)];
};

/**
 * Runs inline in `<head>`, before the first paint, so a saved size never flashes the default one.
 * Kept tiny and dependency-free because it is serialized into the HTML.
 */
export const TEXT_SIZE_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  TEXT_SIZE_STORAGE_KEY,
)});if(${JSON.stringify(TEXT_SIZES)}.indexOf(s)>-1)document.documentElement.dataset.textSize=s}catch(e){}})()`;
