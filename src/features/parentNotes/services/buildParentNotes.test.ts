import { describe, expect, it } from 'vitest';

import {
  buildParentNotes,
  INITIAL_PARENT_NOTE,
} from '@/features/parentNotes/services/buildParentNotes';

const context = {
  studentNames: ['Ana Souza', 'Bruno Lima'],
  teacherName: ' Sandra ',
  schoolName: 'EC 18',
  city: 'Gama/DF',
  date: '2026-10-23',
};

describe('buildParentNotes', () => {
  it('writes one note per student, with the name in the message', () => {
    const notes = buildParentNotes(
      { ...INITIAL_PARENT_NOTE, message: 'Senhores responsáveis por [ALUNO],\n\nReunião dia 30.' },
      context,
    );

    expect(notes).toHaveLength(2);
    expect(notes[1]).toEqual({
      studentName: 'Bruno Lima',
      title: 'Bilhete aos responsáveis',
      schoolName: 'EC 18',
      paragraphs: ['Senhores responsáveis por Bruno Lima,', '', 'Reunião dia 30.'],
      dateLine: 'Gama/DF, 23 de outubro de 2026',
      signature: 'Prof.(a) Sandra',
      includeReceipt: true,
    });
  });

  it('leaves out what is missing', () => {
    const [note] = buildParentNotes(INITIAL_PARENT_NOTE, {
      ...context,
      teacherName: '',
      city: '',
      date: '',
    });

    expect(note.signature).toBe('');
    expect(note.dateLine).toBe('');
  });
});
