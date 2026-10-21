import { describe, expect, it } from 'vitest';

import { insertText } from '@/lib/text/insertText';

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
