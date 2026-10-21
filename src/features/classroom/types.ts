import type { Fill } from 'exceljs';

export type Student = {
  id: string;
  name: string;
};

export type Classroom = {
  id: string;
  name: string;
  /** Missing in classrooms saved before the subject was stored. */
  subject?: string;
  students: Student[];
};

/** Identification printed at the top of every sheet. */
export type ClassInfo = {
  classroomName: string;
  subject: string;
  teacherName: string;
};

/** The "class and students" part shared by every sheet form. */
export type ClassFormValues = ClassInfo & {
  studentsText: string;
  sortStudents: boolean;
};

export type SheetPaletteId = 'gray' | 'blue' | 'green' | 'yellow' | 'pink' | 'purple' | 'orange';

export type SheetFontSize = 'normal' | 'large';

/** How the teacher wants the sheets to look; shared by every sheet and kept in the browser. */
export type SheetStylePreferences = {
  paletteId: SheetPaletteId;
  /** Alternate row colors, which help following a student's row across the page. */
  stripes: boolean;
  fontSize: SheetFontSize;
};

export type SheetPalette = {
  id: SheetPaletteId;
  label: string;
  /** Colors in Excel's ARGB format (`FF` + hex). */
  headerArgb: string;
  stripeArgb: string;
};

/** Preferences turned into what the sheet builders need. */
export type SheetStyle = {
  headerFill: Fill;
  stripeFill: Fill | null;
  /** Multiplies font sizes, row heights and narrow column widths. */
  textScale: number;
};
