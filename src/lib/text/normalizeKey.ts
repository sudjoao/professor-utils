/** A name ready to be used as a key: ignores case and extra spaces ("7º  a" = "7º A"). */
export const normalizeKey = (text: string): string =>
  text.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');
