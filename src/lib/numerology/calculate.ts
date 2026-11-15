/**
 * The six core numbers of a Pythagorean numerology chart.
 *
 * All methods follow the widely published "reduce each part first" approach
 * (as taught by e.g. Hans Decoz and Matthew Oliver Goodwin): every component —
 * month, day and year, or each individual name — is reduced on its own
 * (keeping master numbers), and only then are the components added together
 * and reduced again. Reducing components separately is what lets master
 * numbers that are "hidden" inside a date or name surface correctly.
 *
 * ┌──────────────────┬─────────────────────────────────────────────────────────┐
 * │ Life Path        │ reduce(month) + reduce(day) + reduce(year) → reduce     │
 * │ Birthday         │ day of the month → reduce                               │
 * │ Expression       │ Σ reduce(all letters of each name) → reduce             │
 * │ Soul Urge        │ Σ reduce(vowels of each name) → reduce                  │
 * │ Personality      │ Σ reduce(consonants of each name) → reduce              │
 * │ Personal Year    │ reduce(month) + reduce(day) + reduce(chosen year)       │
 * │                  │   → reduce to 1–9 (11 & 22 noted as a master undertone) │
 * └──────────────────┴─────────────────────────────────────────────────────────┘
 *
 * "reduce" = add digits until 1–9, stopping at the master numbers 11, 22, 33
 * (see reduce.ts). Personal Year cycles run 1 → 9, so the final Personal Year
 * is always 1–9; when its total passes through 11 or 22 that is reported as a
 * master undertone (e.g. "11/2").
 *
 * Example — Life Path for 18 November 1979:
 *   month 11 (master, kept) + day 18 → 9 + year 1979 → 26 → 8
 *   = 11 + 9 + 8 = 28 → 10 → 1
 */

import { formatChain, reduce, type Reduction } from './reduce';
import { parseName, type NamePart, type YRule } from './letters';

export interface BirthDate {
  year: number;
  /** 1–12 */
  month: number;
  /** 1–31 */
  day: number;
}

export type CoreNumberKey =
  | 'lifePath'
  | 'birthday'
  | 'expression'
  | 'soulUrge'
  | 'personality'
  | 'personalYear';

/** One line of the visible working, e.g. { label: "Year", detail: "1 + 9 + 7 + 9 = 26 → 8", result: 8 } */
export interface WorkingLine {
  label: string;
  detail: string;
  result: number;
}

export interface CoreNumber {
  key: CoreNumberKey;
  /** The final number: 1–9, 11, 22 or 33. */
  value: number;
  isMaster: boolean;
  /** The total before the final reduction, e.g. 28 for a Life Path of 1 (shown as "28/1"). */
  compound: number;
  /** Full reduction chain of the final total, e.g. [28, 10, 1]. */
  chain: number[];
  /** Step-by-step working, so every result can be checked by hand. */
  working: WorkingLine[];
  /** Personal Year only: 11 or 22 if the total passed through a master number. */
  masterUndertone?: number;
  /** Optional explanatory note about the method (e.g. where another method differs). */
  note?: string;
}

export interface NumerologyChart {
  input: { fullName: string; birthDate: BirthDate; year: number; yRule: YRule };
  nameParts: NamePart[];
  lifePath: CoreNumber;
  birthday: CoreNumber;
  expression: CoreNumber;
  soulUrge: CoreNumber;
  personality: CoreNumber;
  personalYear: CoreNumber;
  /** How many times each digit 1–9 appears in the full name (the "inclusion" table). */
  inclusion: Record<number, number>;
  /** Digits 1–9 absent from the name — traditionally called karmic lessons. */
  missingNumbers: number[];
  /** The calendar year's twelve Personal Months. */
  personalMonths: { month: number; value: number }[];
}

/* ─────────────────────────────── helpers ─────────────────────────────── */

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** "1 + 9 + 7 + 9 = 26 → 8" (or just "8" when nothing needed adding). */
function describe(addends: number[], reduction: Reduction): string {
  const total = reduction.chain[0];
  const tail = reduction.chain.length > 1 ? ` → ${formatChain(reduction.chain.slice(1))}` : '';
  if (addends.length <= 1) return `${formatChain(reduction.chain)}`;
  return `${addends.join(' + ')} = ${total}${tail}`;
}

function digitsOf(n: number): number[] {
  return String(n).split('').map(Number);
}

/**
 * Reduce one date component (month, day or year) and describe the working.
 *   9    → 9                         "9"
 *   11   → 11 (master, kept)         "11 (master number, kept)"
 *   29   → 2 + 9 = 11 (master)       "2 + 9 = 11"
 *   1979 → 1 + 9 + 7 + 9 = 26 → 8    "1 + 9 + 7 + 9 = 26 → 8"
 */
function reduceDigits(n: number): { value: number; detail: string } {
  if (n <= 9) return { value: n, detail: String(n) };
  const direct = reduce(n);
  if (direct.isMaster && direct.chain.length === 1) {
    return { value: n, detail: `${n} (master number, kept)` };
  }
  const digits = digitsOf(n);
  const reduction = reduce(sum(digits));
  return { value: reduction.value, detail: describe(digits, reduction) };
}

function core(
  key: CoreNumberKey,
  parts: number[],
  working: WorkingLine[],
  totalLabel = 'Total',
): CoreNumber {
  const total = sum(parts);
  const reduction = reduce(total);
  working.push({ label: totalLabel, detail: describe(parts, reduction), result: reduction.value });
  return {
    key,
    value: reduction.value,
    isMaster: reduction.isMaster,
    compound: total,
    chain: reduction.chain,
    working,
  };
}

/* ─────────────────────────── date-based numbers ─────────────────────────── */

/** Life Path: reduce month, day and year separately, then add and reduce. */
export function lifePathNumber(date: BirthDate): CoreNumber {
  const m = reduceDigits(date.month);
  const d = reduceDigits(date.day);
  const y = reduceDigits(date.year);
  const result = core(
    'lifePath',
    [m.value, d.value, y.value],
    [
      { label: 'Month', detail: m.detail, result: m.value },
      { label: 'Day', detail: d.detail, result: d.value },
      { label: 'Year', detail: y.detail, result: y.value },
    ],
  );

  // Transparency: some numerologists add every digit of the date at once.
  // When that gives a different answer, say so rather than hide it.
  const allDigits = [date.month, date.day, date.year].flatMap(digitsOf);
  const alternative = reduce(sum(allDigits));
  if (alternative.value !== result.value) {
    result.note =
      `Adding every digit of the date at once gives ${formatChain(alternative.chain)}. ` +
      `This reading reduces the month, day and year separately first — the more widely taught ` +
      `method — which gives ${result.value}.`;
  }
  return result;
}

/** Birthday: the day of the month, reduced (days 11, 22 and 29 → 11 stay master numbers). */
export function birthdayNumber(date: BirthDate): CoreNumber {
  const digits = digitsOf(date.day);
  const reduction = reduce(date.day);
  return {
    key: 'birthday',
    value: reduction.value,
    isMaster: reduction.isMaster,
    compound: date.day,
    chain: reduction.chain,
    working: [
      {
        label: 'Day of birth',
        detail: reduction.chain.length > 1 ? describe(digits, reduce(sum(digits))) : String(date.day),
        result: reduction.value,
      },
    ],
  };
}

/**
 * Personal Year for a given calendar year (runs January → December):
 * reduce(birth month) + reduce(birth day) + reduce(year), reduced to 1–9.
 */
export function personalYearNumber(date: BirthDate, year: number): CoreNumber {
  const m = reduceDigits(date.month);
  const d = reduceDigits(date.day);
  const y = reduceDigits(year);
  const parts = [m.value, d.value, y.value];
  const total = sum(parts);
  const reduction = reduce(total, { keepMasters: [] });
  const undertone = reduction.chain.find((n) => n === 11 || n === 22);
  return {
    key: 'personalYear',
    value: reduction.value,
    isMaster: false,
    compound: total,
    chain: reduction.chain,
    masterUndertone: undertone,
    working: [
      { label: 'Birth month', detail: m.detail, result: m.value },
      { label: 'Birth day', detail: d.detail, result: d.value },
      { label: `Year ${year}`, detail: y.detail, result: y.value },
      { label: 'Total', detail: describe(parts, reduction), result: reduction.value },
    ],
  };
}

/** Personal Month = Personal Year + calendar month (reduced), reduced to 1–9. */
export function personalMonthNumber(personalYear: number, calendarMonth: number): number {
  const month = reduce(calendarMonth, { keepMasters: [] }).value;
  return reduce(personalYear + month, { keepMasters: [] }).value;
}

/* ─────────────────────────── name-based numbers ─────────────────────────── */

type LetterFilter = 'all' | 'vowels' | 'consonants';

function nameNumber(
  key: CoreNumberKey,
  nameParts: NamePart[],
  filter: LetterFilter,
): CoreNumber {
  const working: WorkingLine[] = [];
  const partValues = nameParts.map((part) => {
    const letters = part.letters.filter((l) =>
      filter === 'all' ? true : filter === 'vowels' ? l.isVowel : !l.isVowel,
    );
    const values = letters.map((l) => l.value);
    const reduction = reduce(sum(values));
    const shown = letters.map((l) => `${l.char}${l.value}`).join(' ');
    working.push({
      label: part.text,
      detail: values.length
        ? `${shown}  ·  ${values.length > 1 ? describe(values, reduction) : formatChain(reduction.chain)}`
        : filter === 'vowels'
          ? 'no vowels'
          : 'no consonants',
      result: reduction.value,
    });
    return reduction.value;
  });
  return core(key, partValues, working);
}

/** Expression (Destiny): every letter of the full birth name. */
export const expressionNumber = (parts: NamePart[]) => nameNumber('expression', parts, 'all');
/** Soul Urge (Heart's Desire): the vowels of the full birth name. */
export const soulUrgeNumber = (parts: NamePart[]) => nameNumber('soulUrge', parts, 'vowels');
/** Personality: the consonants of the full birth name. */
export const personalityNumber = (parts: NamePart[]) => nameNumber('personality', parts, 'consonants');

/* ──────────────────────────────── chart ──────────────────────────────── */

export interface ChartOptions {
  /** Calendar year for the Personal Year (defaults to the current year). */
  year?: number;
  yRule?: YRule;
}

/**
 * Calculate a complete chart. Throws if the name cannot be scored — validate
 * input first with `validateReadingInput` (validation.ts).
 */
export function calculateChart(
  fullName: string,
  birthDate: BirthDate,
  options: ChartOptions = {},
): NumerologyChart {
  const year = options.year ?? new Date().getFullYear();
  const yRule = options.yRule ?? 'auto';
  const nameParts = parseName(fullName, yRule);
  if (!nameParts || nameParts.length === 0) {
    throw new Error('The name must contain Latin letters only.');
  }

  const inclusion: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const part of nameParts) for (const l of part.letters) inclusion[l.value]++;
  const missingNumbers = Object.entries(inclusion)
    .filter(([, count]) => count === 0)
    .map(([digit]) => Number(digit));

  const personalYear = personalYearNumber(birthDate, year);

  return {
    input: { fullName: fullName.trim().replace(/\s+/g, ' '), birthDate, year, yRule },
    nameParts,
    lifePath: lifePathNumber(birthDate),
    birthday: birthdayNumber(birthDate),
    expression: expressionNumber(nameParts),
    soulUrge: soulUrgeNumber(nameParts),
    personality: personalityNumber(nameParts),
    personalYear,
    inclusion,
    missingNumbers,
    personalMonths: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      value: personalMonthNumber(personalYear.value, i + 1),
    })),
  };
}

/** Display form used across the site: 11 → "11/2", 28-total Life Path 1 → "1". */
export function displayValue(n: CoreNumber): string {
  if (n.isMaster) return `${n.value}/${reduce(n.value, { keepMasters: [] }).value}`;
  if (n.masterUndertone) return `${n.masterUndertone}/${n.value}`;
  return String(n.value);
}
