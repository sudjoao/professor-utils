import { describe, expect, it } from 'vitest';

import { INITIAL_CLASS_FORM_VALUES } from '@/features/classroom/services/classForm';
import { INITIAL_LABELS_VALUES } from '@/features/labels/constants';
import { validateLabelsForm } from '@/features/labels/services/validateLabelsForm';

const values = { ...INITIAL_CLASS_FORM_VALUES, ...INITIAL_LABELS_VALUES, studentsText: 'Ana' };

describe('validateLabelsForm', () => {
  it('accepts a complete form', () => {
    expect(validateLabelsForm(values)).toEqual([]);
  });

  it('keeps the first label inside the sheet', () => {
    expect(validateLabelsForm({ ...values, startAt: 22 }).map(({ field }) => field)).toEqual([
      'startAt',
    ]);
  });

  it('needs students and a valid number of copies', () => {
    const errors = validateLabelsForm({ ...values, studentsText: '', copiesPerStudent: 0 });
    expect(errors.map(({ field }) => field)).toEqual(['studentsText', 'copiesPerStudent']);
  });
});
