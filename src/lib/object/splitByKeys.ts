/**
 * Splits an object in two: the entries whose key is in `keys` and all the others.
 * Lets one `onChange` feed state that lives in different places (Redux slices, local state).
 */
export const splitByKeys = <Value extends object, Key extends keyof Value>(
  value: Value,
  keys: readonly Key[],
): [Pick<Value, Key>, Omit<Value, Key>] => {
  const entries = Object.entries(value);
  const isPicked = (key: string) => (keys as readonly string[]).includes(key);

  return [
    Object.fromEntries(entries.filter(([key]) => isPicked(key))) as Pick<Value, Key>,
    Object.fromEntries(entries.filter(([key]) => !isPicked(key))) as Omit<Value, Key>,
  ];
};

export const hasEntries = (value: object): boolean => Object.keys(value).length > 0;
