import { describe, expect, it } from 'vitest';

import { drawStudent, formatGroupsText, makeGroups } from '@/features/draw/services/draw';
import { createSeededRandom } from '@/lib/random/shuffle';

const names = ['Ana', 'Bruno', 'Carla', 'Davi', 'Érica', 'Fábio', 'Gabi'];

describe('drawStudent', () => {
  it('does not repeat until everyone was drawn, then starts again', () => {
    const random = createSeededRandom(3);
    let drawn: string[] = [];
    const order: string[] = [];

    for (let round = 0; round < 3; round++) {
      const result = drawStudent(['Ana', 'Bruno', 'Carla'], drawn, random);
      order.push(result!.name);
      drawn = result!.drawn;
    }

    expect([...order].sort()).toEqual(['Ana', 'Bruno', 'Carla']);
    expect(drawStudent(['Ana', 'Bruno', 'Carla'], drawn, random)?.drawn).toHaveLength(1);
  });

  it('returns nothing when nobody is present', () => {
    expect(drawStudent([], [])).toBeNull();
  });
});

describe('makeGroups', () => {
  const sizes = (groups: string[][]) => groups.map((group) => group.length);

  it('makes the asked number of balanced groups with every student once', () => {
    const groups = makeGroups(names, { mode: 'groupCount', value: 3 }, createSeededRandom(1));

    expect(sizes(groups)).toEqual([3, 2, 2]);
    expect(groups.flat().sort()).toEqual([...names].sort());
  });

  it('by size, spreads the leftovers instead of leaving someone alone', () => {
    const groups = makeGroups(names, { mode: 'groupSize', value: 3 }, createSeededRandom(1));
    expect(sizes(groups)).toEqual([4, 3]);
  });

  it('never makes more groups than students', () => {
    expect(makeGroups(['Ana', 'Bruno'], { mode: 'groupCount', value: 5 })).toHaveLength(2);
    expect(makeGroups([], { mode: 'groupCount', value: 2 })).toEqual([]);
  });
});

describe('formatGroupsText', () => {
  it('writes one line per group', () => {
    expect(formatGroupsText([['Ana', 'Bruno'], ['Carla']])).toBe(
      'Grupo 1: Ana, Bruno\nGrupo 2: Carla',
    );
  });
});
