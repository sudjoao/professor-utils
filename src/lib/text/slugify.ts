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

/** Joins the slug of each part, skipping blank ones: `('Lista de notas', '7º A')` → `lista-de-notas-7o-a`. */
export const toFileName = (...parts: string[]): string =>
  parts.map(slugify).filter(Boolean).join('-');
