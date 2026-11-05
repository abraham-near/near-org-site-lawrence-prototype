// Plexus's pieces (D53): the hero layer's vocabulary, static. Long tracked lines that fade along their length towards a
// distant point, and dust rising off an object, each mote tied back to where it rose from by a line that fades as it
// lengthens. Lines fade by stepping their strength down along their length: a fixed fade, never a light running along.

export type Pt = [number, number];
export type Seg = { d: string; o: number };

// A line from a to b whose strength falls from `o0` at a to `o1` at b, as short steps (one path per step strength)
export function fade(a: Pt, b: Pt, o0: number, o1 = 0, steps = 12): Seg[] {
  return Array.from({ length: steps }, (_, k) => {
    const t0 = k / steps, t1 = (k + 1) / steps;
    const p = (t: number) => `${(a[0] + (b[0] - a[0]) * t).toFixed(2)} ${(a[1] + (b[1] - a[1]) * t).toFixed(2)}`;
    return { d: `M${p(t0)}L${p(t1)}`, o: o0 + (o1 - o0) * ((t0 + t1) / 2) };
  });
}

// Dust rising off a point: motes up and away, each joined back to the origin by a line that is fainter the longer it
// is; the first three motes are also joined to each other, a faint triangle
export function rise(from: Pt, motes: Pt[], strength = 0.55) {
  const lines: Seg[] = [], dots: { x: number; y: number; r: number; o: number }[] = [];
  motes.forEach(([x, y], i) => {
    const len = Math.hypot(x - from[0], y - from[1]);
    const o = strength * Math.max(0.2, 1 - len / 70);
    lines.push(...fade(from, [x, y], o, o * 0.35, 8));
    dots.push({ x, y, r: i === 0 ? 1.3 : 0.9, o: Math.min(1, o + 0.3) });
  });
  if (motes.length >= 3) [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => lines.push(...fade(motes[i], motes[j], strength * 0.32, strength * 0.32, 1)));
  return { lines, dots };
}

// The owned point's ring of ticks
export const ticks = (r0: number, r1: number, n = 12) =>
  Array.from({ length: n }, (_, k) => {
    const a = (2 * Math.PI * k) / n, c = Math.cos(a), s = Math.sin(a);
    return `M${(r0 * c).toFixed(2)} ${(r0 * s).toFixed(2)}L${(r1 * c).toFixed(2)} ${(r1 * s).toFixed(2)}`;
  }).join("");
