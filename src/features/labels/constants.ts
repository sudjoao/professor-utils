import type { LabelModel, LabelsFormValues } from '@/features/labels/types';

/**
 * Common A4 label sheets. The sizes are the usual ones for these sheets (Pimaco A4260/A4263/
 * A4262 and Avery L7160/L7163/L7162 use the same layout); brands may differ by a millimeter.
 */
export const LABEL_MODELS: LabelModel[] = [
  {
    id: 'a4-21',
    label: '21 por folha',
    description: '63,5 × 38,1 mm (Pimaco A4260 ou Avery L7160)',
    columns: 3,
    rows: 7,
    width: 63.5,
    height: 38.1,
    top: 15.15,
    left: 7.21,
    gapX: 2.54,
    gapY: 0,
    cutLines: false,
  },
  {
    id: 'a4-14',
    label: '14 por folha',
    description: '99,1 × 38,1 mm (Pimaco A4263 ou Avery L7163)',
    columns: 2,
    rows: 7,
    width: 99.06,
    height: 38.1,
    top: 15.15,
    left: 4.65,
    gapX: 2.54,
    gapY: 0,
    cutLines: false,
  },
  {
    id: 'a4-16',
    label: '16 por folha',
    description: '99,1 × 33,9 mm (Pimaco A4262 ou Avery L7162)',
    columns: 2,
    rows: 8,
    width: 99.06,
    height: 33.87,
    top: 12.9,
    left: 4.65,
    gapX: 2.54,
    gapY: 0,
    cutLines: false,
  },
  {
    id: 'plain-24',
    label: 'Folha comum, para recortar',
    description: '24 etiquetas de 66 × 34 mm, com linha tracejada para cortar',
    columns: 3,
    rows: 8,
    width: 66,
    height: 34,
    // Centered, away from the edges most printers cannot reach.
    top: 12.5,
    left: 6,
    gapX: 0,
    gapY: 0,
    cutLines: true,
  },
];

export const INITIAL_LABELS_VALUES: LabelsFormValues = {
  modelId: 'a4-21',
  copiesPerStudent: 1,
  startAt: 1,
  showClassroom: true,
  showSubject: false,
  extraText: '',
};

export const MAX_COPIES_PER_STUDENT = 20;
