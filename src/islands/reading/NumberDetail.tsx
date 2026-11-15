import type { CoreNumber } from '../../lib/numerology/calculate';
import { NUMBER_MEANINGS, type PositionKey } from '../../data/numbers';
import { POSITIONS } from '../../data/positions';
import { masterLabel } from '../../lib/format';
import NumberRing from './NumberRing';

interface Props {
  number: CoreNumber & { key: PositionKey };
  id: string;
  labelledBy: string;
  active: boolean;
}

/** The full interpretation of one core number (one tab panel). */
export default function NumberDetail({ number, id, labelledBy, active }: Props) {
  const m = NUMBER_MEANINGS[number.value];
  const pos = POSITIONS[number.key];

  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} class={`tab-panel${active ? ' is-active' : ''}`} tabIndex={0}>
      <div class="detail-head">
        <NumberRing value={number.value} isMaster={number.isMaster} size={148} tone="paper" caption={number.isMaster ? masterLabel(number.value) : undefined} />
        <div class="detail-intro">
          <p class="eyebrow">
            {pos.name} number{pos.alsoKnownAs ? ` · ${pos.alsoKnownAs}` : ''}
          </p>
          <h3 class="detail-title">
            {number.value} · {m.title}
            {number.isMaster && <span class="badge-master">Master number</span>}
          </h3>
          <ul class="chips" aria-label="Keywords">
            {m.keywords.map((k) => (
              <li key={k} class="chip">
                {k}
              </li>
            ))}
          </ul>
          <p class="detail-position">{m.positions[number.key]}</p>
        </div>
      </div>

      <div class="detail-body">
        <section class="detail-block span-2">
          <h4>What {number.value} represents</h4>
          <p>{m.essence}</p>
          <p>{m.traits}</p>
        </section>

        <section class="detail-block">
          <h4>Strengths</h4>
          <ul class="mark-list plus">
            {m.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        <section class="detail-block">
          <h4>Challenges</h4>
          <ul class="mark-list minus">
            {m.challenges.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section class="detail-block">
          <h4>Relationships &amp; social life</h4>
          <p>{m.relationships}</p>
        </section>
        <section class="detail-block">
          <h4>Career &amp; work</h4>
          <p>{m.career}</p>
          <ul class="chips" aria-label="Fields traditionally associated with this number">
            {m.careerPaths.map((c) => (
              <li key={c} class="chip">
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section class="detail-block span-2 growth">
          <h4>Personal growth</h4>
          <ol class="growth-list">
            {m.growth.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ol>
          <blockquote class="reflection">
            <span class="eyebrow">Reflect</span>
            <p>{m.reflection}</p>
          </blockquote>
        </section>
      </div>

      <details class="working">
        <summary>How your {pos.name} number was calculated</summary>
        <p class="small muted">{pos.method}</p>
        <table class="working-table">
          <tbody>
            {number.working.map((w, i) => (
              <tr key={i} class={i === number.working.length - 1 && number.working.length > 1 ? 'is-total' : ''}>
                <th scope="row">{w.label}</th>
                <td>{w.detail}</td>
                <td class="working-result">{w.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {number.note && <p class="small working-note">{number.note}</p>}
      </details>
    </div>
  );
}
