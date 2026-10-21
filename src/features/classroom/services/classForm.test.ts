import { describe, expect, it } from 'vitest';

import {
  getClassInfo,
  getStudentNames,
  toClassFormValues,
} from '@/features/classroom/services/classForm';

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
  it('fills the form with the saved classroom', () => {
    const classroom = {
      id: '1',
      name: '7º A',
      students: [
        { id: 'a', name: 'Ana' },
        { id: 'b', name: 'Bruno' },
      ],
    };

    expect(toClassFormValues(classroom)).toEqual({
      classroomName: '7º A',
      studentsText: 'Ana\nBruno',
    });
  });
});
