import { describe, expect, it } from 'vitest';

import { fitHeaderImage } from '@/features/reports/services/headerImage';

describe('fitHeaderImage', () => {
  it('scales the default coat of arms to the template size', () => {
    expect(fitHeaderImage(2000, 2372)).toEqual({ width: 77, height: 91 });
  });

  it('limits the width of wide images, keeping proportions', () => {
    expect(fitHeaderImage(1200, 300)).toEqual({ width: 150, height: 38 });
  });
});
