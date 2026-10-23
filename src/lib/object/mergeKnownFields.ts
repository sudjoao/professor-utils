/**
 * Starts from `defaults` and takes from `value` only the fields `defaults` has, with the same
 * type. Reads data from outside (a file, old saved state) without trusting its shape.
 */
export const mergeKnownFields = <Defaults extends object>(
  defaults: Defaults,
  value: unknown,
): Defaults => {
  if (typeof value !== 'object' || value === null) {
    return { ...defaults };
  }

  const source = value as Record<string, unknown>;
  const entries = Object.entries(defaults).map(([key, defaultValue]) => {
    const candidate = source[key];
    const isSameType =
      candidate !== undefined &&
      (defaultValue === null
        ? candidate === null || typeof candidate === 'string'
        : typeof candidate === typeof defaultValue &&
          Array.isArray(candidate) === Array.isArray(defaultValue));

    return [key, isSameType ? candidate : defaultValue];
  });

  return Object.fromEntries(entries) as Defaults;
};
