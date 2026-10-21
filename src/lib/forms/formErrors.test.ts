import { describe, expect, it } from 'vitest';

import { getFieldError } from '@/lib/forms/formErrors';

describe('getFieldError', () => {
  const errors = [
    { field: 'studentsText', message: 'Escreva o nome de pelo menos um aluno.' },
    { message: 'Erro geral.' },
  ];

  it('finds the message of a field', () => {
    expect(getFieldError(errors, 'studentsText')).toBe('Escreva o nome de pelo menos um aluno.');
  });

  it('returns undefined when the field has no error', () => {
    expect(getFieldError(errors, 'teacherName')).toBeUndefined();
  });
});
