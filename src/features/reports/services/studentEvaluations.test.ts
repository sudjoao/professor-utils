import { describe, expect, it } from 'vitest';

import {
  belongsToClassTerm,
  getClassTermKey,
  getStudentKey,
  isEmptyEvaluation,
  parseAbsences,
} from '@/features/reports/services/studentEvaluations';

describe('keys', () => {
  it('ignore case and extra spaces in class and student names', () => {
    const classTerm = getClassTermKey(' 7º  A ', 2);

    expect(classTerm).toBe(getClassTermKey('7º a', 2));
    expect(getStudentKey(classTerm, 'ANA  SOUZA')).toBe(getStudentKey(classTerm, 'Ana Souza'));
  });

  it('separate terms and classes', () => {
    expect(getClassTermKey('7º A', 1)).not.toBe(getClassTermKey('7º A', 2));
    expect(belongsToClassTerm(getStudentKey('7º a|2', 'Ana'), '7º a|2')).toBe(true);
    expect(belongsToClassTerm(getStudentKey('7º a|2', 'Ana'), '7º a|1')).toBe(false);
  });
});

describe('isEmptyEvaluation', () => {
  it('is empty with no text and no absences', () => {
    expect(isEmptyEvaluation({ text: ' \n ', absences: null })).toBe(true);
    expect(isEmptyEvaluation({ text: '', absences: 0 })).toBe(false);
  });
});

describe('parseAbsences', () => {
  it('reads whole numbers and treats blank as not filled in', () => {
    expect(parseAbsences('12')).toBe(12);
    expect(parseAbsences('0')).toBe(0);
    expect(parseAbsences(' ')).toBeNull();
    expect(parseAbsences('3 faltas')).toBe(3);
  });
});
