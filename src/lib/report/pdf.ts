/**
 * PDF report generation (client-side, with jsPDF).
 *
 * This module is loaded on demand — only when a visitor clicks
 * "Download PDF" — so it never slows down the first page load.
 * The PDF is created entirely in the browser; nothing is uploaded.
 *
 * Built-in PDF fonts (Times + Helvetica) are used so the report stays small
 * and works offline. They support Western European characters, so text is
 * passed through `clean()` which swaps the few symbols they cannot draw.
 */

import { jsPDF } from 'jspdf';
import type { CoreNumber, NumerologyChart } from '../numerology/calculate';
import { displayValue } from '../numerology/calculate';
import type { Profile } from '../numerology/profile';
import { rootDigit } from '../numerology/reduce';
import { NUMBER_MEANINGS, type PositionKey } from '../../data/numbers';
import { KARMIC_LESSONS, MONTH_NAMES, PERSONAL_MONTHS, PERSONAL_YEARS } from '../../data/cycles';
import { POSITIONS, POSITION_ORDER } from '../../data/positions';
import { formatBirthDate, firstName } from '../format';
import { site } from '../../config/site';
import { wheelPoint } from '../geometry';

type RGB = [number, number, number];
const NIGHT: RGB = [10, 15, 44];
const NIGHT_SOFT: RGB = [27, 35, 86];
const GOLD: RGB = [201, 164, 92];
const GOLD_DARK: RGB = [125, 95, 34];
const GOLD_LIGHT: RGB = [234, 216, 173];
const INK: RGB = [26, 23, 48];
const INK_SOFT: RGB = [95, 90, 119];
const CREAM: RGB = [246, 239, 225];
const LINE: RGB = [221, 208, 179];
const PLUM: RGB = [106, 79, 156];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - 22;

/** Replace characters the built-in PDF fonts cannot render. */
export function clean(text: string): string {
  return text
    .replace(/→/g, '>')
    .replace(/[✦★☆]/g, '*')
    .replace(/×/g, 'x')
    .replace(/ /g, ' ')
    .normalize('NFC')
    .replace(/[^\x20-\x7E -ÿ‘’“”–—…•·]/g, (ch) => ch.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7E]/g, ''));
}

class Writer {
  doc: jsPDF;
  y = MARGIN;
  page = 1;
  constructor(private readonly person: string) {
    this.doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  }

  color(c: RGB) {
    this.doc.setTextColor(c[0], c[1], c[2]);
  }
  fill(c: RGB) {
    this.doc.setFillColor(c[0], c[1], c[2]);
  }
  stroke(c: RGB) {
    this.doc.setDrawColor(c[0], c[1], c[2]);
  }
  font(family: 'times' | 'helvetica', style: 'normal' | 'bold' | 'italic' | 'bolditalic', size: number) {
    this.doc.setFont(family, style);
    this.doc.setFontSize(size);
  }

  newPage() {
    this.doc.addPage();
    this.page++;
    this.y = MARGIN + 6;
    this.pageFrame();
  }

  ensure(height: number) {
    if (this.y + height > BOTTOM) this.newPage();
  }

  pageFrame() {
    const d = this.doc;
    this.stroke(GOLD);
    d.setLineWidth(0.3);
    d.line(MARGIN, 12, PAGE_W - MARGIN, 12);
    this.font('helvetica', 'bold', 7);
    this.color(GOLD_DARK);
    d.text(clean(`${site.name.toUpperCase()}  ·  NUMEROLOGY`), MARGIN, 9.5, { charSpace: 0.6 });
    this.font('helvetica', 'normal', 7.5);
    this.color(INK_SOFT);
    d.text(clean(this.person), PAGE_W - MARGIN, 9.5, { align: 'right' });
    // footer
    d.line(MARGIN, PAGE_H - 14, PAGE_W - MARGIN, PAGE_H - 14);
    this.font('helvetica', 'normal', 7);
    d.text('For entertainment and self-reflection. Not a prediction of specific events.', MARGIN, PAGE_H - 9);
    d.text(String(this.page), PAGE_W - MARGIN, PAGE_H - 9, { align: 'right' });
  }

  /** Wrapped paragraph. */
  para(text: string, opts: { size?: number; font?: 'times' | 'helvetica'; style?: 'normal' | 'italic' | 'bold'; color?: RGB; gap?: number; width?: number; x?: number; lineHeight?: number } = {}) {
    const size = opts.size ?? 10;
    this.font(opts.font ?? 'helvetica', opts.style ?? 'normal', size);
    this.color(opts.color ?? INK);
    const width = opts.width ?? CONTENT_W;
    const lines: string[] = this.doc.splitTextToSize(clean(text), width);
    const lh = (size * (opts.lineHeight ?? 1.45)) / 2.835; // pt → mm
    for (const line of lines) {
      this.ensure(lh);
      this.doc.text(line, opts.x ?? MARGIN, this.y + lh * 0.75);
      this.y += lh;
    }
    this.y += opts.gap ?? 3;
  }

  eyebrow(text: string, color: RGB = GOLD_DARK) {
    this.ensure(8);
    this.font('helvetica', 'bold', 7.5);
    this.color(color);
    this.doc.text(clean(text.toUpperCase()), MARGIN, this.y + 3, { charSpace: 0.7 });
    this.y += 6;
  }

  heading(text: string, size = 22) {
    const lh = (size * 1.15) / 2.835;
    this.ensure(lh + 4);
    this.font('times', 'normal', size);
    this.color(INK);
    const lines: string[] = this.doc.splitTextToSize(clean(text), CONTENT_W);
    for (const line of lines) {
      this.doc.text(line, MARGIN, this.y + lh * 0.8);
      this.y += lh;
    }
    this.y += 3;
  }

  subheading(text: string) {
    this.ensure(14);
    this.y += 1;
    this.font('times', 'bold', 12.5);
    this.color(INK);
    this.doc.text(clean(text), MARGIN, this.y + 4);
    this.y += 7;
  }

  bullets(items: string[], marker = '•', opts: { x?: number; width?: number } = {}) {
    const x = opts.x ?? MARGIN;
    const width = (opts.width ?? CONTENT_W) - 5;
    this.font('helvetica', 'normal', 9.8);
    const lh = (9.8 * 1.45) / 2.835;
    for (const item of items) {
      const lines: string[] = this.doc.splitTextToSize(clean(item), width);
      this.ensure(lh * lines.length);
      this.color(GOLD_DARK);
      this.font('helvetica', 'bold', 9.8);
      this.doc.text(marker, x, this.y + lh * 0.75);
      this.font('helvetica', 'normal', 9.8);
      this.color(INK);
      lines.forEach((line, i) => this.doc.text(line, x + 5, this.y + lh * 0.75 + i * lh));
      this.y += lh * lines.length + 1;
    }
    this.y += 2;
  }

  /** Two bullet columns side by side. */
  columns(left: { title: string; items: string[]; marker: string }, right: { title: string; items: string[]; marker: string }) {
    const colW = (CONTENT_W - 8) / 2;
    const measure = (items: string[]) => {
      this.font('helvetica', 'normal', 9.8);
      const lh = (9.8 * 1.45) / 2.835;
      return items.reduce((h, it) => h + (this.doc.splitTextToSize(clean(it), colW - 5) as string[]).length * lh + 1, 0) + 9;
    };
    const height = Math.max(measure(left.items), measure(right.items));
    this.ensure(height);
    const startY = this.y;
    this.subheading(left.title);
    this.bullets(left.items, left.marker, { width: colW });
    const leftEnd = this.y;
    this.y = startY;
    const saveSub = (title: string) => {
      this.font('times', 'bold', 12.5);
      this.color(INK);
      this.doc.text(clean(title), MARGIN + colW + 8, this.y + 5);
      this.y += 8;
    };
    saveSub(right.title);
    this.bullets(right.items, right.marker, { x: MARGIN + colW + 8, width: colW });
    this.y = Math.max(leftEnd, this.y);
  }

  rule(gap = 4) {
    this.ensure(gap * 2);
    this.stroke(LINE);
    this.doc.setLineWidth(0.25);
    this.doc.line(MARGIN, this.y + gap / 2, PAGE_W - MARGIN, this.y + gap / 2);
    this.y += gap;
  }

  /** The circular number visual, drawn natively. */
  ring(cx: number, cy: number, r: number, value: number, opts: { night?: boolean; master?: boolean; label?: string } = {}) {
    const d = this.doc;
    const root = rootDigit(value);
    const track = opts.night ? NIGHT_SOFT : LINE;
    this.stroke(track);
    d.setLineWidth(0.35);
    d.circle(cx, cy, r, 'S');
    if (opts.master) {
      this.stroke(PLUM);
      d.setLineWidth(0.25);
      d.circle(cx, cy, r - 1.8, 'S');
    }
    // arc from the top, clockwise, to the root position
    this.stroke(opts.night ? GOLD_LIGHT : GOLD);
    d.setLineWidth(0.9);
    const steps = Math.max(6, Math.round(root * 8));
    const end = (root / 9) * Math.PI * 2;
    for (let i = 0; i < steps; i++) {
      const a0 = (i / steps) * end - Math.PI / 2;
      const a1 = ((i + 1) / steps) * end - Math.PI / 2;
      d.line(cx + r * Math.cos(a0), cy + r * Math.sin(a0), cx + r * Math.cos(a1), cy + r * Math.sin(a1));
    }
    for (let digit = 1; digit <= 9; digit++) {
      const p = wheelPoint(digit, r, cx, cy);
      if (digit === root) {
        this.fill(opts.night ? GOLD_LIGHT : GOLD);
        d.circle(p.x, p.y, r * 0.075 + 0.4, 'F');
      } else {
        this.fill(opts.night ? [70, 78, 130] : LINE);
        d.circle(p.x, p.y, r * 0.03 + 0.15, 'F');
      }
    }
    this.font('times', 'normal', r * (value >= 10 ? 1.75 : 2.1));
    this.color(opts.night ? [255, 255, 255] : INK);
    d.text(String(value), cx, cy + r * 0.27, { align: 'center' });
    if (opts.label) {
      this.font('helvetica', 'bold', 6.5);
      this.color(opts.night ? GOLD : GOLD_DARK);
      d.text(clean(opts.label.toUpperCase()), cx, cy + r + 5, { align: 'center', charSpace: 0.4 });
    }
  }

  box(height: number, color: RGB = CREAM) {
    this.fill(color);
    this.doc.roundedRect(MARGIN, this.y, CONTENT_W, height, 2.5, 2.5, 'F');
  }
}

/* ────────────────────────────── pages ────────────────────────────── */

function cover(w: Writer, chart: NumerologyChart) {
  const d = w.doc;
  w.fill(NIGHT);
  d.rect(0, 0, PAGE_W, PAGE_H, 'F');

  // deterministic star field
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 140; i++) {
    const shade = rand() > 0.85 ? GOLD : ([200, 205, 235] as RGB);
    w.fill(shade);
    d.circle(rand() * PAGE_W, rand() * PAGE_H, rand() * 0.35 + 0.08, 'F');
  }

  // frame
  w.stroke(GOLD);
  d.setLineWidth(0.3);
  d.rect(10, 10, PAGE_W - 20, PAGE_H - 20, 'S');
  d.setLineWidth(0.15);
  d.rect(12, 12, PAGE_W - 24, PAGE_H - 24, 'S');

  // emblem
  const cx = PAGE_W / 2;
  w.stroke(GOLD);
  d.setLineWidth(0.3);
  d.circle(cx, 52, 13, 'S');
  for (let digit = 1; digit <= 9; digit++) {
    const p = wheelPoint(digit, 13, cx, 52);
    w.fill(digit === 9 ? GOLD_LIGHT : GOLD);
    d.circle(p.x, p.y, digit === 9 ? 1.3 : 0.6, 'F');
  }
  w.fill(GOLD);
  d.circle(cx, 52, 1, 'F');

  w.font('helvetica', 'bold', 8);
  w.color(GOLD);
  d.text(clean(`${site.name.toUpperCase()}  ·  NUMEROLOGY`), cx, 78, { align: 'center', charSpace: 1.4 });

  w.font('times', 'italic', 15);
  w.color(GOLD_LIGHT);
  d.text('A personal numerology reading for', cx, 98, { align: 'center' });

  const name = clean(chart.input.fullName);
  let size = 38;
  w.font('times', 'normal', size);
  while (d.getTextWidth(name) > CONTENT_W - 10 && size > 18) {
    size -= 2;
    w.font('times', 'normal', size);
  }
  w.color([255, 255, 255]);
  d.text(name, cx, 116, { align: 'center' });

  w.font('helvetica', 'normal', 10);
  w.color([167, 171, 203]);
  d.text(clean(`Born ${formatBirthDate(chart.input.birthDate)}`), cx, 127, { align: 'center' });

  // six rings
  const cols = 3;
  const gapX = 52;
  const startX = cx - gapX;
  POSITION_ORDER.forEach((key, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const n = chart[key];
    w.ring(startX + col * gapX, 160 + row * 46, 13, n.value, {
      night: true,
      master: n.isMaster,
      label: key === 'personalYear' ? `Personal Year ${chart.input.year}` : POSITIONS[key].name,
    });
  });

  w.font('times', 'italic', 11);
  w.color(GOLD_LIGHT);
  const today = new Date();
  d.text(clean(`Prepared ${today.getDate()} ${MONTH_NAMES[today.getMonth()]} ${today.getFullYear()}`), cx, 262, { align: 'center' });
  w.font('helvetica', 'normal', 7.5);
  w.color([167, 171, 203]);
  d.text('Calculated with the traditional Pythagorean method. For entertainment and self-reflection.', cx, 270, { align: 'center' });
}

function profilePage(w: Writer, chart: NumerologyChart, profile: Profile) {
  w.newPage();
  w.eyebrow('Overall numerology profile');
  w.heading(profile.headline, 24);
  profile.summary.forEach((p, i) => w.para(p, { size: i === 0 ? 11.5 : 10.5, font: i === 0 ? 'times' : 'helvetica', gap: 3.5 }));
  w.rule(6);

  // numbers summary table
  w.eyebrow('Your six core numbers');
  const rowH = 9;
  w.ensure(rowH * 6 + 4);
  POSITION_ORDER.forEach((key, i) => {
    const n = chart[key];
    const y = w.y + i * rowH;
    if (i % 2 === 0) {
      w.fill(CREAM);
      w.doc.rect(MARGIN, y, CONTENT_W, rowH, 'F');
    }
    w.font('helvetica', 'bold', 9.5);
    w.color(INK);
    w.doc.text(clean(POSITIONS[key].name), MARGIN + 3, y + 6);
    w.font('times', 'normal', 15);
    w.color(GOLD_DARK);
    w.doc.text(clean(displayValue(n)), MARGIN + 52, y + 6.5);
    w.font('helvetica', 'normal', 9.5);
    w.color(INK_SOFT);
    const title = key === 'personalYear' ? PERSONAL_YEARS[n.value].title : NUMBER_MEANINGS[n.value].title;
    w.doc.text(clean(`${title} — ${POSITIONS[key].short.toLowerCase()}`), MARGIN + 72, y + 6);
  });
  w.y += rowH * 6 + 6;

  w.eyebrow('Insights');
  for (const ins of profile.insights) {
    w.subheading(ins.title);
    w.para(ins.text, { size: 9.8, gap: 2.5 });
  }
}

function numberPage(w: Writer, n: CoreNumber & { key: PositionKey }) {
  const m = NUMBER_MEANINGS[n.value];
  const pos = POSITIONS[n.key];
  w.newPage();
  w.ring(PAGE_W - MARGIN - 16, w.y + 15, 14, n.value, { master: n.isMaster });
  w.eyebrow(`${pos.name} number${pos.alsoKnownAs ? ` · ${pos.alsoKnownAs}` : ''}`);
  const keep = w.y;
  w.font('times', 'normal', 26);
  w.color(INK);
  w.doc.text(clean(`${n.value} · ${m.title}`), MARGIN, w.y + 9);
  w.y = keep + 13;
  w.para(m.keywords.join('  ·  '), { size: 9, color: GOLD_DARK, style: 'bold', gap: 4, width: CONTENT_W - 40 });
  w.y = Math.max(w.y, keep + 30);
  w.para(m.positions[n.key], { font: 'times', style: 'italic', size: 12.5, gap: 5 });

  w.subheading(`What ${n.value} represents`);
  w.para(m.essence, { gap: 2 });
  w.para(m.traits);
  w.columns({ title: 'Strengths', items: m.strengths, marker: '+' }, { title: 'Challenges', items: m.challenges, marker: '–' });
  w.subheading('Relationships & social life');
  w.para(m.relationships);
  w.subheading('Career & work');
  w.para(m.career, { gap: 1.5 });
  w.para(`Traditionally associated fields: ${m.careerPaths.join(', ')}.`, { size: 9.3, color: INK_SOFT });
  w.subheading('Personal growth');
  w.bullets(m.growth, '›');

  // reflection box
  w.font('times', 'italic', 12.5);
  const lines: string[] = w.doc.splitTextToSize(clean(m.reflection), CONTENT_W - 14);
  const h = 12 + lines.length * 5.6;
  w.ensure(h + 4);
  w.box(h, NIGHT);
  w.font('helvetica', 'bold', 7);
  w.color(GOLD);
  w.doc.text('REFLECT', MARGIN + 7, w.y + 7, { charSpace: 0.7 });
  w.font('times', 'italic', 12.5);
  w.color([255, 255, 255]);
  lines.forEach((l, i) => w.doc.text(l, MARGIN + 7, w.y + 13 + i * 5.6));
  w.y += h + 6;

}

function personalYearPage(w: Writer, chart: NumerologyChart) {
  const py = chart.personalYear;
  const year = chart.input.year;
  const meaning = PERSONAL_YEARS[py.value];
  w.newPage();
  w.ring(PAGE_W - MARGIN - 16, w.y + 15, 14, py.value);
  w.eyebrow(`Personal Year · ${year}`);
  w.heading(`Personal Year ${py.value}`, 26);
  w.para(meaning.title, { font: 'times', style: 'italic', size: 15, color: GOLD_DARK, gap: 4, width: CONTENT_W - 40 });
  w.y = Math.max(w.y, MARGIN + 40);
  w.para(meaning.overview, { size: 10.5, gap: 4 });
  if (py.masterUndertone) {
    w.para(`Your total for ${year} passes through the master number ${py.masterUndertone}, traditionally said to add extra sensitivity and inspiration to the year.`, { size: 9.3, color: INK_SOFT, style: 'italic' });
  }
  w.columns({ title: `Themes for ${year}`, items: meaning.themes, marker: '*' }, { title: 'Opportunities', items: meaning.opportunities, marker: '+' });
  w.subheading('Be mindful of');
  w.bullets(meaning.mindful, '–');

  // months
  w.subheading(`${year} month by month`);
  const colW = CONTENT_W / 3;
  const rowH = 11;
  w.ensure(rowH * 4 + 4);
  chart.personalMonths.forEach((pm, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = MARGIN + col * colW;
    const y = w.y + row * rowH;
    w.stroke(LINE);
    w.doc.setLineWidth(0.2);
    w.doc.roundedRect(x + 0.6, y + 0.6, colW - 1.2, rowH - 1.2, 1.5, 1.5, 'S');
    w.font('times', 'normal', 16);
    w.color(GOLD_DARK);
    w.doc.text(String(pm.value), x + 4, y + 7.8);
    w.font('helvetica', 'bold', 7.5);
    w.color(INK);
    w.doc.text(clean(`${MONTH_NAMES[pm.month - 1].toUpperCase()} · ${PERSONAL_MONTHS[pm.value].keyword}`), x + 11, y + 4.8);
    w.font('helvetica', 'normal', 7);
    w.color(INK_SOFT);
    w.doc.text(clean(PERSONAL_MONTHS[pm.value].hint), x + 11, y + 8.4, { maxWidth: colW - 13 });
  });
  w.y += rowH * 4 + 4;

  w.subheading('Reflection points');
  w.bullets(meaning.reflections, '*');

  const next = PERSONAL_YEARS[(py.value % 9) + 1];
  w.subheading(`Looking ahead: ${year + 1}`);
  w.para(`${year + 1} will be your Personal Year ${next.number} — ${next.title.toLowerCase()}: ${next.preview}.`);
}

function namePage(w: Writer, chart: NumerologyChart) {
  w.ensure(90);
  w.y += 4;
  w.eyebrow('The letters of your name');
  w.heading('Your name in numbers', 20);
  for (const part of chart.nameParts) {
    w.ensure(14);
    let x = MARGIN;
    for (const l of part.letters) {
      if (x + 8 > PAGE_W - MARGIN) {
        x = MARGIN;
        w.y += 13;
        w.ensure(14);
      }
      w.fill(l.isVowel ? [240, 228, 200] : CREAM);
      w.doc.roundedRect(x, w.y, 7.4, 11, 1, 1, 'F');
      w.font('times', 'bold', 12);
      w.color(INK);
      w.doc.text(l.char, x + 3.7, w.y + 5.5, { align: 'center' });
      w.font('helvetica', 'bold', 6.5);
      w.color(l.isVowel ? GOLD_DARK : INK_SOFT);
      w.doc.text(String(l.value), x + 3.7, w.y + 9.3, { align: 'center' });
      x += 8.2;
    }
    w.y += 14;
  }
  w.para('Highlighted letters are vowels (Soul Urge); the others are consonants (Personality).', { size: 8.5, color: INK_SOFT });

  w.subheading('Inclusion — how often each number appears');
  const cell = CONTENT_W / 9;
  w.ensure(16);
  for (let n = 1; n <= 9; n++) {
    const x = MARGIN + (n - 1) * cell;
    const count = chart.inclusion[n];
    w.stroke(count ? GOLD : PLUM);
    w.doc.setLineWidth(0.25);
    w.doc.roundedRect(x + 0.8, w.y, cell - 1.6, 13, 1.5, 1.5, 'S');
    w.font('times', 'normal', 13);
    w.color(INK);
    w.doc.text(String(n), x + cell / 2, w.y + 6, { align: 'center' });
    w.font('helvetica', 'bold', 6.8);
    w.color(count ? GOLD_DARK : PLUM);
    w.doc.text(count ? `x ${count}` : 'missing', x + cell / 2, w.y + 10.5, { align: 'center' });
  }
  w.y += 18;

  if (chart.missingNumbers.length) {
    w.subheading('Karmic lessons');
    w.bullets(chart.missingNumbers.map((n) => `${n} — ${KARMIC_LESSONS[n]}`), '·');
  } else {
    w.para('Every number from 1 to 9 appears in your name — traditionally read as a well-rounded set of inner resources.');
  }
}

/** All the step-by-step workings together, so every number can be checked by hand. */
function appendix(w: Writer, chart: NumerologyChart) {
  w.newPage();
  w.eyebrow('Appendix');
  w.heading('How your numbers were calculated', 20);
  w.para('Pythagorean chart: A J S = 1 · B K T = 2 · C L U = 3 · D M V = 4 · E N W = 5 · F O X = 6 · G P Y = 7 · H Q Z = 8 · I R = 9. Numbers are reduced by adding their digits until a single digit remains, stopping at the master numbers 11, 22 and 33.', { size: 9, color: INK_SOFT, gap: 4 });
  for (const key of POSITION_ORDER) {
    const n = chart[key];
    const pos = POSITIONS[key];
    const rows = n.working.length;
    w.ensure(16 + rows * 5.5);
    w.subheading(`${pos.name}${key === 'personalYear' ? ` (${chart.input.year})` : ''} — ${displayValue(n)}`);
    w.para(pos.method, { size: 8.6, color: INK_SOFT, gap: 1.5 });
    for (const line of n.working) {
      w.font('helvetica', 'normal', 8.8);
      const detail: string[] = w.doc.splitTextToSize(clean(line.detail), CONTENT_W - 50);
      w.ensure(detail.length * 4.2 + 1.5);
      w.font('helvetica', 'bold', 8.8);
      w.color(INK);
      w.doc.text(clean(line.label), MARGIN, w.y + 4);
      w.font('helvetica', 'normal', 8.8);
      w.color(INK_SOFT);
      detail.forEach((dl, i) => w.doc.text(dl, MARGIN + 34, w.y + 4 + i * 4.2));
      w.font('times', 'bold', 11);
      w.color(GOLD_DARK);
      w.doc.text(String(line.result), PAGE_W - MARGIN, w.y + 4, { align: 'right' });
      w.y += Math.max(5.5, detail.length * 4.2 + 1.5);
    }
    if (n.note) w.para(n.note, { size: 8.3, color: INK_SOFT, style: 'italic' });
    w.y += 2;
  }
}

function closingPage(w: Writer) {
  w.ensure(60);
  w.rule(8);
  w.eyebrow('About this reading');
  w.para(
    'This report was calculated with the traditional Pythagorean system: letters are converted to numbers (A = 1 to I = 9, repeating), dates and names are reduced digit by digit, and the master numbers 11, 22 and 33 are preserved. The interpretations summarise meanings traditionally associated with each number.',
    { size: 9.3, color: INK_SOFT },
  );
  w.para(
    'Numerology is a symbolic practice. This reading is offered for entertainment, inspiration and self-reflection; it describes tendencies, not certainties, does not predict specific events, and is not a substitute for professional medical, legal, financial or psychological advice.',
    { size: 9.3, color: INK_SOFT },
  );
  const contact = [site.contact.email, site.url.includes('.example') ? null : site.url].filter(Boolean).join('  ·  ');
  if (contact) w.para(contact, { size: 9.5, color: GOLD_DARK, style: 'bold' });
}

/** Build the full report document. */
export function buildReport(chart: NumerologyChart, profile: Profile): jsPDF {
  const w = new Writer(`${chart.input.fullName} · born ${formatBirthDate(chart.input.birthDate)}`);
  w.doc.setProperties({
    title: clean(`Numerology reading — ${chart.input.fullName}`),
    subject: 'Personal numerology reading',
    author: site.name,
    creator: `${site.name} Numerology`,
  });
  cover(w, chart);
  profilePage(w, chart, profile);
  for (const key of ['lifePath', 'expression', 'soulUrge', 'personality', 'birthday'] as PositionKey[]) {
    numberPage(w, chart[key] as CoreNumber & { key: PositionKey });
  }
  personalYearPage(w, chart);
  namePage(w, chart);
  appendix(w, chart);
  closingPage(w);
  return w.doc;
}

export async function downloadReport(chart: NumerologyChart, profile: Profile): Promise<void> {
  const doc = buildReport(chart, profile);
  const slug = clean(firstName(chart.input.fullName)).toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'reading';
  doc.save(`numerology-reading-${slug}-${chart.input.year}.pdf`);
}
