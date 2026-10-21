import type { ColumnMode } from '@/features/attendance/types';

/** Longest period accepted in a single date range. */
export const MAX_RANGE_DAYS = 366;

export const MAX_LESSON_COLUMNS = 300;

/** Lesson columns that still fit, readable, across one landscape A4 page. */
export const MAX_COLUMNS_PER_PAGE = 25;

export const DEFAULT_LESSON_COUNT = 20;

export const COLUMN_MODE_CHOICES: { value: ColumnMode; label: string; description: string }[] = [
  {
    value: 'dates',
    label: 'Com as datas das aulas',
    description: 'Você escolhe o período e os dias da semana; cada coluna já sai com a data.',
  },
  {
    value: 'count',
    label: 'Só numerar as aulas',
    description: 'Você diz quantas aulas são e escreve as datas à mão depois.',
  },
];
