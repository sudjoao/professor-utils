import { describe, expect, it } from 'vitest';

import { normalizeKey } from '@/lib/text/normalizeKey';

describe('normalizeKey', () => {
  it('ignores case and extra spaces', () => {
    expect(normalizeKey('  7º   A ')).toBe('7º a');
  });
});
