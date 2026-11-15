import { useRef, useState } from 'preact/hooks';
import type { BirthDate } from '../../lib/numerology/calculate';
import type { YRule } from '../../lib/numerology/letters';
import { validateBirthDate, validateName } from '../../lib/numerology/validation';
import { MONTH_NAMES } from '../../data/cycles';

export interface ReadingInput {
  fullName: string;
  birthDate: BirthDate;
  yRule: YRule;
  year: number;
}

interface Props {
  initial?: Partial<ReadingInput>;
  onSubmit: (input: ReadingInput) => void;
  compact?: boolean;
  submitLabel?: string;
  idPrefix?: string;
}

type Errors = Partial<Record<'name' | 'date', string>>;

export default function ReadingForm({ initial, onSubmit, compact = false, submitLabel = 'Reveal my numbers', idPrefix = 'rf' }: Props) {
  const thisYear = new Date().getFullYear();
  const [name, setName] = useState(initial?.fullName ?? '');
  const [day, setDay] = useState(initial?.birthDate ? String(initial.birthDate.day) : '');
  const [month, setMonth] = useState(initial?.birthDate ? String(initial.birthDate.month) : '');
  const [year, setYear] = useState(initial?.birthDate ? String(initial.birthDate.year) : '');
  const [yRule, setYRule] = useState<YRule>(initial?.yRule ?? 'auto');
  const [readingYear, setReadingYear] = useState(initial?.year ?? thisYear);
  const [errors, setErrors] = useState<Errors>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const id = (s: string) => `${idPrefix}-${s}`;

  function handleSubmit(e: Event) {
    e.preventDefault();
    const n = validateName(name);
    const d = validateBirthDate(day.trim(), month, year.trim());
    const next: Errors = {};
    if (!n.ok) next.name = n.error;
    if (!d.ok) next.date = d.error;
    setErrors(next);
    if (!n.ok) return nameRef.current?.focus();
    if (!d.ok) return dayRef.current?.focus();
    onSubmit({ fullName: n.value!, birthDate: d.value!, yRule, year: readingYear });
  }

  const describedName = [id('name-hint'), errors.name ? id('name-error') : ''].filter(Boolean).join(' ');
  const describedDate = errors.date ? id('date-error') : undefined;

  return (
    <form class={`reading-form${compact ? ' is-compact' : ''}`} onSubmit={handleSubmit} noValidate>
      <div class="field">
        <label for={id('name')}>Full name at birth</label>
        <input
          ref={nameRef}
          id={id('name')}
          class="input"
          type="text"
          name="fullName"
          autocomplete="name"
          autocapitalize="words"
          spellcheck={false}
          placeholder="e.g. Asha Priya Mehta"
          value={name}
          maxLength={120}
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={describedName}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
        />
        <p id={id('name-hint')} class="hint">
          Include middle names, written in English letters, as on your birth certificate.
        </p>
        {errors.name && (
          <p id={id('name-error')} class="field-error" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <fieldset class="field date-field" aria-describedby={describedDate}>
        <legend>Date of birth</legend>
        <div class="date-grid">
          <div class="date-part">
            <label class="date-label" for={id('day')}>Day</label>
            <input
              ref={dayRef}
              id={id('day')}
              class="input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autocomplete="bday-day"
              placeholder="DD"
              maxLength={2}
              value={day}
              aria-invalid={errors.date ? 'true' : undefined}
              onInput={(e) => setDay((e.target as HTMLInputElement).value.replace(/\D/g, ''))}
            />
          </div>
          <div class="date-part date-month">
            <label class="date-label" for={id('month')}>Month</label>
            <select
              id={id('month')}
              class="select"
              autocomplete="bday-month"
              value={month}
              aria-invalid={errors.date ? 'true' : undefined}
              onChange={(e) => setMonth((e.target as HTMLSelectElement).value)}
            >
              <option value="">Month</option>
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={String(i + 1)}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div class="date-part">
            <label class="date-label" for={id('year')}>Year</label>
            <input
              id={id('year')}
              class="input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autocomplete="bday-year"
              placeholder="YYYY"
              maxLength={4}
              value={year}
              aria-invalid={errors.date ? 'true' : undefined}
              onInput={(e) => setYear((e.target as HTMLInputElement).value.replace(/\D/g, ''))}
            />
          </div>
        </div>
        {errors.date && (
          <p id={id('date-error')} class="field-error" role="alert">
            {errors.date}
          </p>
        )}
      </fieldset>

      {!compact && (
        <details class="form-options">
          <summary>Reading options</summary>
          <div class="options-grid">
            <div class="field">
              <label for={id('py-year')}>Personal Year for</label>
              <select
                id={id('py-year')}
                class="select"
                value={String(readingYear)}
                onChange={(e) => setReadingYear(Number((e.target as HTMLSelectElement).value))}
              >
                {Array.from({ length: 8 }, (_, i) => thisYear - 2 + i).map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                    {y === thisYear ? ' (this year)' : y === thisYear + 1 ? ' (next year)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <fieldset class="field">
              <legend>The letter Y</legend>
              <div class="radio-row">
                {(
                  [
                    ['auto', 'Automatic'],
                    ['vowel', 'Always a vowel'],
                    ['consonant', 'Always a consonant'],
                  ] as [YRule, string][]
                ).map(([value, label]) => (
                  <label key={value} class="radio">
                    <input type="radio" name={id('y')} value={value} checked={yRule === value} onChange={() => setYRule(value)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <p class="hint">
                Automatic counts Y as a consonant before a vowel (Maya, Priya) and as a vowel otherwise (Lynn, Vijay).
              </p>
            </fieldset>
          </div>
        </details>
      )}

      <div class="form-actions">
        <button class="btn btn-gold" type="submit">
          {submitLabel}
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 2l1.6 5.2L17 9l-5.4 1.8L10 16l-1.6-5.2L3 9l5.4-1.8z" fill="currentColor" />
          </svg>
        </button>
        <p class="privacy-note">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 2l6 2.5v4.7c0 4-2.6 7-6 8.8-3.4-1.8-6-4.8-6-8.8V4.5z" fill="none" stroke="currentColor" stroke-width="1.4" />
          </svg>
          Calculated privately in your browser — your details are never sent anywhere.
        </p>
      </div>
    </form>
  );
}
