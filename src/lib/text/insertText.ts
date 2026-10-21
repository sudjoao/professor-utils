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
