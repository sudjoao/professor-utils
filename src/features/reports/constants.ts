import type { Shift, Term } from '@/features/reports/types';

export const STUDENT_PLACEHOLDER = '[ALUNO]';

export const DEFAULT_HEADER_IMAGE = '/reports/brasao-df.png';

export const MAX_HEADER_IMAGE_BYTES = 1024 * 1024;

export const DEFAULT_STAGE = 'Ensino Fundamental – Anos Iniciais';

export const SHIFT_OPTIONS: { value: Shift; label: string }[] = [
  { value: 'morning', label: 'Matutino' },
  { value: 'afternoon', label: 'Vespertino' },
  { value: 'fullTime', label: 'Integral' },
];

export const TERM_OPTIONS: { value: Term; label: string }[] = [
  { value: 1, label: '1º' },
  { value: 2, label: '2º' },
  { value: 3, label: '3º' },
  { value: 4, label: '4º' },
];
