const WHITESPACE_SEQUENCE = /\s+/g;
const LINE_BREAK = /\r?\n/;

const normalizeName = (name: string): string => name.trim().replace(WHITESPACE_SEQUENCE, ' ');

/**
 * Turns text pasted by the teacher (one student per line) into a clean list of names.
 * Duplicated names are kept on purpose: two students can share the same name.
 */
export const parseStudentNames = (rawText: string): string[] =>
  rawText
    .split(LINE_BREAK)
    .map(normalizeName)
    .filter((name) => name.length > 0);
