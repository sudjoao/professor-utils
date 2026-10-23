import { type RandomSource, shuffle } from '@/lib/random/shuffle';

/**
 * Picks one student. Without repeating, only those not drawn yet can come out; when all of
 * them were drawn, a new round starts.
 */
export const drawStudent = (
  present: string[],
  alreadyDrawn: string[],
  random: RandomSource = Math.random,
): { name: string; drawn: string[] } | null => {
  if (present.length === 0) {
    return null;
  }

  const remaining = present.filter((name) => !alreadyDrawn.includes(name));
  const pool = remaining.length > 0 ? remaining : present;
  const name = pool[Math.floor(random() * pool.length)];

  return { name, drawn: remaining.length > 0 ? [...alreadyDrawn, name] : [name] };
};

export type GroupingMode = 'groupCount' | 'groupSize';

/**
 * Splits the students in balanced groups (sizes differ by at most one), in random order.
 * By size, a last small group is spread over the others instead of staying alone.
 */
export const makeGroups = (
  names: string[],
  { mode, value }: { mode: GroupingMode; value: number },
  random: RandomSource = Math.random,
): string[][] => {
  if (names.length === 0 || value < 1) {
    return [];
  }

  const groupCount =
    mode === 'groupCount'
      ? Math.min(value, names.length)
      : Math.max(Math.floor(names.length / value), 1);
  const groups: string[][] = Array.from({ length: groupCount }, () => []);

  shuffle(names, random).forEach((name, index) => groups[index % groupCount].push(name));
  return groups;
};

/** Plain text of the groups, ready to paste in a message or a document. */
export const formatGroupsText = (groups: string[][]): string =>
  groups.map((group, index) => `Grupo ${index + 1}: ${group.join(', ')}`).join('\n');
