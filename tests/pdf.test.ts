import { describe, expect, it } from 'vitest';
import { buildReport, clean } from '../src/lib/report/pdf';
import { calculateChart } from '../src/lib/numerology/calculate';
import { buildProfile } from '../src/lib/numerology/profile';

describe('PDF report', () => {
  it('cleans characters the built-in fonts cannot draw', () => {
    expect(clean('28 → 10 → 1')).toBe('28 > 10 > 1');
    expect(clean('Dīpikā ✦')).toBe('Dipika *');
    expect(clean('Café – “quoted”')).toBe('Café – “quoted”');
  });
  it('builds a multi-page report', () => {
    const chart = calculateChart('Asha Priya Mehta', { year: 1992, month: 3, day: 14 }, { year: 2026 });
    const doc = buildReport(chart, buildProfile(chart));
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(8);
    const bytes = doc.output('arraybuffer');
    expect(bytes.byteLength).toBeGreaterThan(10_000);
  });
  it('works for master numbers and long names', () => {
    const chart = calculateChart('Maximiliana Alexandrina Wolfeschlegelsteinhausen Bergerdorff', { year: 2009, month: 11, day: 11 }, { year: 2027 });
    expect(() => buildReport(chart, buildProfile(chart))).not.toThrow();
  });
});
