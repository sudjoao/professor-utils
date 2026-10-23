import type { CouncilColumn, CouncilColumnKey } from '@/features/council/types';

export const COUNCIL_COLUMNS: (CouncilColumn & { key: CouncilColumnKey })[] = [
  { key: 'absences', title: 'Faltas', isText: false },
  { key: 'grade', title: 'Nota ou conceito', isText: false },
  { key: 'learning', title: 'Aprendizagens', isText: true },
  { key: 'difficulties', title: 'Dificuldades', isText: true },
  { key: 'actions', title: 'Encaminhamentos', isText: true },
  { key: 'participation', title: 'Participação e convivência', isText: true },
];

export const DEFAULT_COUNCIL_COLUMNS: CouncilColumnKey[] = [
  'absences',
  'grade',
  'learning',
  'difficulties',
  'actions',
];

export const MAX_COUNCIL_COLUMNS = 10;
