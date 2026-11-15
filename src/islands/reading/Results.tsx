import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { NumerologyChart } from '../../lib/numerology/calculate';
import { displayValue } from '../../lib/numerology/calculate';
import { buildProfile } from '../../lib/numerology/profile';
import { NUMBER_MEANINGS, type PositionKey } from '../../data/numbers';
import { PERSONAL_YEARS } from '../../data/cycles';
import { POSITIONS, POSITION_ORDER } from '../../data/positions';
import { firstName, formatBirthDate, possessive } from '../../lib/format';
import type { SavedReading } from '../../lib/session';
import NumberRing from './NumberRing';
import Constellation from './Constellation';
import NumberDetail from './NumberDetail';
import PersonalYearPanel from './PersonalYearPanel';
import NameChart from './NameChart';

interface Props {
  chart: NumerologyChart;
  history: SavedReading[];
  activeId: string;
  onYearChange: (year: number) => void;
  onSelectReading: (r: SavedReading) => void;
  onClearHistory: () => void;
  onEdit: () => void;
  contactHref: string;
}

const DETAIL_KEYS: PositionKey[] = ['lifePath', 'expression', 'soulUrge', 'personality', 'birthday'];

export default function Results({ chart, history, activeId, onYearChange, onSelectReading, onClearHistory, onEdit, contactHref }: Props) {
  const profile = useMemo(() => buildProfile(chart), [chart]);
  const [tab, setTab] = useState<PositionKey>('lifePath');
  const [pdfState, setPdfState] = useState<'idle' | 'busy' | 'error'>('idle');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const name = firstName(chart.input.fullName);

  // Open every collapsible section when printing so the printout is complete.
  useEffect(() => {
    const opened: HTMLDetailsElement[] = [];
    const before = () => {
      document.querySelectorAll<HTMLDetailsElement>('.results details:not([open])').forEach((d) => {
        d.open = true;
        opened.push(d);
      });
    };
    const after = () => {
      opened.splice(0).forEach((d) => (d.open = false));
    };
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, []);

  function openDetail(key: PositionKey) {
    setTab(key);
    document.getElementById('in-depth')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => tabRefs.current[key]?.focus({ preventScroll: true }), 450);
  }

  function onTabKey(e: KeyboardEvent, index: number) {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const last = DETAIL_KEYS.length - 1;
    const nextIndex =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : last;
    const key = DETAIL_KEYS[nextIndex];
    setTab(key);
    tabRefs.current[key]?.focus();
  }

  async function downloadPdf() {
    setPdfState('busy');
    try {
      const { downloadReport } = await import('../../lib/report/pdf');
      await downloadReport(chart, profile);
      setPdfState('idle');
    } catch (err) {
      console.error(err);
      setPdfState('error');
    }
  }

  const py = chart.personalYear;

  return (
    <div class="results">
      {/* ── Header ─────────────────────────────────────────── */}
      <header class="results-head night stars">
        <div class="container">
          <p class="eyebrow">Your personal reading</p>
          <h2 id="results-title" tabIndex={-1}>
            The numbers of <em>{name}</em>
          </h2>
          <p class="results-meta">
            <span>{chart.input.fullName}</span>
            <span aria-hidden="true">·</span>
            <span>Born {formatBirthDate(chart.input.birthDate)}</span>
          </p>
          <div class="results-actions no-print">
            <button type="button" class="btn btn-gold" onClick={downloadPdf} disabled={pdfState === 'busy'}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 3v10m0 0l-4-4m4 4l4-4M4 16h12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              {pdfState === 'busy' ? 'Preparing PDF…' : 'Download PDF report'}
            </button>
            <button type="button" class="btn btn-ghost" onClick={() => window.print()}>
              Print
            </button>
            <button type="button" class="btn btn-ghost" onClick={onEdit}>
              New reading
            </button>
          </div>
          {pdfState === 'error' && (
            <p class="field-error" role="alert">
              The PDF could not be created on this device. Please try “Print” and choose “Save as PDF”.
            </p>
          )}
        </div>
      </header>

      {/* ── At a glance ────────────────────────────────────── */}
      <section class="section tight paper glance" aria-labelledby="glance-title">
        <div class="container">
          <div class="glance-grid">
            <div class="glance-visual">
              <h3 id="glance-title" class="glance-title">
                {possessive(name)} chart at a glance
              </h3>
              <Constellation chart={chart} />
            </div>
            <ul class="number-cards">
              {POSITION_ORDER.map((key) => {
                const n = chart[key];
                const pos = POSITIONS[key];
                const title = key === 'personalYear' ? PERSONAL_YEARS[n.value].title : NUMBER_MEANINGS[n.value].title;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      class="number-card"
                      onClick={() =>
                        key === 'personalYear'
                          ? document.getElementById('personal-year')?.scrollIntoView({ behavior: 'smooth' })
                          : openDetail(key)
                      }
                    >
                      <NumberRing value={n.value} isMaster={n.isMaster} size={84} tone="paper" />
                      <span class="nc-text">
                        <span class="nc-label">
                          {pos.name}
                          {key === 'personalYear' ? ` · ${chart.input.year}` : ''}
                        </span>
                        <span class="nc-title">{title}</span>
                        <span class="nc-short">
                          {pos.short}
                          {(n.isMaster || n.masterUndertone) && <> · {displayValue(n)}</>}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Overall profile ────────────────────────────────── */}
      <section class="section paper-deep profile" aria-labelledby="profile-title">
        <div class="container">
          <div class="profile-grid">
            <div class="profile-main">
              <p class="eyebrow">Overall numerology profile</p>
              <h3 id="profile-title" class="profile-headline">
                {profile.headline}
              </h3>
              {profile.summary.map((p, i) => (
                <p key={i} class={i === 0 ? 'lede' : ''}>
                  {p}
                </p>
              ))}
            </div>
            <ul class="insights">
              {profile.insights.map((ins) => (
                <li key={ins.title} class="insight">
                  <h4>{ins.title}</h4>
                  <p>{ins.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── In depth ───────────────────────────────────────── */}
      <section id="in-depth" class="section paper in-depth" aria-labelledby="depth-title">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">Your core numbers in depth</p>
            <h3 id="depth-title" class="section-title">
              Five numbers, five <em>facets</em> of you
            </h3>
          </div>
          <div class="tabs" role="tablist" aria-label="Core numbers">
            {DETAIL_KEYS.map((key, i) => (
              <button
                key={key}
                ref={(el) => { tabRefs.current[key] = el; }}
                type="button"
                role="tab"
                id={`tab-${key}`}
                aria-selected={tab === key}
                aria-controls={`panel-${key}`}
                tabIndex={tab === key ? 0 : -1}
                class="tab"
                onClick={() => setTab(key)}
                onKeyDown={(e) => onTabKey(e as unknown as KeyboardEvent, i)}
              >
                <span class="tab-num">{chart[key].value}</span>
                <span class="tab-label">{POSITIONS[key].name}</span>
              </button>
            ))}
          </div>
          {DETAIL_KEYS.map((key) => (
            <NumberDetail
              key={key}
              number={chart[key] as typeof chart.lifePath & { key: PositionKey }}
              id={`panel-${key}`}
              labelledBy={`tab-${key}`}
              active={tab === key}
            />
          ))}
        </div>
      </section>

      {/* ── Personal Year ──────────────────────────────────── */}
      <section id="personal-year" class="section night stars glow personal-year" aria-labelledby="py-section-title">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">Your year ahead</p>
            <h3 id="py-section-title" class="section-title">
              The <em>rhythm</em> of your year
            </h3>
            <p class="muted">
              Personal Years move in a nine-year cycle, running from January to December. Use the arrows to explore past and
              coming years.
            </p>
          </div>
          <PersonalYearPanel birthDate={chart.input.birthDate} year={chart.input.year} onYearChange={onYearChange} />
        </div>
      </section>

      {/* ── Name chart ─────────────────────────────────────── */}
      <section class="section paper-deep" aria-labelledby="name-title">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">The letters of your name</p>
            <h3 id="name-title" class="section-title">
              Your <em>name</em>, decoded
            </h3>
          </div>
          <NameChart chart={chart} />
        </div>
      </section>

      {/* ── Closing ────────────────────────────────────────── */}
      <section class="section paper closing" aria-labelledby="closing-title">
        <div class="container narrow center">
          <p class="eyebrow">To carry with you</p>
          <h3 id="closing-title" class="section-title">
            Questions for <em>reflection</em>
          </h3>
          <ul class="closing-reflections">
            <li>
              <span>Life Path {chart.lifePath.value}</span>
              {NUMBER_MEANINGS[chart.lifePath.value].reflection}
            </li>
            <li>
              <span>Soul Urge {chart.soulUrge.value}</span>
              {NUMBER_MEANINGS[chart.soulUrge.value].reflection}
            </li>
            <li>
              <span>Personal Year {py.value}</span>
              {PERSONAL_YEARS[py.value].reflections[py.value === chart.soulUrge.value || py.value === chart.lifePath.value ? 1 : 0]}
            </li>
          </ul>
          <div class="closing-cta no-print">
            <p>Would you like to explore your reading further, or ask Dipikaa a question about it?</p>
            <div class="closing-buttons">
              <a class="btn" href={contactHref}>
                Contact Dipikaa
              </a>
              <button type="button" class="btn btn-ghost" onClick={downloadPdf} disabled={pdfState === 'busy'}>
                Save my reading as PDF
              </button>
            </div>
          </div>
          <p class="disclaimer results-disclaimer">
            This reading is based on traditional Pythagorean numerology and is offered for entertainment and self-reflection. It
            describes symbolic tendencies, not certainties, and does not predict specific events.
          </p>
        </div>
      </section>

      {/* ── Session history ────────────────────────────────── */}
      {history.length > 0 && (
        <section class="history no-print" aria-labelledby="history-title">
          <div class="container">
            <div class="history-inner">
              <h3 id="history-title">Readings this session</h3>
              <ul>
                {history.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      class={`history-item${r.id === activeId ? ' is-active' : ''}`}
                      aria-current={r.id === activeId ? 'true' : undefined}
                      onClick={() => onSelectReading(r)}
                    >
                      <span>{r.fullName}</span>
                      <small>{formatBirthDate(r.birthDate)}</small>
                    </button>
                  </li>
                ))}
              </ul>
              <p class="small muted">
                Kept only in this browser tab and erased automatically when you close it.{' '}
                <button type="button" class="text-button" onClick={onClearHistory}>
                  Forget my details now
                </button>
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
