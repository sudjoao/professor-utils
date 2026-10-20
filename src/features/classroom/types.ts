export type Student = {
  id: string;
  name: string;
};

export type Classroom = {
  id: string;
  name: string;
  students: Student[];
};
