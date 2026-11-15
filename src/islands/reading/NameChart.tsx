import type { NumerologyChart } from '../../lib/numerology/calculate';
import { KARMIC_LESSONS } from '../../data/cycles';

/**
 * The name, letter by letter, plus the inclusion grid (how often each number
 * appears in the name) and any karmic lessons (missing numbers).
 */
export default function NameChart({ chart }: { chart: NumerologyChart }) {
  const max = Math.max(...Object.values(chart.inclusion), 1);
  return (
    <div class="name-chart">
      <div class="letters-wrap">
        <h4>Your name in numbers</h4>
        <p class="small muted">
          Vowels (<span class="key-vowel">gold</span>) form your Soul Urge; consonants form your Personality; together they make your
          Expression.
        </p>
        <div class="letters" role="list">
          {chart.nameParts.map((part, pi) => (
            <div key={pi} class="letter-word" role="listitem" aria-label={`${part.text}: ${part.letters.map((l) => `${l.char} ${l.value}`).join(', ')}`}>
              {part.letters.map((l, li) => (
                <span key={li} class={`letter${l.isVowel ? ' is-vowel' : ''}`} aria-hidden="true">
                  <span class="letter-char">{l.char}</span>
                  <span class="letter-val">{l.value}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div class="inclusion">
        <h4>Inclusion grid</h4>
        <p class="small muted">How many letters of your name carry each number.</p>
        <div class="inclusion-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            const count = chart.inclusion[n];
            return (
              <div key={n} class={`inc-cell${count === 0 ? ' is-missing' : ''}`} style={{ '--inc': count / max }}>
                <span class="inc-num">{n}</span>
                <span class="inc-count">
                  {count === 0 ? 'missing' : `× ${count}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div class="lessons">
        <h4>{chart.missingNumbers.length ? 'Karmic lessons' : 'No karmic lessons'}</h4>
        {chart.missingNumbers.length ? (
          <>
            <p class="small muted">Numbers missing from a name are traditionally read as qualities to develop consciously.</p>
            <ul class="lesson-list">
              {chart.missingNumbers.map((n) => (
                <li key={n}>
                  <span class="lesson-num">{n}</span>
                  <span>{KARMIC_LESSONS[n]}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p class="small">Every number from 1 to 9 appears in your name — traditionally a sign of well-rounded inner resources.</p>
        )}
      </div>
    </div>
  );
}
