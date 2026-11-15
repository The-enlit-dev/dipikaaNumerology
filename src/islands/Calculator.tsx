/**
 * The numerology calculator island: form → chart → results dashboard.
 * Everything runs in the browser; nothing is sent to a server.
 */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { calculateChart } from '../lib/numerology/calculate';
import {
  clearReadings,
  loadReadings,
  readingId,
  saveReading,
  takePending,
  type SavedReading,
} from '../lib/session';
import ReadingForm, { type ReadingInput } from './reading/ReadingForm';
import Results from './reading/Results';
import './reading/reading.css';

interface Props {
  contactHref?: string;
}

export default function Calculator({ contactHref = '/contact/' }: Props) {
  const [input, setInput] = useState<ReadingInput | null>(null);
  const [history, setHistory] = useState<SavedReading[]>([]);
  const [formKey, setFormKey] = useState(0);
  const [ready, setReady] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  // Restore: a reading handed over from the home page, or the latest one this session.
  useEffect(() => {
    setTarget(document.getElementById('reading'));
    const pending = takePending();
    const saved = loadReadings();
    if (pending) {
      show(pending, true);
    } else if (saved[0]) {
      setHistory(saved);
      setInput(toInput(saved[0]));
    }
    setReady(true);
  }, []);

  const chart = useMemo(() => {
    if (!input) return null;
    try {
      return calculateChart(input.fullName, input.birthDate, { year: input.year, yRule: input.yRule });
    } catch {
      return null;
    }
  }, [input]);

  function show(next: ReadingInput, scroll: boolean) {
    setInput(next);
    setHistory(saveReading(next));
    if (scroll) {
      // Wait for the results to render, then move focus to the heading for screen-reader users.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const results = document.getElementById('reading');
          results?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          document.getElementById('results-title')?.focus({ preventScroll: true });
        }),
      );
    }
  }

  function onYearChange(year: number) {
    if (!input) return;
    const next = { ...input, year };
    setInput(next);
    setHistory(saveReading(next));
  }

  function onEdit() {
    setFormKey((k) => k + 1);
    const form = document.getElementById('calculator');
    form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById('calc-name')?.focus({ preventScroll: true }), 400);
  }

  function onClear() {
    clearReadings();
    setHistory([]);
    setInput(null);
    setFormKey((k) => k + 1);
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <div id="calculator" class="calc-card">
        <ReadingForm key={formKey} idPrefix="calc" initial={formKey === 0 && input ? input : undefined} onSubmit={(v) => show(v, true)} />
      </div>
      {ready && chart && input && target &&
        createPortal(
          <Results
            chart={chart}
            history={history}
            activeId={readingId(input)}
            onYearChange={onYearChange}
            onSelectReading={(r) => show(toInput(r), true)}
            onClearHistory={onClear}
            onEdit={onEdit}
            contactHref={contactHref}
          />,
          target,
        )}
    </>
  );
}

function toInput(r: SavedReading): ReadingInput {
  return { fullName: r.fullName, birthDate: r.birthDate, yRule: r.yRule, year: r.year };
}
