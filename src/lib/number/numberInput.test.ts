import { describe, expect, it } from 'vitest';

import { formatNumberInput, parseNumberInput, stepNumber } from '@/lib/number/numberInput';

describe('parseNumberInput', () => {
  it('accepts comma and dot as decimal separator', () => {
    expect(parseNumberInput('7,5')).toBe(7.5);
    expect(parseNumberInput(' 7.5 ')).toBe(7.5);
  });

  it('treats a blank field as 0', () => {
    expect(parseNumberInput('  ')).toBe(0);
  });

  it('returns NaN for text that is not a number', () => {
    expect(parseNumberInput('dez')).toBeNaN();
  });
});

describe('formatNumberInput', () => {
  it('formats with a comma', () => {
    expect(formatNumberInput(7.5)).toBe('7,5');
    expect(formatNumberInput(20)).toBe('20');
  });

  it('shows 0 and invalid values as blank', () => {
    expect(formatNumberInput(0)).toBe('');
    expect(formatNumberInput(Number.NaN)).toBe('');
  });
});

describe('stepNumber', () => {
  it('adds or subtracts the step', () => {
    expect(stepNumber(10, 1, 1, 300)).toBe(11);
    expect(stepNumber(10, -1, 1, 300)).toBe(9);
  });

  it('stays inside the limits', () => {
    expect(stepNumber(1, -1, 1, 300)).toBe(1);
    expect(stepNumber(300, 1, 1, 300)).toBe(300);
  });

  it('starts at the minimum when the field is blank or invalid', () => {
    expect(stepNumber(0, 1, 1, 300)).toBe(1);
    expect(stepNumber(Number.NaN, 1, 1, 300)).toBe(1);
    expect(stepNumber(0, -1, 1, 300)).toBe(1);
  });
});
