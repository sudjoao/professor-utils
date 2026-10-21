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
