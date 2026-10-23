import { LABEL_MODELS } from '@/features/labels/constants';
import type { LabelContent, LabelModel, LabelModelId } from '@/features/labels/types';
import { chunk } from '@/lib/array/chunk';

export const getLabelModel = (modelId: LabelModelId): LabelModel =>
  LABEL_MODELS.find(({ id }) => id === modelId) ?? LABEL_MODELS[0];

export const labelsPerSheet = ({ columns, rows }: LabelModel): number => columns * rows;

type LabelSheetsOptions = {
  labels: LabelContent[];
  model: LabelModel;
  copiesPerStudent: number;
  startAt: number;
};

/**
 * Lays the labels on sheets, `copiesPerStudent` of each student in a row. The first sheet
 * skips the positions before `startAt` (labels already used), which stay `null`.
 */
export const buildLabelSheets = ({
  labels,
  model,
  copiesPerStudent,
  startAt,
}: LabelSheetsOptions): (LabelContent | null)[][] => {
  const perSheet = labelsPerSheet(model);
  const skipped = Math.min(Math.max(startAt, 1), perSheet) - 1;
  const copies = labels.flatMap((label) => Array<LabelContent>(copiesPerStudent).fill(label));

  return copies.length === 0
    ? []
    : chunk<LabelContent | null>([...Array<null>(skipped).fill(null), ...copies], perSheet);
};

type LabelDetails = {
  classroomName: string;
  subject: string;
  extraText: string;
  showClassroom: boolean;
  showSubject: boolean;
};

/** The small lines under the name: class, subject and a free text, when chosen. */
export const buildLabelDetails = ({
  classroomName,
  subject,
  extraText,
  showClassroom,
  showSubject,
}: LabelDetails): string[] =>
  [
    showClassroom && classroomName.trim() && `Turma: ${classroomName.trim()}`,
    showSubject && subject.trim(),
    extraText.trim(),
  ].filter((detail): detail is string => Boolean(detail));

/** Long names get a smaller font so they fit the label on one or two lines. */
export const getNameFontSize = (name: string, model: LabelModel): number => {
  const base = model.width > 90 ? 18 : 14;
  return name.length > 32 ? base - 4 : name.length > 22 ? base - 2 : base;
};
