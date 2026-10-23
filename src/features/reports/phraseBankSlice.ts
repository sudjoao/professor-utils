import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type CustomPhrase = {
  id: string;
  text: string;
};

type PhraseBankState = {
  /** Phrases the teacher saved; the ready-made ones live in `constants.ts`. */
  customPhrases: CustomPhrase[];
};

export const INITIAL_PHRASE_BANK: PhraseBankState = { customPhrases: [] };

const phraseBankSlice = createSlice({
  name: 'phraseBank',
  initialState: INITIAL_PHRASE_BANK,
  reducers: {
    addCustomPhrase: {
      reducer: (state, action: PayloadAction<CustomPhrase>) => {
        state.customPhrases.push(action.payload);
      },
      prepare: (text: string) => ({ payload: { id: nanoid(), text: text.trim() } }),
    },
    removeCustomPhrase: (state, action: PayloadAction<string>) => {
      state.customPhrases = state.customPhrases.filter(({ id }) => id !== action.payload);
    },
    /** Puts a removed phrase back where it was (after "Desfazer"). */
    putCustomPhrase: (state, action: PayloadAction<{ phrase: CustomPhrase; index: number }>) => {
      state.customPhrases.splice(action.payload.index, 0, action.payload.phrase);
    },
  },
  selectors: {
    selectCustomPhrases: (state) => state.customPhrases,
  },
});

export const { addCustomPhrase, removeCustomPhrase, putCustomPhrase } = phraseBankSlice.actions;
export const { selectCustomPhrases } = phraseBankSlice.selectors;
export const phraseBankReducer = phraseBankSlice.reducer;
