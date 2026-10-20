import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { Classroom, Student } from '@/features/classroom/types';

type ClassroomState = {
  classrooms: Classroom[];
};

type SetStudentsPayload = {
  classroomId: string;
  studentNames: string[];
};

const initialState: ClassroomState = {
  classrooms: [],
};

const toStudents = (studentNames: string[]): Student[] =>
  studentNames.map((name) => ({ id: nanoid(), name }));

const classroomSlice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    addClassroom: {
      reducer: (state, action: PayloadAction<Classroom>) => {
        state.classrooms.push(action.payload);
      },
      prepare: (name: string, studentNames: string[] = []) => ({
        payload: { id: nanoid(), name, students: toStudents(studentNames) },
      }),
    },
    removeClassroom: (state, action: PayloadAction<string>) => {
      state.classrooms = state.classrooms.filter((classroom) => classroom.id !== action.payload);
    },
    setStudents: {
      reducer: (state, action: PayloadAction<{ classroomId: string; students: Student[] }>) => {
        const classroom = state.classrooms.find(({ id }) => id === action.payload.classroomId);

        if (classroom) {
          classroom.students = action.payload.students;
        }
      },
      prepare: ({ classroomId, studentNames }: SetStudentsPayload) => ({
        payload: { classroomId, students: toStudents(studentNames) },
      }),
    },
  },
  selectors: {
    selectClassrooms: (state) => state.classrooms,
  },
});

export const { addClassroom, removeClassroom, setStudents } = classroomSlice.actions;
export const { selectClassrooms } = classroomSlice.selectors;
export const classroomReducer = classroomSlice.reducer;
