import { describe, expect, it } from 'vitest';
import { digitSum, reduce, rootDigit } from '../src/lib/numerology/reduce';
import { normaliseName, parseName, PYTHAGOREAN } from '../src/lib/numerology/letters';
import {
  birthdayNumber,
  calculateChart,
  displayValue,
  expressionNumber,
  lifePathNumber,
  personalityNumber,
  personalMonthNumber,
  personalYearNumber,
  soulUrgeNumber,
} from '../src/lib/numerology/calculate';
import { validateBirthDate, validateName } from '../src/lib/numerology/validation';

const parts = (name: string, y?: 'auto' | 'vowel' | 'consonant') => parseName(name, y)!;

describe('reduce', () => {
  it('sums digits', () => {
    expect(digitSum(1979)).toBe(26);
    expect(digitSum(0)).toBe(0);
  });
  it('reduces to a single digit', () => {
    expect(reduce(1979).chain).toEqual([1979, 26, 8]);
    expect(reduce(28).chain).toEqual([28, 10, 1]);
    expect(reduce(7).value).toBe(7);
  });
  it('stops at master numbers 11, 22 and 33', () => {
    expect(reduce(29)).toMatchObject({ value: 11, isMaster: true, chain: [29, 11] });
    expect(reduce(22)).toMatchObject({ value: 22, isMaster: true });
    expect(reduce(33)).toMatchObject({ value: 33, isMaster: true });
    expect(reduce(44).value).toBe(8); // 44 is not a master number
  });
  it('can ignore master numbers', () => {
    expect(reduce(29, { keepMasters: [] }).value).toBe(2);
    expect(rootDigit(33)).toBe(6);
  });
  it('rejects invalid input', () => {
    expect(() => reduce(-1)).toThrow();
    expect(() => reduce(1.5)).toThrow();
  });
});

describe('Pythagorean letters', () => {
  it('uses the standard chart', () => {
    expect(PYTHAGOREAN.A).toBe(1);
    expect(PYTHAGOREAN.I).toBe(9);
    expect(PYTHAGOREAN.J).toBe(1);
    expect(PYTHAGOREAN.R).toBe(9);
    expect(PYTHAGOREAN.S).toBe(1);
    expect(PYTHAGOREAN.Z).toBe(8);
  });
  it('normalises accents, apostrophes and hyphens', () => {
    expect(normaliseName("Dīpikā O'Brien-Shah")).toEqual(['DIPIKA', 'OBRIEN', 'SHAH']);
    expect(normaliseName('  José   Müller ')).toEqual(['JOSE', 'MULLER']);
    expect(normaliseName('Straße')).toEqual(['STRASSE']);
  });
  it('rejects names that cannot be scored', () => {
    expect(normaliseName('दीपिका')).toBeNull();
    expect(normaliseName('R2D2')).toBeNull();
  });
  it('treats Y as a consonant before a vowel, otherwise a vowel (auto)', () => {
    const vowelsOf = (n: string) =>
      parts(n)[0].letters.filter((l) => l.isVowel).map((l) => l.char).join('');
    expect(vowelsOf('Mary')).toBe('AY');
    expect(vowelsOf('Lynn')).toBe('Y');
    expect(vowelsOf('Yolanda')).toBe('OAA');
    expect(vowelsOf('Priya')).toBe('IA');
    expect(vowelsOf('Vijay')).toBe('IAY');
  });
  it('honours the Y override', () => {
    expect(parts('Priya', 'vowel')[0].letters[3].isVowel).toBe(true);
    expect(parts('Mary', 'consonant')[0].letters[3].isVowel).toBe(false);
  });
});

describe('Life Path', () => {
  it('matches the published example: 18 November 1979 → 1', () => {
    const lp = lifePathNumber({ year: 1979, month: 11, day: 18 });
    // month 11 (kept) + day 9 + year 8 = 28 → 10 → 1
    expect(lp.working.map((w) => w.result)).toEqual([11, 9, 8, 1]);
    expect(lp.value).toBe(1);
    expect(lp.compound).toBe(28);
  });
  it('produces master Life Path 11', () => {
    const lp = lifePathNumber({ year: 1971, month: 1, day: 1 }); // 1 + 1 + 9
    expect(lp).toMatchObject({ value: 11, isMaster: true });
  });
  it('produces master Life Path 22', () => {
    expect(lifePathNumber({ year: 2000, month: 11, day: 9 }).value).toBe(22); // 11 + 9 + 2
  });
  it('produces master Life Path 33', () => {
    expect(lifePathNumber({ year: 2009, month: 11, day: 11 }).value).toBe(33); // 11 + 11 + 11
  });
  it('keeps a master day inside the calculation (29 → 11)', () => {
    const lp = lifePathNumber({ year: 2000, month: 2, day: 29 }); // 2 + 11 + 2 = 15 → 6
    expect(lp.working[1]).toMatchObject({ result: 11, detail: '2 + 9 = 11' });
    expect(lp.value).toBe(6);
  });
  it('reduces each component separately, noting when the all-digits method differs', () => {
    // 4 August 1961: 8 + 4 + (1961 → 17 → 8) = 20 → 2
    // (adding every digit at once instead gives 8+4+1+9+6+1 = 29 → 11)
    const lp = lifePathNumber({ year: 1961, month: 8, day: 4 });
    expect(lp.value).toBe(2);
    expect(lp.note).toMatch(/29 → 11/);
  });
  it('adds no note when both methods agree', () => {
    expect(lifePathNumber({ year: 1979, month: 11, day: 18 }).note).toBeUndefined();
  });
});

describe('Birthday', () => {
  it.each([
    [7, 7],
    [19, 1],
    [31, 4],
    [11, 11],
    [22, 22],
    [29, 11],
  ])('day %i → %i', (day, expected) => {
    expect(birthdayNumber({ year: 1990, month: 1, day }).value).toBe(expected);
  });
});

describe('Name numbers — John Smith', () => {
  const p = parts('John Smith');
  it('Expression: JOHN 20 → 2, SMITH 24 → 6, total 8', () => {
    const e = expressionNumber(p);
    expect(e.working.map((w) => w.result)).toEqual([2, 6, 8]);
    expect(e.value).toBe(8);
  });
  it('Soul Urge: O 6 + I 9 = 15 → 6', () => {
    expect(soulUrgeNumber(p).value).toBe(6);
  });
  it('Personality: JHN 14 → 5, SMTH 15 → 6, total 11 (master)', () => {
    expect(personalityNumber(p)).toMatchObject({ value: 11, isMaster: true });
  });
});

describe('Name numbers — other examples', () => {
  it('Mary Lynn: Expression 5, Soul Urge 6, Personality 8', () => {
    const p = parts('Mary Lynn');
    expect(expressionNumber(p).value).toBe(5);
    expect(soulUrgeNumber(p).value).toBe(6);
    expect(personalityNumber(p).value).toBe(8);
  });
  it('Priya: Expression master 33 (7+9+9+7+1)', () => {
    expect(expressionNumber(parts('Priya'))).toMatchObject({ value: 33, isMaster: true });
  });
  it('Dīpikā is scored as DIPIKA = 32 → 5', () => {
    expect(expressionNumber(parts('Dīpikā')).value).toBe(5);
  });
  it('handles a name part with no vowels', () => {
    const su = soulUrgeNumber(parts('Anna Brt'));
    expect(su.working[1].detail).toBe('no vowels');
    expect(su.value).toBe(2);
  });
});

describe('Personal Year and Month', () => {
  const birth = { year: 1979, month: 11, day: 18 };
  it('2026: 11 + 9 + (2026 → 10 → 1) = 21 → 3', () => {
    const py = personalYearNumber(birth, 2026);
    expect(py.value).toBe(3);
    expect(py.masterUndertone).toBeUndefined();
  });
  it('2025: 11 + 9 + 9 = 29 → 11 → 2, with master undertone 11', () => {
    const py = personalYearNumber(birth, 2025);
    expect(py.value).toBe(2);
    expect(py.masterUndertone).toBe(11);
    expect(displayValue(py)).toBe('11/2');
  });
  it('always stays within 1–9', () => {
    for (let year = 1990; year <= 2100; year++) {
      const v = personalYearNumber({ year: 1985, month: 7, day: 29 }, year).value;
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(9);
    }
  });
  it('advances by one each year (9-year cycle)', () => {
    const a = personalYearNumber(birth, 2026).value;
    const b = personalYearNumber(birth, 2027).value;
    expect(b).toBe((a % 9) + 1);
  });
  it('Personal Month = Personal Year + month', () => {
    expect(personalMonthNumber(3, 1)).toBe(4);
    expect(personalMonthNumber(3, 11)).toBe(5); // November → 2
    expect(personalMonthNumber(9, 9)).toBe(9);
  });
});

describe('calculateChart', () => {
  const chart = calculateChart('John Smith', { year: 1979, month: 11, day: 18 }, { year: 2026 });
  it('returns all six core numbers', () => {
    expect({
      lifePath: chart.lifePath.value,
      birthday: chart.birthday.value,
      expression: chart.expression.value,
      soulUrge: chart.soulUrge.value,
      personality: chart.personality.value,
      personalYear: chart.personalYear.value,
    }).toEqual({ lifePath: 1, birthday: 9, expression: 8, soulUrge: 6, personality: 11, personalYear: 3 });
  });
  it('is deterministic', () => {
    const again = calculateChart('John Smith', { year: 1979, month: 11, day: 18 }, { year: 2026 });
    expect(again).toEqual(chart);
  });
  it('counts letters for the inclusion table', () => {
    // J1 O6 H8 N5 S1 M4 I9 T2 H8
    expect(chart.inclusion).toEqual({ 1: 2, 2: 1, 3: 0, 4: 1, 5: 1, 6: 1, 7: 0, 8: 2, 9: 1 });
    expect(chart.missingNumbers).toEqual([3, 7]);
  });
  it('lists twelve personal months', () => {
    expect(chart.personalMonths).toHaveLength(12);
    expect(chart.personalMonths[0]).toEqual({ month: 1, value: 4 });
  });
  it('displays master numbers with their root', () => {
    expect(displayValue(chart.personality)).toBe('11/2');
    expect(displayValue(chart.lifePath)).toBe('1');
  });
});

describe('validation', () => {
  const today = new Date(2026, 10, 15);
  it('accepts valid names', () => {
    expect(validateName('  Dipika   Sharma ')).toEqual({ ok: true, value: 'Dipika Sharma' });
  });
  it('rejects bad names', () => {
    expect(validateName('').ok).toBe(false);
    expect(validateName('A').ok).toBe(false);
    expect(validateName('Agent 47').ok).toBe(false);
    expect(validateName('दीपिका').error).toMatch(/Latin/);
    expect(validateName('x'.repeat(200)).ok).toBe(false);
  });
  it('accepts valid dates', () => {
    expect(validateBirthDate('29', '2', '2024', today)).toEqual({
      ok: true,
      value: { year: 2024, month: 2, day: 29 },
    });
    expect(validateBirthDate(15, 11, 2026, today).ok).toBe(true); // today
  });
  it('rejects impossible or future dates', () => {
    expect(validateBirthDate('29', '2', '2023', today).ok).toBe(false);
    expect(validateBirthDate('31', '4', '1990', today).ok).toBe(false);
    expect(validateBirthDate('1', '13', '1990', today).ok).toBe(false);
    expect(validateBirthDate('16', '11', '2026', today).ok).toBe(false);
    expect(validateBirthDate('1', '1', '1899', today).ok).toBe(false);
    expect(validateBirthDate('', '1', '1990', today).ok).toBe(false);
  });
});

import { buildProfile, familyOf } from '../src/lib/numerology/profile';
import { NUMBER_MEANINGS, ALL_NUMBERS } from '../src/data/numbers';
import { PERSONAL_YEARS } from '../src/data/cycles';

describe('interpretation data', () => {
  it('has a complete meaning for every possible number', () => {
    for (const n of ALL_NUMBERS) {
      const m = NUMBER_MEANINGS[n];
      expect(m.number).toBe(n);
      expect(m.strengths.length).toBeGreaterThan(2);
      expect(m.challenges.length).toBeGreaterThan(2);
      expect(m.growth.length).toBeGreaterThan(1);
      for (const text of [m.essence, m.traits, m.relationships, m.career, ...Object.values(m.positions)]) {
        expect(text.length).toBeGreaterThan(40);
      }
    }
  });
  it('has a meaning for every Personal Year 1–9', () => {
    for (let n = 1; n <= 9; n++) expect(PERSONAL_YEARS[n].reflections.length).toBeGreaterThan(0);
  });
});

describe('profile', () => {
  it('groups numbers into families by root', () => {
    expect(familyOf(7)).toBe('mind');
    expect(familyOf(11)).toBe('structure');
    expect(familyOf(33)).toBe('heart');
  });
  it('builds a deterministic overview for John Smith', () => {
    const chart = calculateChart('John Smith', { year: 1979, month: 11, day: 18 }, { year: 2026 });
    const profile = buildProfile(chart);
    expect(profile.headline).toBe('The Pioneer with the gifts of the Achiever');
    expect(profile.insights.map((i) => i.title)).toContain('Master number 11');
    expect(profile.insights.map((i) => i.title)).toContain('Karmic lessons');
    expect(buildProfile(chart)).toEqual(profile);
  });
  it('detects repeated numbers', () => {
    // 1 Jan 1971 → Life Path 11; "Priya" → Expression 33 … use a name/date pair with repeats
    const chart = calculateChart('Anna Anna', { year: 1990, month: 1, day: 2 }, { year: 2026 });
    const titles = buildProfile(chart).insights.map((i) => i.title);
    expect(titles.some((t) => t.startsWith('A strong'))).toBe(true);
  });
  it('never crashes across a wide range of inputs', () => {
    const names = ['Lynn Wu', 'Yolanda Priya Kenya', 'Zoe Q', 'Aaron Xavier Jones', 'Dipikaa'];
    for (const name of names) {
      for (let day = 1; day <= 28; day += 3) {
        for (let month = 1; month <= 12; month++) {
          const chart = calculateChart(name, { year: 1950 + day + month, month, day }, { year: 2026 });
          expect(buildProfile(chart).summary).toHaveLength(3);
        }
      }
    }
  });
});
