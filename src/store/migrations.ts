import type { PersistedState } from 'redux-persist';

type StoredState = NonNullable<PersistedState> & {
  reportSettings?: { headerImage?: string | null } & Record<string, unknown>;
};

/**
 * Version 2 took the header image out of `reportSettings`: it lived in the same saved text as
 * everything else, so every keystroke wrote ~1.4 MB to the browser. Now it has its own key.
 */
export const moveHeaderImageOut = (
  state: StoredState | undefined,
  saveHeaderImage: (image: string) => void,
): StoredState | undefined => {
  const reportSettings = state?.reportSettings;

  if (!reportSettings || !('headerImage' in reportSettings)) {
    return state;
  }

  const { headerImage, ...otherSettings } = reportSettings;
  if (headerImage) {
    saveHeaderImage(headerImage);
  }
  return { ...state, reportSettings: otherSettings };
};
