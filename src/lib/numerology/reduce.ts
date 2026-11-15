/**
 * Number reduction — the arithmetic at the heart of numerology.
 *
 * In Pythagorean numerology a multi-digit number is "reduced" by adding its
 * digits together, repeatedly, until a single digit (1–9) remains:
 *
 *     1979 → 1 + 9 + 7 + 9 = 26 → 2 + 6 = 8
 *
 * MASTER NUMBERS
 * 11, 22 and 33 are traditionally treated as "master numbers". When a
 * reduction reaches one of them it stops there instead of continuing
 * (11 would otherwise become 2, 22 → 4, 33 → 6). The reduced form is still
 * shown alongside, e.g. "11/2", because a master number also carries the
 * qualities of its root digit.
 */

export const MASTER_NUMBERS = [11, 22, 33] as const;
export type MasterNumber = (typeof MASTER_NUMBERS)[number];

export function isMasterNumber(n: number): n is MasterNumber {
  return (MASTER_NUMBERS as readonly number[]).includes(n);
}

/** Sum of the decimal digits of a non-negative integer: 1979 → 26. */
export function digitSum(n: number): number {
  assertNonNegativeInteger(n);
  let sum = 0;
  let rest = n;
  while (rest > 0) {
    sum += rest % 10;
    rest = Math.floor(rest / 10);
  }
  return sum;
}

export interface Reduction {
  /** Every value passed through, starting with the input: [1979, 26, 8]. */
  chain: number[];
  /** Final value: 1–9, a master number (if kept), or 0 for an empty input. */
  value: number;
  isMaster: boolean;
}

export interface ReduceOptions {
  /**
   * Which master numbers stop the reduction. Defaults to all three (11, 22, 33).
   * Pass `[]` to always reduce to a single digit.
   */
  keepMasters?: readonly number[];
}

/**
 * Reduce a number to a single digit, stopping at master numbers.
 *
 *   reduce(28)   → chain [28, 10, 1], value 1
 *   reduce(29)   → chain [29, 11],    value 11 (master)
 *   reduce(29, { keepMasters: [] }) → chain [29, 11, 2], value 2
 */
export function reduce(n: number, options: ReduceOptions = {}): Reduction {
  assertNonNegativeInteger(n);
  const keep = options.keepMasters ?? MASTER_NUMBERS;
  const chain = [n];
  let current = n;
  while (current > 9 && !keep.includes(current)) {
    current = digitSum(current);
    chain.push(current);
  }
  return { chain, value: current, isMaster: isMasterNumber(current) && keep.includes(current) };
}

/** "28 → 10 → 1" */
export function formatChain(chain: number[]): string {
  return chain.join(' → ');
}

/** The root digit of any number, ignoring master numbers: 11 → 2, 22 → 4, 33 → 6. */
export function rootDigit(n: number): number {
  return reduce(n, { keepMasters: [] }).value;
}

function assertNonNegativeInteger(n: number): void {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`Expected a non-negative integer, received ${n}`);
  }
}
