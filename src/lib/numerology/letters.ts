/**
 * Letters → numbers (the Pythagorean chart) and name parsing.
 *
 * THE PYTHAGOREAN CHART
 * Each letter of the Latin alphabet is given the value of its position,
 * wrapping around every nine letters:
 *
 *      1  2  3  4  5  6  7  8  9
 *      A  B  C  D  E  F  G  H  I
 *      J  K  L  M  N  O  P  Q  R
 *      S  T  U  V  W  X  Y  Z
 *
 * VOWELS AND THE LETTER Y
 * A, E, I, O and U are always vowels. Y is ambiguous: traditionally it is a
 * vowel when it sounds like one (Lynn, Mary, Vijay) and a consonant when it
 * sounds like the "y" in "yes" (Yolanda, Maya, Priya). This engine applies a
 * simple, transparent rule for the default "auto" mode:
 *
 *     Y is a CONSONANT when it is immediately followed by a vowel (A E I O U);
 *     otherwise Y is a VOWEL.
 *
 * Because no rule fits every name, visitors can override it ("always vowel" /
 * "always consonant"), and the reading shows exactly how each letter was used.
 * W is always treated as a consonant.
 */

export const PYTHAGOREAN: Readonly<Record<string, number>> = Object.freeze(
  Object.fromEntries(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => [letter, (i % 9) + 1]),
  ),
);

export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

export type YRule = 'auto' | 'vowel' | 'consonant';

export interface Letter {
  char: string;
  value: number;
  isVowel: boolean;
}

/** A single name (first, middle, last …) broken into scored letters. */
export interface NamePart {
  /** Uppercase A–Z only, e.g. "OBRIEN" for "O'Brien". */
  text: string;
  letters: Letter[];
}

/** Special letters that do not decompose with Unicode normalisation. */
const SPECIAL_LETTERS: Record<string, string> = {
  ß: 'SS', ẞ: 'SS', Æ: 'AE', æ: 'AE', Œ: 'OE', œ: 'OE', Ø: 'O', ø: 'O',
  Ł: 'L', ł: 'L', Đ: 'D', đ: 'D', Þ: 'TH', þ: 'TH', Ð: 'D', ð: 'D', ı: 'I',
};

/**
 * Convert a name to plain uppercase Latin letters:
 * "Dīpikā O'Brien-Shah" → ["DIPIKA", "OBRIEN", "SHAH"].
 *
 * Accents are removed (é → E), apostrophes and full stops are dropped, and
 * spaces or hyphens separate the name into parts. Returns null if the name
 * contains anything that cannot be scored (digits, symbols, non-Latin scripts).
 */
export function normaliseName(raw: string): string[] | null {
  const replaced = raw.replace(/[ßẞÆæŒœØøŁłĐđÞþÐðı]/g, (c) => SPECIAL_LETTERS[c] ?? c);
  const stripped = replaced
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // combining accents
    .replace(/[’'`´.]/g, '') // apostrophes and initials' full stops
    .toUpperCase();
  const parts = stripped.split(/[\s\-‐–]+/).filter(Boolean);
  if (!parts.every((p) => /^[A-Z]+$/.test(p))) return null;
  return parts;
}

/** Decide whether each letter of a name part counts as a vowel. */
export function scoreNamePart(text: string, yRule: YRule = 'auto'): NamePart {
  const chars = text.split('');
  const letters = chars.map((char, i): Letter => {
    const value = PYTHAGOREAN[char];
    if (value === undefined) throw new Error(`Cannot score character "${char}"`);
    let isVowel = VOWELS.has(char);
    if (char === 'Y') {
      if (yRule === 'vowel') isVowel = true;
      else if (yRule === 'consonant') isVowel = false;
      else {
        const next = chars[i + 1];
        isVowel = !(next !== undefined && VOWELS.has(next));
      }
    }
    return { char, value, isVowel };
  });
  return { text, letters };
}

export function parseName(raw: string, yRule: YRule = 'auto'): NamePart[] | null {
  const parts = normaliseName(raw);
  return parts ? parts.map((p) => scoreNamePart(p, yRule)) : null;
}
