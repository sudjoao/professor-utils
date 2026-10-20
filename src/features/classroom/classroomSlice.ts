import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { Classroom, Student } from '@/features/classroom/types';

type ClassroomState = {
  classrooms: Classroom[];
};

type SaveClassroomPayload = {
  name: string;
  studentNames: string[];
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

const isSameName = (first: string, second: string): boolean =>
  first.localeCompare(second, 'pt-BR', { sensitivity: 'base' }) === 0;

const classroomSlice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    /** Creates the classroom, or replaces the students of the one that already has this name. */
    saveClassroom: {
      reducer: (state, action: PayloadAction<Classroom>) => {
        const existing = state.classrooms.find(({ name }) => isSameName(name, action.payload.name));

        if (existing) {
          existing.students = action.payload.students;
          return;
        }

        state.classrooms.push(action.payload);
      },
      prepare: ({ name, studentNames }: SaveClassroomPayload) => ({
        payload: { id: nanoid(), name: name.trim(), students: toStudents(studentNames) },
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

export const { saveClassroom, removeClassroom, setStudents } = classroomSlice.actions;
export const { selectClassrooms } = classroomSlice.selectors;
export const classroomReducer = classroomSlice.reducer;
