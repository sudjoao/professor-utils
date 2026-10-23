import { describe, expect, it } from 'vitest';

import {
  buildAverageFormula,
  buildFinalFormula,
  buildStatusFormula,
  buildSumFormula,
} from '@/features/grades/services/gradesFormulas';

const grades = { row: 6, firstColumn: 'C', lastColumn: 'E' };

describe('grade formulas', () => {
  it('averages the grades, blank until the first one', () => {
    expect(buildAverageFormula(grades)).toBe('IF(COUNT(C6:E6)=0,"",AVERAGE(C6:E6))');
  });

  it('weights the average with the weights row, counting only the grades given', () => {
    expect(buildAverageFormula(grades, 4)).toBe(
      'IF(COUNT(C6:E6)=0,"",SUMPRODUCT(C6:E6,C$4:E$4)/SUMIFS(C$4:E$4,C6:E6,"<>"))',
    );
  });

  it('sums the grades, weighted or not', () => {
    expect(buildSumFormula(grades)).toBe('IF(COUNT(C6:E6)=0,"",SUM(C6:E6))');
    expect(buildSumFormula(grades, 4)).toBe('IF(COUNT(C6:E6)=0,"",SUMPRODUCT(C6:E6,C$4:E$4))');
  });

  it('takes the higher of the summary and the recovery grade', () => {
    expect(buildFinalFormula('F6', 'G6')).toBe('IF(COUNT(F6,G6)=0,"",MAX(F6,G6))');
  });

  it('tells whether the result reached the passing grade', () => {
    expect(buildStatusFormula('H6', 5)).toBe('IF(H6="","",IF(H6>=5,"Na média","Abaixo da média"))');
  });
});
