export type LabelModelId = 'a4-21' | 'a4-14' | 'a4-16' | 'plain-24';

/** A sheet of labels, measured in millimeters from the top-left corner of the A4 page. */
export type LabelModel = {
  id: LabelModelId;
  label: string;
  description: string;
  columns: number;
  rows: number;
  width: number;
  height: number;
  top: number;
  left: number;
  /** Space between one label and the next, across and down. */
  gapX: number;
  gapY: number;
  /** Plain paper: draws a dashed line around each label, to cut. */
  cutLines: boolean;
};

export type LabelsFormValues = {
  modelId: LabelModelId;
  copiesPerStudent: number;
  /** Position (1 = top left) of the first free label on a sheet already used. */
  startAt: number;
  showClassroom: boolean;
  showSubject: boolean;
  extraText: string;
};

export type LabelContent = {
  name: string;
  details: string[];
};
