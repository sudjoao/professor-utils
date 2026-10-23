import { TEXT_SIZE_STORAGE_KEY, TEXT_SIZES } from '@/lib/display/textSize';
import { THEME_STORAGE_KEY, THEMES } from '@/lib/display/theme';

/** A display preference saved in the browser and applied as a `data-*` attribute on `<html>`. */
export type HtmlPreference<Value extends string> = {
  /** `dataset` key: `textSize` becomes `data-text-size`. */
  datasetKey: string;
  storageKey: string;
  values: readonly Value[];
  defaultValue: Value;
};

const HTML_PREFERENCES = [
  { datasetKey: 'textSize', storageKey: TEXT_SIZE_STORAGE_KEY, values: TEXT_SIZES },
  { datasetKey: 'theme', storageKey: THEME_STORAGE_KEY, values: THEMES },
];

/**
 * Runs inline in `<head>`, before the first paint, so saved preferences never flash the
 * defaults. Kept tiny and dependency-free because it is serialized into the HTML.
 */
export const HTML_PREFERENCES_SCRIPT = `(function(){var p=${JSON.stringify(
  HTML_PREFERENCES,
)};p.forEach(function(o){try{var v=localStorage.getItem(o.storageKey);if(o.values.indexOf(v)>-1)document.documentElement.dataset[o.datasetKey]=v}catch(e){}})})()`;
