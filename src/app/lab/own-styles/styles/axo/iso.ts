// True 30° isometric projection for the Axonometric style (D53). World x runs down-right, y down-left, z up; one world
// unit is one design unit on every axis. Every edge in the drawings is computed here, so the geometry stays true.

export type V3 = readonly [number, number, number];
export type Tone = "t" | "l" | "r"; // top, left-facing (+y) side, right-facing (+x) side

export const C = Math.cos(Math.PI / 6);
const rd = (n: number) => Math.round(n * 100) / 100;

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const neg = (a: V3): V3 => [-a[0], -a[1], -a[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const VIEW: V3 = [1, 1, 1]; // towards the viewer

// The projection of a direction (no origin)
const lin = (v: V3): [number, number] => [C * (v[0] - v[1]), 0.5 * (v[0] + v[1]) - v[2]];

export function makeIso(ox: number, oy: number) {
  const p = (v: V3): [number, number] => {
    const [x, y] = lin(v);
    return [rd(ox + x), rd(oy + y)];
  };
  // A path through world points
  const d = (vs: readonly V3[], close = true) =>
    vs.map((v, i) => `${i ? "L" : "M"}${p(v)[0]} ${p(v)[1]}`).join("") + (close ? "Z" : "");
  // The SVG matrix that lays a flat 2D drawing (u right, v down) onto a plane in the world: content drawn inside a
  // <g transform={m(...)}> lands on that face with true foreshortening
  const m = (o: V3, u: V3, v: V3) => {
    const [ux, uy] = lin(u);
    const [vx, vy] = lin(v);
    const [ex, ey] = p(o);
    return `matrix(${rd(ux * 1e4) / 1e4} ${rd(uy * 1e4) / 1e4} ${rd(vx * 1e4) / 1e4} ${rd(vy * 1e4) / 1e4} ${ex} ${ey})`;
  };
  return { p, d, m };
}
export type Iso = ReturnType<typeof makeIso>;

const toneOf = (n: V3): Tone => {
  const [x, y, z] = n.map(Math.abs);
  return z >= x && z >= y ? "t" : x >= y ? "r" : "l";
};

function hull(pts: [number, number][]) {
  const s = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const turn = (o: [number, number], a: [number, number], b: [number, number]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [];
  for (const q of s) { while (lo.length >= 2 && turn(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  const hi: [number, number][] = [];
  for (const q of [...s].reverse()) { while (hi.length >= 2 && turn(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
  const h = [...lo.slice(0, -1), ...hi.slice(0, -1)];
  return h.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("") + "Z";
}

export type Solid = {
  sides: { d: string; tone: Tone }[]; // visible side faces, far to near
  edges: string; // sharp edges between visible faces
  outline: string; // the silhouette (convex solids) or every visible side's outline
  cap: { d: string; tone: Tone };
};

// A prism: the polygon `base` swept along `e`. Visible faces only, with flat tones by facing and true hairline edges.
export function prism(iso: Iso, base: readonly V3[], e: V3, convex = true): Solid {
  const n = base.length;
  const top = base.map((v) => add(v, e));
  // Newell's normal of the base polygon
  let nn: V3 = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    const a = base[i], b = base[(i + 1) % n];
    nn = add(nn, [(a[1] - b[1]) * (a[2] + b[2]), (a[2] - b[2]) * (a[0] + b[0]), (a[0] - b[0]) * (a[1] + b[1])]);
  }
  const topOut = dot(nn, e) > 0 ? nn : neg(nn);
  const topSeen = dot(topOut, VIEW) > 0;
  const capPts = topSeen ? top : base;
  const cen = base.reduce<V3>((s, v) => add(s, v), [0, 0, 0]).map((c) => c / n) as unknown as V3;
  const sides = base.map((a, i) => {
    const b = base[(i + 1) % n];
    let sn = cross(sub(b, a), e);
    const mid: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    if (dot(sn, sub(mid, cen)) < 0) sn = neg(sn);
    const l = len(sn) || 1;
    const unit: V3 = [sn[0] / l, sn[1] / l, sn[2] / l];
    const quad = [a, b, add(b, e), add(a, e)];
    return { quad, n: unit, seen: dot(unit, VIEW) > 1e-6, depth: dot(add(a, b), VIEW) };
  });
  const seen = sides.filter((s) => s.seen).sort((a, b) => a.depth - b.depth);
  let edges = "";
  for (let i = 0; i < n; i++) {
    const s0 = sides[(i - 1 + n) % n], s1 = sides[i];
    if (s0.seen && s1.seen && dot(s0.n, s1.n) < Math.cos((25 * Math.PI) / 180)) edges += iso.d([base[i], add(base[i], e)], false);
  }
  const outline = convex
    ? hull([...base, ...top].map(iso.p))
    : seen.map((s) => iso.d(s.quad)).join("");
  return {
    sides: seen.map((s) => ({ d: iso.d(s.quad), tone: toneOf(s.n) })),
    edges,
    outline,
    cap: { d: iso.d(capPts), tone: toneOf(topOut) },
  };
}

// 2D helpers for footprints, mapped into a world plane
export const plane = (o: V3, u: V3, v: V3) => (pts: [number, number][]): V3[] =>
  pts.map(([a, b]) => [o[0] + a * u[0] + b * v[0], o[1] + a * u[1] + b * v[1], o[2] + a * u[2] + b * v[2]]);

export function rrect(x: number, y: number, w: number, h: number, r: number, seg = 5): [number, number][] {
  const pts: [number, number][] = [];
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -90], [x + w - r, y + h - r, 0], [x + r, y + h - r, 90], [x + r, y + r, 180],
  ];
  for (const [cx, cy, a0] of corners)
    for (let k = 0; k <= seg; k++) {
      const a = ((a0 + (90 * k) / seg) * Math.PI) / 180;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  return pts;
}

// A horizontal circle's projection: an axis-aligned ellipse
export const ELL = { rx: Math.SQRT2 * C, ry: Math.SQRT2 * 0.5 };
