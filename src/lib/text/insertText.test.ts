import { describe, expect, it } from 'vitest';

import { insertSentence, insertText } from '@/lib/text/insertText';

describe('insertText', () => {
  it('inserts at the cursor and moves the cursor after it', () => {
    expect(insertText('O aluno participou.', '[ALUNO] ', 2)).toEqual({
      text: 'O [ALUNO] aluno participou.',
      cursor: 10,
    });
  });

  it('replaces the selected text', () => {
    expect(insertText('O aluno participou.', '[ALUNO]', 2, 7)).toEqual({
      text: 'O [ALUNO] participou.',
      cursor: 9,
    });
  });

  it('works on an empty text', () => {
    expect(insertText('', '[ALUNO]', 0)).toEqual({ text: '[ALUNO]', cursor: 7 });
  });
});

describe('insertSentence', () => {
  it('separates the sentence from the text around it', () => {
    expect(insertSentence('Leu bem.', 'Escreveu.', 8)).toEqual({
      text: 'Leu bem. Escreveu.',
      cursor: 18,
    });
    expect(insertSentence('Leu bem.Fim', 'Escreveu.', 8).text).toBe('Leu bem. Escreveu. Fim');
  });

  it('adds no space at the start or after a line break', () => {
    expect(insertSentence('', 'Leu.', 0).text).toBe('Leu.');
    expect(insertSentence('Leu.\n', 'Escreveu.', 5).text).toBe('Leu.\nEscreveu.');
  });
});
