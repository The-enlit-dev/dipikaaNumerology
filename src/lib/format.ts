import { MONTH_NAMES } from '../data/cycles';
import type { BirthDate } from './numerology/calculate';

export function formatBirthDate(d: BirthDate): string {
  return `${d.day} ${MONTH_NAMES[d.month - 1]} ${d.year}`;
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

/** "11/2" for master numbers, otherwise the plain number. */
export function masterLabel(value: number): string {
  return value === 11 ? '11/2' : value === 22 ? '22/4' : value === 33 ? '33/6' : String(value);
}

/** Possessive form for headings: "Asha's", "James'". */
export function possessive(name: string): string {
  return /s$/i.test(name) ? `${name}’` : `${name}’s`;
}
