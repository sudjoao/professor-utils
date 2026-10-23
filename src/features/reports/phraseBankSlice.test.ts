import { describe, expect, it } from 'vitest';

import {
  addCustomPhrase,
  INITIAL_PHRASE_BANK,
  phraseBankReducer,
  putCustomPhrase,
  removeCustomPhrase,
} from '@/features/reports/phraseBankSlice';

describe('phraseBankSlice', () => {
  it('adds, removes and puts back a phrase in the same place', () => {
    const first = phraseBankReducer(INITIAL_PHRASE_BANK, addCustomPhrase(' [ALUNO] leu. '));
    const state = phraseBankReducer(first, addCustomPhrase('Segunda.'));
    const [phrase] = state.customPhrases;

    expect(phrase.text).toBe('[ALUNO] leu.');

    const removed = phraseBankReducer(state, removeCustomPhrase(phrase.id));
    expect(removed.customPhrases.map(({ text }) => text)).toEqual(['Segunda.']);
    expect(phraseBankReducer(removed, putCustomPhrase({ phrase, index: 0 }))).toEqual(state);
  });
});
