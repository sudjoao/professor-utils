import { describe, expect, it } from 'vitest';

import { getColumnWidths } from '@/features/classroom/services/printableSheet';

describe('getColumnWidths', () => {
  it('shares the free width by weight', () => {
    expect(
      getColumnWidths([{ label: 'Faltas' }, { label: 'Aprendizagens', weight: 3 }], 60),
    ).toEqual([15, 45]);
  });

  it('gives everything to a single column', () => {
    expect(getColumnWidths([{ label: 'Assinatura', weight: 3 }], 70)).toEqual([70]);
  });
});
