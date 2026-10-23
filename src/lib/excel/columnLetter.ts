/** Excel column letter of a 1-based column number: 1 → `A`, 27 → `AA`. */
export const columnLetter = (columnNumber: number): string => {
  let letters = '';
  let remaining = columnNumber;

  while (remaining > 0) {
    const index = (remaining - 1) % 26;
    letters = String.fromCharCode(65 + index) + letters;
    remaining = Math.floor((remaining - 1) / 26);
  }

  return letters;
};
