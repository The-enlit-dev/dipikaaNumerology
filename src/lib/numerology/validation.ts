/**
 * Input validation for the calculator. Kept separate from the maths so the
 * same rules can be used by the form, by tests and by any future API.
 */

import type { BirthDate } from './calculate';
import { normaliseName } from './letters';

export const MIN_BIRTH_YEAR = 1900;
export const MAX_NAME_LENGTH = 120;

export interface ValidationResult<T> {
  ok: boolean;
  value?: T;
  error?: string;
}

export function validateName(raw: string): ValidationResult<string> {
  const name = raw.trim().replace(/\s+/g, ' ');
  if (!name) return { ok: false, error: 'Please enter your full name.' };
  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, error: `Please keep the name under ${MAX_NAME_LENGTH} characters.` };
  }
  if (/\d/.test(name)) return { ok: false, error: 'Names cannot contain numbers.' };
  const parts = normaliseName(name);
  if (!parts) {
    return {
      ok: false,
      error:
        'Please write your name using the English (Latin) alphabet — for example “Dipika Sharma”. Pythagorean numerology assigns values to the letters A–Z.',
    };
  }
  const letterCount = parts.join('').length;
  if (letterCount < 2) return { ok: false, error: 'Please enter at least two letters.' };
  return { ok: true, value: name };
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Validates a date of birth given as separate day / month / year values
 * (strings straight from form fields are accepted).
 */
export function validateBirthDate(
  dayRaw: string | number,
  monthRaw: string | number,
  yearRaw: string | number,
  today: Date = new Date(),
): ValidationResult<BirthDate> {
  const day = Number(dayRaw);
  const month = Number(monthRaw);
  const year = Number(yearRaw);
  if (dayRaw === '' || monthRaw === '' || yearRaw === '') {
    return { ok: false, error: 'Please enter your complete date of birth.' };
  }
  if (![day, month, year].every(Number.isInteger)) {
    return { ok: false, error: 'Please enter the date of birth using numbers only.' };
  }
  if (month < 1 || month > 12) return { ok: false, error: 'Please choose a month between 1 and 12.' };
  const thisYear = today.getFullYear();
  if (year < MIN_BIRTH_YEAR || year > thisYear) {
    return { ok: false, error: `Please enter a birth year between ${MIN_BIRTH_YEAR} and ${thisYear}.` };
  }
  const maxDay = daysInMonth(year, month);
  if (day < 1 || day > maxDay) {
    return { ok: false, error: `That month only has ${maxDay} days in ${year}. Please check the day.` };
  }
  const birth = new Date(year, month - 1, day);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (birth > startOfToday) return { ok: false, error: 'The date of birth cannot be in the future.' };
  return { ok: true, value: { year, month, day } };
}

/** Parses an ISO "YYYY-MM-DD" string (as produced by <input type="date">). */
export function parseIsoDate(iso: string): { day: string; month: string; year: string } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return { year: m[1], month: String(Number(m[2])), day: String(Number(m[3])) };
}
