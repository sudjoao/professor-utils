import type { Shift, Term } from '@/features/reports/types';

export const STUDENT_PLACEHOLDER = '[ALUNO]';

export const DEFAULT_HEADER_IMAGE = '/reports/brasao-df.png';

export const MAX_HEADER_IMAGE_BYTES = 1024 * 1024;

export const MAX_SCHOOL_DAYS = 366;

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

export type PhraseGroup = {
  title: string;
  phrases: string[];
};

/**
 * Starting points for the evaluation, to adapt to each student. `[ALUNO]` becomes the
 * student's name when inserted.
 */
export const READY_PHRASES: PhraseGroup[] = [
  {
    title: 'Leitura',
    phrases: [
      '[ALUNO] lê pequenos textos com autonomia e compreende o que leu.',
      '[ALUNO] reconhece as letras do alfabeto e está avançando na leitura de palavras.',
      '[ALUNO] ainda precisa de apoio para ler textos curtos e segue com atividades diárias de leitura.',
    ],
  },
  {
    title: 'Escrita',
    phrases: [
      '[ALUNO] escreve frases com sentido, usando letra maiúscula e pontuação.',
      '[ALUNO] produz pequenos textos com sequência lógica de ideias.',
      '[ALUNO] está avançando na escrita de palavras e frases simples.',
    ],
  },
  {
    title: 'Matemática',
    phrases: [
      '[ALUNO] resolve situações-problema envolvendo adição e subtração.',
      '[ALUNO] reconhece, lê e escreve números até 100.',
      '[ALUNO] ainda precisa de material concreto para realizar cálculos.',
    ],
  },
  {
    title: 'Participação',
    phrases: [
      '[ALUNO] participa das atividades propostas com interesse e dedicação.',
      '[ALUNO] realiza as tarefas de casa com regularidade.',
      '[ALUNO] precisa de incentivo para participar das atividades em grupo.',
    ],
  },
  {
    title: 'Convivência',
    phrases: [
      '[ALUNO] relaciona-se bem com os colegas e respeita as regras combinadas.',
      '[ALUNO] está aprendendo a lidar com frustrações e a esperar a sua vez.',
    ],
  },
  {
    title: 'Intervenções e orientações',
    phrases: [
      'Foram realizadas intervenções em pequenos grupos e atividades diversificadas para apoiar a aprendizagem.',
      'Sugere-se que a família acompanhe a leitura diária em casa.',
    ],
  },
];
