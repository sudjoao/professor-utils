import { describe, expect, it } from 'vitest';

import {
  getClassInfo,
  getStudentNames,
  isSameName,
  toClassFormValues,
  wouldReplaceStudents,
} from '@/features/classroom/services/classForm';
import type { Classroom } from '@/features/classroom/types';

describe('getStudentNames', () => {
  it('sorts students alphabetically ignoring case and accents', () => {
    expect(
      getStudentNames({ studentsText: 'Carla Dias\nÁlvaro Reis\nana souza', sortStudents: true }),
    ).toEqual(['Álvaro Reis', 'ana souza', 'Carla Dias']);
  });

  it('keeps the typed order when sorting is off', () => {
    expect(getStudentNames({ studentsText: 'Carla Dias\nana souza', sortStudents: false })).toEqual(
      ['Carla Dias', 'ana souza'],
    );
  });
});

describe('getClassInfo', () => {
  it('trims every field', () => {
    expect(
      getClassInfo({ classroomName: ' 7º A ', subject: ' Matemática', teacherName: '' }),
    ).toEqual({ classroomName: '7º A', subject: 'Matemática', teacherName: '' });
  });
});

describe('toClassFormValues', () => {
  const classroom: Classroom = {
    id: '1',
    name: '7º A',
    students: [
      { id: 'a', name: 'Ana' },
      { id: 'b', name: 'Bruno' },
    ],
  };

  it('fills the form with the saved classroom', () => {
    expect(toClassFormValues({ ...classroom, subject: 'Matemática' })).toEqual({
      classroomName: '7º A',
      subject: 'Matemática',
      studentsText: 'Ana\nBruno',
    });
  });

  it('leaves the subject blank for classrooms saved without one', () => {
    expect(toClassFormValues(classroom).subject).toBe('');
  });
});

describe('isSameName', () => {
  it('ignores case, accents and surrounding spaces', () => {
    expect(isSameName(' 7º a ', '7º A')).toBe(true);
    expect(isSameName('Matemática', 'matematica')).toBe(true);
    expect(isSameName('7º A', '7º B')).toBe(false);
  });
});

describe('wouldReplaceStudents', () => {
  const classroom: Classroom = {
    id: '1',
    name: '7º A',
    students: [
      { id: 'a', name: 'Ana Souza' },
      { id: 'b', name: 'Bruno Lima' },
    ],
  };

  it('is false when no student was typed yet', () => {
    expect(wouldReplaceStudents([], classroom)).toBe(false);
  });

  it('is false when the typed students are the same', () => {
    expect(wouldReplaceStudents(['ana souza', 'Bruno Lima'], classroom)).toBe(false);
  });

  it('is true when the typed students are different', () => {
    expect(wouldReplaceStudents(['Ana Souza'], classroom)).toBe(true);
    expect(wouldReplaceStudents(['Ana Souza', 'Carla Dias'], classroom)).toBe(true);
  });
});
