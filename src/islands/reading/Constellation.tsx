/**
 * "Your number constellation": the chart's numbers plotted on the nine-point
 * wheel and joined in order (Life Path → Expression → Soul Urge →
 * Personality → Birthday), so every chart draws its own unique shape.
 */
import { nonagramPath, wheelPoint } from '../../lib/geometry';
import { rootDigit } from '../../lib/numerology/reduce';
import type { NumerologyChart } from '../../lib/numerology/calculate';

const ABBR = {
  lifePath: 'LP',
  expression: 'EX',
  soulUrge: 'SU',
  personality: 'PE',
  birthday: 'BD',
} as const;

type Key = keyof typeof ABBR;
const ORDER: Key[] = ['lifePath', 'expression', 'soulUrge', 'personality', 'birthday'];

export default function Constellation({ chart }: { chart: NumerologyChart }) {
  const cx = 170;
  const cy = 170;
  const r = 118;

  const pts = ORDER.map((k) => ({ key: k, value: chart[k].value, root: rootDigit(chart[k].value), master: chart[k].isMaster }));
  const byRoot = new Map<number, typeof pts>();
  for (const p of pts) byRoot.set(p.root, [...(byRoot.get(p.root) ?? []), p]);
  const path = pts.map((p, i) => {
    const q = wheelPoint(p.root, r, cx, cy);
    return `${i === 0 ? 'M' : 'L'}${q.x} ${q.y}`;
  }).join(' ') + ' Z';
  const py = wheelPoint(chart.personalYear.value, r, cx, cy);

  const description = ORDER.map((k) => `${ABBR[k]} ${chart[k].value}`).join(', ');

  return (
    <figure class="constellation">
      <svg viewBox="0 0 340 340" role="img" aria-labelledby="constellation-title constellation-desc">
        <title id="constellation-title">Your number constellation</title>
        <desc id="constellation-desc">
          Your core numbers plotted on a nine-point wheel: {description}. Personal Year {chart.personalYear.value}.
        </desc>
        <circle class="c-orbit" cx={cx} cy={cy} r={r} />
        <circle class="c-orbit faint" cx={cx} cy={cy} r={r * 0.62} />
        <path class="c-star" d={nonagramPath(r, cx, cy)} />
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => {
          const p = wheelPoint(d, r, cx, cy);
          const t = wheelPoint(d, r + 26, cx, cy);
          const active = byRoot.has(d);
          return (
            <g key={d}>
              <circle class={`c-node${active ? ' is-active' : ''}`} cx={p.x} cy={p.y} r={active ? 5 : 2.4} />
              <text class={`c-digit${active ? ' is-active' : ''}`} x={t.x} y={t.y + 6} text-anchor="middle">{d}</text>
            </g>
          );
        })}
        <path class="c-shape" d={path} />
        <circle class="c-py" cx={py.x} cy={py.y} r="11" />
        {[...byRoot.entries()].map(([root, items]) => {
          const p = wheelPoint(root, r, cx, cy);
          const inward = wheelPoint(root, r - 26, cx, cy);
          return (
            <g key={root}>
              <circle class="c-glow" cx={p.x} cy={p.y} r={8 + items.length * 3} />
              <text class="c-label" x={inward.x} y={inward.y + 4} text-anchor="middle">
                {items.map((i) => ABBR[i.key]).join('·')}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption class="c-legend">
        {ORDER.map((k) => (
          <span key={k}>
            <b>{ABBR[k]}</b> {chart[k].value}
          </span>
        ))}
        <span class="c-legend-py">
          <i aria-hidden="true" /> Personal Year {chart.personalYear.value}
        </span>
      </figcaption>
    </figure>
  );
}
