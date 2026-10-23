const ALL_DELIMITERS = ['\t', ';', ','];
const LINE_BREAK = /\r?\n/;

/** The delimiter that splits the first lines into the most columns. */
const detectDelimiter = (lines: string[], delimiters: string[]): string => {
  const sample = lines.slice(0, 10);
  const counts = delimiters.map((delimiter) => ({
    delimiter,
    count: sample.reduce((total, line) => total + line.split(delimiter).length - 1, 0),
  }));
  const best = counts.reduce((first, second) => (second.count > first.count ? second : first));

  return best.count > 0 ? best.delimiter : '\t';
};

/** Splits one line, keeping delimiters inside double quotes (`"Souza, Ana"`). */
const splitLine = (line: string, delimiter: string): string[] => {
  const cells: string[] = [];
  let cell = '';
  let isQuoted = false;

  for (let index = 0; index < line.length; index++) {
    const char = line[index];

    if (char === '"' && isQuoted && line[index + 1] === '"') {
      cell += '"';
      index++;
    } else if (char === '"') {
      isQuoted = !isQuoted;
    } else if (char === delimiter && !isQuoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }

  return [...cells, cell].map((value) => value.trim());
};

/**
 * Reads a table pasted from a spreadsheet or saved as CSV: one row per line, cells split by
 * the delimiter the text uses (tab, `;` or `,` by default). Blank lines are skipped.
 */
export const parseDelimited = (text: string, delimiters = ALL_DELIMITERS): string[][] => {
  const lines = text.split(LINE_BREAK).filter((line) => line.trim().length > 0);
  const delimiter = detectDelimiter(lines, delimiters);

  return lines.map((line) => splitLine(line, delimiter));
};
