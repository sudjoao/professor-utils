import { parseDelimited } from '@/lib/text/parseDelimited';
import { parseLines } from '@/lib/text/parseLines';

/** What the cleanup changed, so the page can tell the teacher. */
export type StudentListFix = 'numbers' | 'columns' | 'header';

/** Where the list came from: pasted text only has columns when copied from a spreadsheet. */
export type StudentListSource = 'paste' | 'file';

// Excel and Google Sheets copy cells separated by tabs; commas in pasted text belong to names.
const PASTE_DELIMITERS = ['\t'];

export type CleanedStudentList = {
  names: string[];
  fixes: StudentListFix[];
};

// Numbers, dates, registration codes and list markers ("01 -", "1.", "3)") around a name.
const LEADING_MARKERS = /^[\d\s.,:;|/\\()[\]ºª°#*•–—-]+(?=\p{L})/u;
const TRAILING_MARKERS = /(?<=\p{L}\.?)[\d\s.,:;|/\\()[\]ºª°#*•–—-]+$/u;
const LETTER = /\p{L}/gu;
const HEADER_WORDS =
  /^(n[ºo°.]?\s*)?(nomes?|alun[oa]s?(\s*\(a\))?|estudantes?|nome (completo|do aluno|do estudante|d[oa] alun[oa])(\s*\(a\))?)$/iu;

// Lowercase name particles: "Maria DA SILVA" → "Maria da Silva".
const NAME_PARTICLES = new Set(['da', 'das', 'de', 'do', 'dos', 'e', 'di', 'du']);

const cleanName = (line: string): string =>
  line.replace(LEADING_MARKERS, '').replace(TRAILING_MARKERS, '').trim();

const letterCount = (text: string): number => text.match(LETTER)?.length ?? 0;

const looksLikeName = (cell: string): boolean => {
  const letters = letterCount(cell);
  return letters >= 2 && letters >= cell.replace(/\s/g, '').length * 0.6;
};

const isHeader = (cell: string): boolean => HEADER_WORDS.test(cell.trim());

/** The column with the most cells that look like names (ties: the longest texts). */
const findNameColumn = (rows: string[][]): number => {
  const columnCount = Math.max(...rows.map((row) => row.length));
  const scores = Array.from({ length: columnCount }, (_, column) => {
    const cells = rows.map((row) => row[column] ?? '');
    return {
      column,
      names: cells.filter(looksLikeName).length,
      letters: cells.reduce((total, cell) => total + letterCount(cell), 0),
    };
  });

  return scores.reduce((best, score) =>
    score.names > best.names || (score.names === best.names && score.letters > best.letters)
      ? score
      : best,
  ).column;
};

/**
 * Cleans the rows of a student list: keeps only the column of names, drops a header row
 * ("Nome", "Aluno(a)") and the numbers or codes around each name.
 */
export const cleanStudentRows = (rows: string[][]): CleanedStudentList => {
  const hasColumns = rows.some((row) => row.filter(Boolean).length > 1);
  const nameColumn = hasColumns ? findNameColumn(rows) : 0;
  const cells = rows.map((row) => row[nameColumn] ?? '').filter(Boolean);
  const hasHeader = cells.length > 0 && isHeader(cells[0]);
  const rawNames = hasHeader ? cells.slice(1) : cells;
  // Lines without letters (blank cells, totals, page numbers) are not students.
  const names = parseLines(rawNames.map(cleanName).join('\n')).filter(
    (name) => letterCount(name) >= 2,
  );
  const hasNumbers = rawNames.some((name) => cleanName(name) !== name.trim());

  return {
    names,
    fixes: [
      ...(hasColumns ? (['columns'] as const) : []),
      ...(hasHeader ? (['header'] as const) : []),
      ...(hasNumbers ? (['numbers'] as const) : []),
    ],
  };
};

/** Same as `cleanStudentRows`, for text pasted or read from a CSV file. */
export const cleanStudentList = (
  text: string,
  source: StudentListSource = 'paste',
): CleanedStudentList =>
  cleanStudentRows(parseDelimited(text, source === 'paste' ? PASTE_DELIMITERS : undefined));

const capitalize = (word: string): string =>
  word
    .split('-')
    .map((part) => part.charAt(0).toLocaleUpperCase('pt-BR') + part.slice(1))
    .join('-');

/** "MARIA DA SILVA" → "Maria da Silva"; the first word is always capitalized. */
export const toNameCase = (name: string): string =>
  name
    .toLocaleLowerCase('pt-BR')
    .split(' ')
    .map((word, index) => (index > 0 && NAME_PARTICLES.has(word) ? word : capitalize(word)))
    .join(' ');

const isUpperCase = (name: string): boolean =>
  letterCount(name) > 0 && name === name.toLocaleUpperCase('pt-BR');

/** Most names written in capital letters, as lists from the school office usually come. */
export const hasMostlyUpperCaseNames = (names: string[]): boolean =>
  names.length > 0 && names.filter(isUpperCase).length > names.length / 2;
