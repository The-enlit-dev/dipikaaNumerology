/** Helpers for the circular "number wheel" visuals (nine points around a circle). */

export interface Point {
  x: number;
  y: number;
}

/**
 * Position of digit 1–9 on a nine-point wheel, with 9 at the top and the
 * digits running clockwise (the traditional arrangement of the nine-point circle).
 */
export function wheelPoint(digit: number, radius: number, cx = 0, cy = 0): Point {
  const index = digit % 9; // 9 (or 0) → top
  const angle = (index / 9) * Math.PI * 2 - Math.PI / 2;
  return { x: round(cx + radius * Math.cos(angle)), y: round(cy + radius * Math.sin(angle)) };
}

export function round(n: number, places = 2): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

/** Points of a nine-pointed star {9/4}, as an SVG path. */
export function nonagramPath(radius: number, cx = 0, cy = 0, step = 4): string {
  const pts: Point[] = [];
  for (let i = 0; i < 9; i++) pts.push(wheelPoint((i * step) % 9, radius, cx, cy));
  return `M${pts.map((p) => `${p.x} ${p.y}`).join(' L')} Z`;
}
