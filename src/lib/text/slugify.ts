const DIACRITICS = /[̀-ͯ]/g;
const NON_ALPHANUMERIC_SEQUENCE = /[^a-z0-9]+/g;
const EDGE_HYPHENS = /^-+|-+$/g;

export const slugify = (text: string): string =>
  text
    .normalize('NFKD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .replace(NON_ALPHANUMERIC_SEQUENCE, '-')
    .replace(EDGE_HYPHENS, '');
