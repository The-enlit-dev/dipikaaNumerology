/**
 * Circular number visualisation.
 *
 * Nine small points sit around a ring like the nine-point wheel (9 at the
 * top, digits running clockwise). A gold arc travels from the top to the
 * number's root position, so each number has its own recognisable shape.
 * Master numbers get a second inner ring.
 */
import { wheelPoint } from '../../lib/geometry';
import { rootDigit } from '../../lib/numerology/reduce';
import './number-ring.css';

interface Props {
  value: number;
  isMaster?: boolean;
  size?: number;
  /** Small caption under the number inside the ring (e.g. "11/2"). */
  caption?: string;
  /** Visual theme. */
  tone?: 'night' | 'paper';
  animate?: boolean;
  /** Accessible label; if omitted the ring is decorative. */
  label?: string;
}

const R = 50;
const C = 2 * Math.PI * R;

export default function NumberRing({
  value,
  isMaster = false,
  size = 120,
  caption,
  tone = 'night',
  animate = true,
  label,
}: Props) {
  const root = rootDigit(value);
  const fraction = (root === 9 ? 9 : root % 9) / 9;
  const dash = C * fraction;
  const end = wheelPoint(root, R, 60, 60);
  const big = value >= 10;

  return (
    <svg
      class={`number-ring tone-${tone}${animate ? ' is-animated' : ''}${isMaster ? ' is-master' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      focusable="false"
    >
      <circle class="nr-track" cx="60" cy="60" r={R} />
      <circle
        class="nr-arc"
        cx="60"
        cy="60"
        r={R}
        style={{ '--nr-dash': `${dash}`, '--nr-circ': `${C}`, strokeDasharray: `${dash} ${C}` }}
        transform="rotate(-90 60 60)"
      />
      {isMaster && <circle class="nr-master" cx="60" cy="60" r={R - 7} />}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => {
        const p = wheelPoint(d, R, 60, 60);
        return <circle key={d} class={`nr-dot${d === root ? ' is-on' : ''}`} cx={p.x} cy={p.y} r={d === root ? 3.4 : 1.5} />;
      })}
      <circle class="nr-halo" cx={end.x} cy={end.y} r="7" />
      <text class="nr-value" x="60" y={caption ? 66 : 70} text-anchor="middle" font-size={big ? 38 : 46}>
        {value}
      </text>
      {caption && (
        <text class="nr-caption" x="60" y="86" text-anchor="middle">
          {caption}
        </text>
      )}
    </svg>
  );
}
