import type { GradeSummary } from '@/features/grades/types';

export const MAX_GRADE_COLUMNS = 20;

export const DEFAULT_GRADE_COUNT = 4;

export const DEFAULT_MAX_GRADE = 10;

/** Upper bound for the "nota máxima" field, enough for 0–100 point scales. */
export const MAX_GRADE_LIMIT = 1000;

export const SUMMARY_OPTIONS: { value: GradeSummary; label: string; columnTitle?: string }[] = [
  { value: 'average', label: 'Média', columnTitle: 'Média' },
  { value: 'sum', label: 'Soma', columnTitle: 'Total' },
  { value: 'none', label: 'Nenhuma' },
];
