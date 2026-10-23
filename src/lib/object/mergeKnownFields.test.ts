import { describe, expect, it } from 'vitest';

import { mergeKnownFields } from '@/lib/object/mergeKnownFields';

const defaults = {
  name: '',
  term: 1,
  sorted: true,
  tags: [] as string[],
  image: null as string | null,
};

describe('mergeKnownFields', () => {
  it('takes the known fields with the right type', () => {
    expect(
      mergeKnownFields(defaults, { name: '7º A', term: 2, sorted: false, tags: ['a'], image: 'x' }),
    ).toEqual({ name: '7º A', term: 2, sorted: false, tags: ['a'], image: 'x' });
  });

  it('ignores unknown fields and fields with another type', () => {
    expect(mergeKnownFields(defaults, { name: 7, term: '2', tags: 'a', extra: true })).toEqual(
      defaults,
    );
  });

  it('returns the defaults for anything that is not an object', () => {
    expect(mergeKnownFields(defaults, null)).toEqual(defaults);
    expect(mergeKnownFields(defaults, 'text')).toEqual(defaults);
  });
});
