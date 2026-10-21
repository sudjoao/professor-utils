const WHITESPACE_SEQUENCE = /\s+/g;
const LINE_BREAK = /\r?\n/;

const normalizeLine = (line: string): string => line.trim().replace(WHITESPACE_SEQUENCE, ' ');

/**
 * Turns text pasted by the teacher (one item per line, like student names or grade titles)
 * into a clean list. Repeated lines are kept on purpose: two students can share the same name.
 */
export const parseLines = (rawText: string): string[] =>
  rawText
    .split(LINE_BREAK)
    .map(normalizeLine)
    .filter((line) => line.length > 0);
