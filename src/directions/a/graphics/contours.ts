// Procedural terrain contours for the survey sheet (research/dir-a.md §4): value noise in a few octaves, cut at even
// levels by marching squares, and the segments chained into polylines. Pure and seeded, so it runs on the server and
// ships as plain SVG paths. Spacing reads as slope, as on a swisstopo sheet.

const hash = (x: number, y: number, seed: number) => {
  const v = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return v - Math.floor(v);
};
const fade = (t: number) => t * t * (3 - 2 * t);
function noise(x: number, y: number, seed: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed), c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  const u = fade(xf), v = fade(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function field(x: number, y: number, seed: number) {
  let s = 0, amp = 1, f = 1, norm = 0;
  for (let o = 0; o < 4; o++) { s += noise(x * f, y * f, seed + o * 13) * amp; norm += amp; amp *= 0.5; f *= 2.03; }
  return s / norm;
}

export type ContourOpts = {
  w: number; h: number; cell?: number; scale?: number; levels?: number; seed?: number;
  // an optional bias added to the field at (x, y) in px: a summit or a basin under the drawing
  bias?: (x: number, y: number) => number;
};

export function contours({ w, h, cell = 12, scale = 260, levels = 9, seed = 3, bias }: ContourOpts) {
  const nx = Math.ceil(w / cell) + 1, ny = Math.ceil(h / cell) + 1;
  const v: number[] = new Array(nx * ny);
  let lo = Infinity, hi = -Infinity;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = i * cell, y = j * cell;
    const val = field(x / scale, y / scale, seed) + (bias ? bias(x, y) : 0);
    v[j * nx + i] = val; lo = Math.min(lo, val); hi = Math.max(hi, val);
  }
  const out: { level: number; d: string }[] = [];
  for (let k = 1; k <= levels; k++) {
    const iso = lo + ((hi - lo) * k) / (levels + 1);
    const segs: [number, number, number, number][] = [];
    const at = (i: number, j: number) => v[j * nx + i];
    const lerp = (a: number, b: number) => (iso - a) / (b - a);
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1);
      const code = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
      if (code === 0 || code === 15) continue;
      const x = i * cell, y = j * cell;
      const T = [x + lerp(a, b) * cell, y] as const, R = [x + cell, y + lerp(b, c) * cell] as const;
      const B = [x + lerp(d, c) * cell, y + cell] as const, L = [x, y + lerp(a, d) * cell] as const;
      const add = (p: readonly number[], q: readonly number[]) => segs.push([p[0], p[1], q[0], q[1]]);
      switch (code) {
        case 1: case 14: add(L, B); break;
        case 2: case 13: add(B, R); break;
        case 3: case 12: add(L, R); break;
        case 4: case 11: add(T, R); break;
        case 5: add(L, T); add(B, R); break;
        case 6: case 9: add(T, B); break;
        case 7: case 8: add(L, T); break;
        case 10: add(T, R); add(L, B); break;
      }
    }
    out.push({ level: k, d: chain(segs) });
  }
  return out;
}

// Join segments that share ends into polylines, so each contour is one path with few moves
function chain(segs: [number, number, number, number][]) {
  const key = (x: number, y: number) => `${Math.round(x * 10)},${Math.round(y * 10)}`;
  const ends = new Map<string, number[]>();
  segs.forEach((s, i) => {
    for (const k of [key(s[0], s[1]), key(s[2], s[3])]) ends.set(k, [...(ends.get(k) ?? []), i]);
  });
  const used = new Uint8Array(segs.length);
  const f = (n: number) => String(Math.round(n));
  let d = "";
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;
    used[i] = 1;
    const pts: [number, number][] = [[segs[i][0], segs[i][1]], [segs[i][2], segs[i][3]]];
    // grow forwards then backwards
    for (const dir of [1, -1]) {
      for (;;) {
        const tip = dir === 1 ? pts[pts.length - 1] : pts[0];
        const next = (ends.get(key(tip[0], tip[1])) ?? []).find((j) => !used[j]);
        if (next === undefined) break;
        used[next] = 1;
        const s = segs[next];
        const p: [number, number] = key(s[0], s[1]) === key(tip[0], tip[1]) ? [s[2], s[3]] : [s[0], s[1]];
        if (dir === 1) pts.push(p); else pts.unshift(p);
      }
    }
    if (pts.length < 4) continue; // drop specks
    d += `M${f(pts[0][0])} ${f(pts[0][1])}` + pts.slice(1).map((p) => `L${f(p[0])} ${f(p[1])}`).join("");
  }
  return d;
}
