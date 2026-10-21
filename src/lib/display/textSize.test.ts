import { describe, expect, it } from 'vitest';

import { isTextSize, stepTextSize } from '@/lib/display/textSize';

describe('stepTextSize', () => {
  it('goes up and down one size at a time', () => {
    expect(stepTextSize('normal', 1)).toBe('large');
    expect(stepTextSize('x-large', -1)).toBe('large');
  });

  it('stops at the smallest and the largest size', () => {
    expect(stepTextSize('normal', -1)).toBe('normal');
    expect(stepTextSize('x-large', 1)).toBe('x-large');
  });
});

describe('isTextSize', () => {
  it('accepts only known sizes', () => {
    expect(isTextSize('large')).toBe(true);
    expect(isTextSize('huge')).toBe(false);
    expect(isTextSize(null)).toBe(false);
  });
});
