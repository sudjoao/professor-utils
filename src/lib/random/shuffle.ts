/** A number in [0, 1), like `Math.random`; tests pass a seeded one to get fixed results. */
export type RandomSource = () => number;

/** A shuffled copy (Fisher–Yates): every order is equally likely. */
export const shuffle = <T>(items: T[], random: RandomSource = Math.random): T[] => {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }

  return result;
};

/** Small seeded generator (mulberry32), for tests and repeatable results. */
export const createSeededRandom = (seed: number): RandomSource => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};
