import type { ClassFormValues, ClassInfo } from '@/features/classroom/types';

export type GradeColumnMode = 'count' | 'titles';

export type GradeSummary = 'average' | 'sum' | 'none';

export type GradesFormValues = ClassFormValues & {
  columnMode: GradeColumnMode;
  gradeCount: number;
  gradeTitlesText: string;
  summary: GradeSummary;
  maxGrade: number;
};

export type GradesSheetData = {
  classInfo: ClassInfo;
  studentNames: string[];
  gradeTitles: string[];
  summary: GradeSummary;
  maxGrade: number;
};
