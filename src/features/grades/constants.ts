import type { GradeColumnMode, GradeSummary } from '@/features/grades/types';

export const MAX_GRADE_COLUMNS = 20;

export const DEFAULT_GRADE_COUNT = 4;

export const DEFAULT_MAX_GRADE = 10;

/** Upper bound for the "nota máxima" field, enough for 0–100 point scales. */
export const MAX_GRADE_LIMIT = 1000;

export const SUMMARY_OPTIONS: { value: GradeSummary; label: string; columnTitle?: string }[] = [
  { value: 'average', label: 'A média das notas', columnTitle: 'Média' },
  { value: 'sum', label: 'A soma das notas', columnTitle: 'Total' },
  { value: 'none', label: 'Não calcular' },
];

export const COLUMN_MODE_CHOICES: {
  value: GradeColumnMode;
  label: string;
  description: string;
}[] = [
  {
    value: 'count',
    label: 'Nota 1, Nota 2, Nota 3...',
    description: 'Você só diz quantas notas a turma vai ter.',
  },
  {
    value: 'titles',
    label: 'Dar um nome para cada nota',
    description: 'Ex.: Prova, Trabalho, Participação.',
  },
];
