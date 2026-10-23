type TextInsertion = {
  text: string;
  /** Where the cursor goes afterwards: right after the inserted text. */
  cursor: number;
};

/** Puts `insertion` in place of the selected part of `text` (or at the cursor, with no selection). */
export const insertText = (
  text: string,
  insertion: string,
  selectionStart: number,
  selectionEnd = selectionStart,
): TextInsertion => ({
  text: `${text.slice(0, selectionStart)}${insertion}${text.slice(selectionEnd)}`,
  cursor: selectionStart + insertion.length,
});

/**
 * Like `insertText`, for a whole sentence: adds a space before it when it would stick to the
 * previous word, and one after it when the next text starts right away.
 */
export const insertSentence = (
  text: string,
  sentence: string,
  selectionStart: number,
  selectionEnd = selectionStart,
): TextInsertion => {
  const before = text.slice(0, selectionStart);
  const after = text.slice(selectionEnd);
  const needsSpaceBefore = before.length > 0 && !/\s$/.test(before);
  const needsSpaceAfter = after.length > 0 && !/^\s/.test(after);

  return insertText(
    text,
    `${needsSpaceBefore ? ' ' : ''}${sentence}${needsSpaceAfter ? ' ' : ''}`,
    selectionStart,
    selectionEnd,
  );
};
