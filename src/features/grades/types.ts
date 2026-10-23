import type { ClassFormValues, ClassInfo, SheetStyle } from '@/features/classroom/types';

export type GradeColumnMode = 'count' | 'titles';

export type GradeSummary = 'average' | 'sum' | 'none';

export type GradesFormValues = ClassFormValues & {
  columnMode: GradeColumnMode;
  gradeCount: number;
  gradeTitlesText: string;
  summary: GradeSummary;
  maxGrade: number;
  /** Each grade has its own weight (by position); the weights also go to the sheet. */
  weighted: boolean;
  weights: number[];
  /** "Recup." and "Final" columns: the final grade is the higher of the two. */
  includeRecovery: boolean;
  /** "Situação" column: "Na média" or "Abaixo da média". */
  includeStatus: boolean;
  passingGrade: number;
};

export type GradesSheetData = {
  classInfo: ClassInfo;
  studentNames: string[];
  gradeTitles: string[];
  summary: GradeSummary;
  maxGrade: number;
  /** One weight per grade, or `null` when every grade weighs the same. */
  weights: number[] | null;
  includeRecovery: boolean;
  includeStatus: boolean;
  passingGrade: number;
  style: SheetStyle;
};
