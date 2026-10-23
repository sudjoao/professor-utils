import {
  DEFAULT_TEXT_SIZE,
  TEXT_SIZE_STORAGE_KEY,
  TEXT_SIZES,
  type TextSize,
} from '@/lib/display/textSize';
import { useHtmlPreference } from '@/lib/display/useHtmlPreference';

const TEXT_SIZE_PREFERENCE = {
  datasetKey: 'textSize',
  storageKey: TEXT_SIZE_STORAGE_KEY,
  values: TEXT_SIZES,
  defaultValue: DEFAULT_TEXT_SIZE,
};

export const useTextSize = () => {
  const [textSize, setTextSize] = useHtmlPreference<TextSize>(TEXT_SIZE_PREFERENCE);
  return { textSize, setTextSize };
};
