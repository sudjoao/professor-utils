const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
const windows1252Decoder = new TextDecoder('windows-1252');

/**
 * Reads the text of a file. Spreadsheets saved as CSV by Excel in Portuguese often use
 * Windows-1252 instead of UTF-8; reading them as UTF-8 would turn "João" into "Jo�o".
 */
export const decodeText = (buffer: ArrayBuffer): string => {
  try {
    return utf8Decoder.decode(buffer).replace(/^﻿/, '');
  } catch {
    return windows1252Decoder.decode(buffer);
  }
};
