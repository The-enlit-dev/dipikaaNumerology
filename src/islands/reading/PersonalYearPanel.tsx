import { useMemo } from 'preact/hooks';
import { personalMonthNumber, personalYearNumber, displayValue, type BirthDate } from '../../lib/numerology/calculate';
import { MONTH_NAMES, PERSONAL_MONTHS, PERSONAL_YEARS } from '../../data/cycles';
import NumberRing from './NumberRing';

interface Props {
  birthDate: BirthDate;
  year: number;
  onYearChange: (year: number) => void;
}

const SHORT_MONTHS = MONTH_NAMES.map((m) => m.slice(0, 3));

export default function PersonalYearPanel({ birthDate, year, onYearChange }: Props) {
  const today = new Date();
  const thisYear = today.getFullYear();
  const py = useMemo(() => personalYearNumber(birthDate, year), [birthDate, year]);
  const next = useMemo(() => personalYearNumber(birthDate, year + 1), [birthDate, year]);
  const meaning = PERSONAL_YEARS[py.value];
  const nextMeaning = PERSONAL_YEARS[next.value];
  const minYear = Math.max(birthDate.year, thisYear - 20);
  const maxYear = thisYear + 20;

  const go = (y: number) => {
    onYearChange(Math.min(maxYear, Math.max(minYear, y)));
  };

  const cyclePosition = py.value; // 1–9 within the current nine-year cycle

  return (
    <div class="py">
      <div class="py-head">
        <div class="py-ring">
          <NumberRing value={py.value} size={176} tone="night" caption={py.masterUndertone ? displayValue(py) : `Year ${cyclePosition} of 9`} label={`Personal Year ${py.value}`} />
        </div>
        <div class="py-intro">
          <div class="year-switch" role="group" aria-label="Choose a year">
            <button type="button" class="year-btn" onClick={() => go(year - 1)} disabled={year <= minYear} aria-label={`Show ${year - 1}`}>
              ‹
            </button>
            <span class="year-current" aria-live="polite">
              {year}
              {year === thisYear && <small> · this year</small>}
              {year === thisYear + 1 && <small> · next year</small>}
            </span>
            <button type="button" class="year-btn" onClick={() => go(year + 1)} disabled={year >= maxYear} aria-label={`Show ${year + 1}`}>
              ›
            </button>
          </div>
          <h3 class="py-title">
            Personal Year {py.value}: <em>{meaning.title.replace(/^A Year of /, '')}</em>
          </h3>
          <ul class="chips">
            {meaning.keywords.map((k) => (
              <li key={k} class="chip">
                {k}
              </li>
            ))}
          </ul>
          <p class="py-overview">{meaning.overview}</p>
          {py.masterUndertone && (
            <p class="small muted">
              Your total for {year} passes through the master number {py.masterUndertone}, which is traditionally said to add
              extra sensitivity and inspiration to this year’s theme.
            </p>
          )}
        </div>
      </div>

      <ol class="cycle-track" aria-label="Your position in the nine-year cycle">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <li key={n} class={n === py.value ? 'is-current' : n < py.value ? 'is-past' : ''} aria-current={n === py.value ? 'step' : undefined}>
            <span class="cycle-num">{n}</span>
            <span class="cycle-word">{PERSONAL_YEARS[n].keywords[0]}</span>
          </li>
        ))}
      </ol>

      <div class="py-columns">
        <section class="card on-night">
          <h4>Themes for {year}</h4>
          <ul class="mark-list star">
            {meaning.themes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
        <section class="card on-night">
          <h4>Opportunities</h4>
          <ul class="mark-list plus">
            {meaning.opportunities.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
        <section class="card on-night">
          <h4>Be mindful of</h4>
          <ul class="mark-list minus">
            {meaning.mindful.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      </div>

      <section class="months" aria-labelledby="months-title">
        <h4 id="months-title">Your {year} month by month</h4>
        <p class="small muted">
          Each month carries its own Personal Month number (Personal Year + calendar month), colouring the year’s main theme.
        </p>
        <ol class="month-grid">
          {MONTH_NAMES.map((name, i) => {
            const value = personalMonthNumber(py.value, i + 1);
            const isNow = year === thisYear && i === today.getMonth();
            return (
              <li key={name} class={`month${isNow ? ' is-now' : ''}`} aria-current={isNow ? 'date' : undefined}>
                <span class="month-name" aria-label={name}>
                  {SHORT_MONTHS[i]}
                </span>
                <span class="month-num">{value}</span>
                <span class="month-key">{PERSONAL_MONTHS[value].keyword}</span>
                <span class="month-hint">{PERSONAL_MONTHS[value].hint}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <div class="py-bottom">
        <section class="py-reflect">
          <h4>Reflection points for {year}</h4>
          <ul class="reflect-list">
            {meaning.reflections.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <section class="py-next card on-night">
          <p class="eyebrow">Looking ahead</p>
          <h4>
            {year + 1}: Personal Year {next.value}
          </h4>
          <p>
            The following year moves you into <strong>{nextMeaning.title.replace(/^A /, 'a ').toLowerCase()}</strong> —{' '}
            {nextMeaning.preview}.
          </p>
          <button type="button" class="link-arrow as-button" onClick={() => go(year + 1)}>
            Read {year + 1}
          </button>
        </section>
      </div>
    </div>
  );
}
