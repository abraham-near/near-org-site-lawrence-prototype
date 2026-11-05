// Stipple's dot engine (D53): volumes rendered as fields of dots, the way Tempo's dotted globe is. Each surface is
// sampled evenly in its own (world) units, so dots crowd together where a surface turns away from you, and each dot's
// size and strength come from how the surface faces the light: lit faces fade cleanly to nothing (dots shrink and fade,
// never a scatter of single specks), turned and shadowed faces fill in. Solids are composed back to front, each one
// clearing the dots behind its silhouette. Everything is deterministic (seeded) and drawn as a few paths.

export type V3 = [number, number, number];
export type Pt = [number, number];
export type Dot = [x: number, y: number, r: number, o: number];

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const norm = ([x, y, z]: V3): V3 => { const l = Math.hypot(x, y, z) || 1; return [x / l, y / l, z / l]; };
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The light, in view space: from the upper left, in front
const LIGHT = norm([-0.5, 0.62, 0.6]);

// An orthographic camera: turn the world by `yaw` about its vertical axis, tip it towards you by `pitch` (so tops show),
// and centre it at (cx, cy) on the 240 × 180 box. World y is up; z comes towards you
export type Cam = { view: (p: V3) => V3; proj: (p: V3) => Pt };
export function camera(yawDeg: number, pitchDeg: number, cx: number, cy: number): Cam {
  const a = (yawDeg * Math.PI) / 180, b = (pitchDeg * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  const view = ([x, y, z]: V3): V3 => {
    const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
    return [x1, y * cb - z1 * sb, y * sb + z1 * cb];
  };
  return { view, proj: (p) => { const v = view(p); return [cx + v[0], cy - v[1]]; } };
}

// What a tone function is told about each sample
export type Here = { lit: number; edge: number; u: number; v: number; back: boolean };
export type Surface = {
  P: (u: number, v: number) => V3; // its points; cross(∂u, ∂v) points out of the solid
  u: [number, number];
  v: [number, number];
  tone: (h: Here) => number;
  step?: number;
  mask?: (u: number, v: number) => boolean; // samples to keep
  edge?: (u: number, v: number) => number; // distance to its edge (defaults to the parameter rectangle's)
  twoSided?: boolean; // its back shows (a sheet), rather than being culled
  move?: (x: number, y: number, u: number, v: number) => Pt | null; // displace a dot on screen, or drop it
};

export const STEP = 2.3;
// A dot's size and strength from its tone: the faintest dots are small and faint, so a fade is smooth
export const ink = (x: number, y: number, t: number): Dot | null => (t < 0.035 ? null : [x, y, 0.3 + 0.62 * clamp(t), clamp(t / 0.32)]);

// Sample one surface: its dots, and every sample's screen point (for the solid's silhouette)
export function surface(cam: Cam, s: Surface): { dots: Dot[]; pts: Pt[] } {
  const step = s.step ?? STEP, dots: Dot[] = [], pts: Pt[] = [];
  const [u0, u1] = s.u, [v0, v1] = s.v, h = 0.01;
  const row = step * 0.866;
  for (let j = 0, v = v0 + row / 2; v < v1; j++, v += row) {
    for (let u = u0 + (j & 1 ? step : step / 2); u < u1; u += step) {
      if (s.mask && !s.mask(u, v)) continue;
      const p = s.P(u, v), [x, y] = cam.proj(p);
      pts.push([x, y]);
      let n = cam.view(norm(cross(sub(s.P(u + h, v), p), sub(s.P(u, v + h), p))));
      let back = false;
      if (n[2] < 0) { if (!s.twoSided) continue; n = [-n[0], -n[1], -n[2]]; back = true; }
      const edge = s.edge ? s.edge(u, v) : Math.min(u - u0, u1 - u, v - v0, v1 - v);
      const d = ink(x, y, s.tone({ lit: Math.max(0, dot3(n, LIGHT)), edge, u, v, back }));
      if (!d) continue;
      const m = s.move ? s.move(x, y, u, v) : [x, y];
      if (m) dots.push([m[0], m[1], d[2], d[3]]);
    }
  }
  return { dots, pts };
}

// The convex hull of points (monotone chain)
export function hull(pts: Pt[]): Pt[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const turn = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], hi: Pt[] = [];
  for (const q of p) { while (lo.length > 1 && turn(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (hi.length > 1 && turn(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)];
}
export const inside = (poly: Pt[], x: number, y: number) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

// A solid: its dots by colour, and the outline it covers what is behind with
export type Tone = "ink" | "green" | "deep" | "faint";
export type Solid = { dots: Partial<Record<Tone, Dot[]>>; cover: Pt[] };
export function solid(cam: Cam, surfaces: Surface[], tone: Tone = "ink", extra: Pt[] = []): Solid {
  const dots: Dot[] = [], pts: Pt[] = [...extra];
  for (const s of surfaces) { const r = surface(cam, s); dots.push(...r.dots); pts.push(...r.pts); }
  return { dots: { [tone]: dots }, cover: hull(pts) };
}
// Back to front: each solid clears the dots of those before it inside its outline
export function compose(solids: Solid[]): Solid[] {
  return solids.map((s, i) => {
    const later = solids.slice(i + 1).map((l) => l.cover).filter((c) => c.length > 2);
    const keep = (d: Dot) => !later.some((c) => inside(c, d[0], d[1]));
    const dots: Solid["dots"] = {};
    for (const k of Object.keys(s.dots) as Tone[]) dots[k] = s.dots[k]!.filter(keep);
    return { dots, cover: s.cover };
  });
}

// Many dots as paths, one per colour and strength (stepped to tenths)
export function paths(dots: Dot[]): { o: number; d: string }[] {
  const by = new Map<number, string>();
  for (const [x, y, r, o] of dots) {
    const k = Math.max(1, Math.round(o * 10)), R = r.toFixed(2);
    by.set(k, (by.get(k) ?? "") + `M${(x - r).toFixed(2)} ${y.toFixed(2)}a${R} ${R} 0 1 0 ${(2 * r).toFixed(2)} 0a${R} ${R} 0 1 0 ${(-2 * r).toFixed(2)} 0`);
  }
  return [...by].map(([k, d]) => ({ o: k / 10, d }));
}
export const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}z`;

// The affine map of a plane (origin, unit axes along it) onto the screen, for crisp type and shapes drawn on it
export function plane(cam: Cam, o: V3, ux: V3, uy: V3) {
  const [ox, oy] = cam.proj(o), [ax, ay] = cam.proj([o[0] + ux[0], o[1] + ux[1], o[2] + ux[2]]), [bx, by] = cam.proj([o[0] + uy[0], o[1] + uy[1], o[2] + uy[2]]);
  return `matrix(${(ax - ox).toFixed(4)} ${(ay - oy).toFixed(4)} ${(bx - ox).toFixed(4)} ${(by - oy).toFixed(4)} ${ox.toFixed(2)} ${oy.toFixed(2)})`;
}
