/**
 * What each of the six core numbers is, in plain language, and how it is calculated.
 * Used by the calculator, the results dashboard, the PDF and the education page.
 */

import type { CoreNumberKey } from '../lib/numerology/calculate';

export interface PositionInfo {
  key: CoreNumberKey;
  name: string;
  /** Alternative names readers may know. */
  alsoKnownAs?: string;
  /** One-line summary for cards. */
  short: string;
  /** What this number describes. */
  description: string;
  /** Plain-language explanation of the method. */
  method: string;
  /** Which input it comes from. */
  source: 'date' | 'name' | 'date + year';
}

export const POSITIONS: Record<CoreNumberKey, PositionInfo> = {
  lifePath: {
    key: 'lifePath',
    name: 'Life Path',
    short: 'The road you travel',
    description:
      'Considered the most important number in a chart. Drawn from your full date of birth, it describes the broad themes, lessons and opportunities of your life’s journey.',
    method:
      'Reduce the month, the day and the year of birth to single digits separately (keeping master numbers 11, 22 and 33), add the three results, then reduce once more.',
    source: 'date',
  },
  expression: {
    key: 'expression',
    name: 'Expression',
    alsoKnownAs: 'Destiny number',
    short: 'Your natural talents',
    description:
      'Drawn from every letter of your full birth name, the Expression number describes your natural abilities and the way you tend to engage with the world — the tools you were given for your journey.',
    method:
      'Convert every letter of your full birth name to a number using the Pythagorean chart (A=1 … I=9, J=1 …). Reduce each name separately, add the results, then reduce again.',
    source: 'name',
  },
  soulUrge: {
    key: 'soulUrge',
    name: 'Soul Urge',
    alsoKnownAs: 'Heart’s Desire',
    short: 'What your heart longs for',
    description:
      'Drawn from the vowels of your name, the Soul Urge speaks to your inner motivations — what you truly want, and what makes you feel fulfilled.',
    method:
      'Add the values of the vowels (A, E, I, O, U, and Y when it sounds like a vowel) in each name, reduce each name, add the results and reduce again.',
    source: 'name',
  },
  personality: {
    key: 'personality',
    name: 'Personality',
    short: 'How others first see you',
    description:
      'Drawn from the consonants of your name, the Personality number describes the side of yourself you show first — the impression you make before people know you well.',
    method:
      'Add the values of the consonants in each name, reduce each name, add the results and reduce again.',
    source: 'name',
  },
  birthday: {
    key: 'birthday',
    name: 'Birthday',
    short: 'A special gift',
    description:
      'Drawn from the day of the month you were born, the Birthday number is said to reveal a particular talent or gift that supports your Life Path.',
    method:
      'Take the day of the month you were born and reduce it to a single digit — except 11, 22 and 29 (which reduces to 11), traditionally kept as master numbers.',
    source: 'date',
  },
  personalYear: {
    key: 'personalYear',
    name: 'Personal Year',
    short: 'The theme of your year',
    description:
      'Personal Years move in a nine-year cycle. Your Personal Year describes the general energy and focus of a calendar year (January to December) for you.',
    method:
      'Add your reduced birth month, your reduced birth day and the reduced calendar year, then reduce to a number from 1 to 9.',
    source: 'date + year',
  },
};

/** The order numbers are presented in throughout the site. */
export const POSITION_ORDER: CoreNumberKey[] = [
  'lifePath',
  'expression',
  'soulUrge',
  'personality',
  'birthday',
  'personalYear',
];
