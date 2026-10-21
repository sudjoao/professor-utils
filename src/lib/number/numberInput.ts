const numberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
  useGrouping: false,
});

/**
 * Reads what the teacher typed in a number field, accepting a comma as decimal separator.
 * Blank counts as 0 and anything that is not a number becomes `NaN`, so validation can flag it.
 */
export const parseNumberInput = (text: string): number => {
  const normalized = text.trim().replace(',', '.');
  return normalized === '' ? 0 : Number(normalized);
};

/** Shows numbers the Brazilian way (`7,5`); 0 and invalid values show as a blank field. */
export const formatNumberInput = (value: number): string =>
  Number.isFinite(value) && value !== 0 ? numberFormatter.format(value) : '';

/** Adds `step` to the value, staying between `min` and `max`; a blank or invalid value starts at `min`. */
export const stepNumber = (value: number, step: number, min: number, max: number): number => {
  const start = Number.isFinite(value) && value >= min ? value : min - Math.max(step, 0);
  return Math.min(Math.max(start + step, min), max);
};
