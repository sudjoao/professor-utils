import { describe, expect, it } from 'vitest';

import {
  classroomReducer,
  putClassroom,
  removeClassroom,
  saveClassroom,
} from '@/features/classroom/classroomSlice';

const emptyState = { classrooms: [] };

describe('classroomSlice', () => {
  it('saves a new classroom with its students', () => {
    const state = classroomReducer(
      emptyState,
      saveClassroom({ name: ' 7º A ', subject: ' Matemática ', studentNames: ['Ana', 'Bruno'] }),
    );

    expect(state.classrooms).toHaveLength(1);
    expect(state.classrooms[0].name).toBe('7º A');
    expect(state.classrooms[0].subject).toBe('Matemática');
    expect(state.classrooms[0].students.map(({ name }) => name)).toEqual(['Ana', 'Bruno']);
  });

  it('replaces the students when a classroom with the same name already exists', () => {
    const firstState = classroomReducer(
      emptyState,
      saveClassroom({ name: '7º A', subject: 'Matemática', studentNames: ['Ana'] }),
    );
    const state = classroomReducer(
      firstState,
      saveClassroom({ name: '7º a', subject: 'Português', studentNames: ['Carla'] }),
    );

    expect(state.classrooms).toHaveLength(1);
    expect(state.classrooms[0].id).toBe(firstState.classrooms[0].id);
    expect(state.classrooms[0].subject).toBe('Português');
    expect(state.classrooms[0].students.map(({ name }) => name)).toEqual(['Carla']);
  });

  it('removes a classroom by id', () => {
    const savedState = classroomReducer(
      emptyState,
      saveClassroom({ name: '7º A', subject: '', studentNames: [] }),
    );
    const state = classroomReducer(savedState, removeClassroom(savedState.classrooms[0].id));

    expect(state.classrooms).toEqual([]);
  });

  it('puts a removed classroom back where it was', () => {
    const classrooms = ['A', 'B', 'C'].map((name) => ({ id: name, name, students: [] }));
    const removed = classroomReducer({ classrooms }, removeClassroom('B'));
    const state = classroomReducer(removed, putClassroom({ classroom: classrooms[1], index: 1 }));

    expect(state.classrooms.map(({ name }) => name)).toEqual(['A', 'B', 'C']);
  });

  it('puts back the previous version of a classroom that was updated', () => {
    const before = { id: 'A', name: '7º A', students: [{ id: '1', name: 'Ana' }] };
    const updated = { ...before, students: [{ id: '2', name: 'Carla' }] };
    const state = classroomReducer(
      { classrooms: [updated] },
      putClassroom({ classroom: before, index: 0 }),
    );

    expect(state.classrooms).toEqual([before]);
  });
});
