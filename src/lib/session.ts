/**
 * Session memory for readings.
 *
 * Privacy by design:
 *  • Only the inputs (name, date of birth, options) are kept — never sent anywhere.
 *  • They live in sessionStorage, which the browser deletes when the tab or
 *    window is closed. Nothing is written to cookies, localStorage or a server.
 *  • At most MAX_READINGS are kept, and visitors can clear them at any time.
 */

import type { BirthDate } from './numerology/calculate';
import type { YRule } from './numerology/letters';

export interface SavedReading {
  id: string;
  fullName: string;
  birthDate: BirthDate;
  yRule: YRule;
  year: number;
  savedAt: number;
}

const KEY = 'dipikaa.readings.v1';
const PENDING_KEY = 'dipikaa.pending.v1';
export const MAX_READINGS = 5;

function storage(): Storage | null {
  try {
    const s = window.sessionStorage;
    const probe = '__dipikaa__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

export function readingId(r: Pick<SavedReading, 'fullName' | 'birthDate'>): string {
  const { year, month, day } = r.birthDate;
  return `${r.fullName.toLowerCase().replace(/\s+/g, ' ').trim()}|${year}-${month}-${day}`;
}

export function loadReadings(): SavedReading[] {
  const s = storage();
  if (!s) return [];
  try {
    const parsed = JSON.parse(s.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? (parsed as SavedReading[]).filter(isValid) : [];
  } catch {
    return [];
  }
}

export function saveReading(reading: Omit<SavedReading, 'id' | 'savedAt'>): SavedReading[] {
  const entry: SavedReading = { ...reading, id: readingId(reading), savedAt: Date.now() };
  const next = [entry, ...loadReadings().filter((r) => r.id !== entry.id)].slice(0, MAX_READINGS);
  try {
    storage()?.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked — the reading still works, it just isn't remembered */
  }
  return next;
}

export function removeReading(id: string): SavedReading[] {
  const next = loadReadings().filter((r) => r.id !== id);
  try {
    storage()?.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function clearReadings(): void {
  try {
    storage()?.removeItem(KEY);
    storage()?.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}

/** Used by the quick form on the home page to hand details to the calculator page. */
export function setPending(reading: Omit<SavedReading, 'id' | 'savedAt'>): boolean {
  try {
    const s = storage();
    if (!s) return false;
    s.setItem(PENDING_KEY, JSON.stringify(reading));
    return true;
  } catch {
    return false;
  }
}

export function takePending(): Omit<SavedReading, 'id' | 'savedAt'> | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(PENDING_KEY);
    s.removeItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValid({ ...parsed, id: 'x', savedAt: 0 }) ? parsed : null;
  } catch {
    return null;
  }
}

function isValid(r: unknown): r is SavedReading {
  if (!r || typeof r !== 'object') return false;
  const x = r as SavedReading;
  return (
    typeof x.fullName === 'string' &&
    !!x.birthDate &&
    Number.isInteger(x.birthDate.year) &&
    Number.isInteger(x.birthDate.month) &&
    Number.isInteger(x.birthDate.day) &&
    ['auto', 'vowel', 'consonant'].includes(x.yRule) &&
    Number.isInteger(x.year)
  );
}
