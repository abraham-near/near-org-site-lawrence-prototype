import { add, curve, project, px, rad, rotX, rotY, seg2, xf, type Attrs, type P2, type V3 } from "../geo";

// Identity option "seal" (D80, lab): a polished chrome seal hovering over a frosted glass disc, and in the glass
// beneath it the seal's impression, inlaid in green metal. One pattern, defined once here, makes both: the seal's face
// in raised chrome and the impression in green, in the same local (x, z) coordinates, so with the seal face-down over
// the disc they coincide exactly; the seal is tipped up to show its face, so the two read as mirror images. No three.js
// here: the vectors are drawn from the same numbers on the server.

const TAU = Math.PI * 2;

export const SEAL = {
  // the disc's frame: its centre in the world, tipped toward the camera (on top of the camera's 12°), so its top face
  // is seen at 28° and the impression reads clearly
  at: [0, -0.34, 0] as V3, tilt: rad(16),
  R: 1.1, thick: 0.07, // the disc: frosted glass, thin, with a chrome edge
  RP: 0.42, // the pattern's radius (the seal's face and the impression)
  inlay: 0.008, // how far the green inlay stands proud of the glass
  // the seal: its centre above the impression, on the disc's axis; tipped up about x (its face swings toward the
  // camera) and turned a little about the disc's axis, for a three-quarter view of its face and its grip grooves
  Rs: 0.5, H: 0.4, lift: 1.12, tip: rad(-64), yaw: rad(-24),
  bevel: 0.026, relief: 0.016, // the seal's edge chamfer, and how far its pattern stands from the face's recessed field
};

// ── The pattern, in units of RP (angles in degrees, counterclockwise as seen from above the impression). Engine-turned:
// - fine closed bands r(θ) = r + a·sin(kθ + ph) about a centre c: a plain rim, and a guilloché rosette of
//   twelve nine-lobed bands, each a twelfth of a lobe further round, interlacing into a lattice, set slightly off
//   centre;
// - an irregular ring of fine radial notches of three lengths, with gaps, like a cut index: unique to this seal and
//   with a handedness, so its mirror reads as a mirror;
// - a small off-centre boss.
// No letters, no N, no symbol. `z` lifts interlacing bands apart by a hair, so they never fight where they cross.
export type Band = { r: number; a: number; k: number; ph: number; w: number; c: readonly [number, number]; z: number };
export type Bar = { r0: number; r1: number; a: number; w: number };
const OFF = [0.05, 0.03] as const; // the rosette's centre, off the seal's axis
const notches = (): Bar[] => {
  let seed = 20241105;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const out: Bar[] = [];
  for (let i = 0; i < 64; i++) {
    const u = rnd();
    if (i >= 9 && i <= 12) continue; // one long gap, the mark's index
    if (u < 0.12) continue;
    const len = u < 0.55 ? 0.06 : u < 0.85 ? 0.1 : 0.16;
    out.push({ r0: 0.9 - len, r1: 0.9, a: i * 5.625, w: 0.02 });
  }
  return out;
};
export const PATTERN: { bands: Band[]; bars: Bar[]; dot: { r: number; c: readonly [number, number] } } = {
  bands: [
    { r: 0.965, a: 0, k: 0, ph: 0, w: 0.04, c: [0, 0], z: 0 },
    { r: 0.68, a: 0, k: 0, ph: 0, w: 0.016, c: [0, 0], z: 0 },
    ...Array.from({ length: 12 }, (_, i) => ({ r: 0.38, a: 0.2, k: 9, ph: (i * 360) / 12, w: 0.014, c: OFF, z: i + 1 })),
  ],
  bars: notches(),
  dot: { r: 0.08, c: OFF },
};

// ── Frames (three's nesting: the disc frame at `at` tipped by `tilt`; the seal at its centre `lift` up the disc's axis,
// turned by `yaw` about that axis, then tipped by `tip` about its own x)
export const discW = (v: V3): V3 => add(SEAL.at, rotX(v, SEAL.tilt));
export const sealW = (v: V3): V3 => discW(add([0, SEAL.lift, 0], rotY(rotX(v, SEAL.tip), SEAL.yaw)));
// a point of the pattern (radius in RP, angle in degrees) in the disc's or the seal's local frame, at height y
export const patPt = (r: number, a: number, y = 0): V3 => [r * SEAL.RP * Math.cos(rad(a)), y, -r * SEAL.RP * Math.sin(rad(a))];

// ── Screen outlines, to keep lines off the objects: convex hulls of projected rims
type Poly = P2[];
function hull(pts: P2[]): Poly {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: P2[] = [], up: P2[] = [];
  for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
}
// inside the outline, or within `m` px of it
function inside(poly: Poly, q: P2, m = 0) {
  let inn = true, near = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey) || 1;
    const s = (ex * (q[1] - a[1]) - ey * (q[0] - a[0])) / l; // signed distance (hull is counterclockwise in y-down px)
    if (s < 0) inn = false;
    const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * ex + (q[1] - a[1]) * ey) / (l * l)));
    near = Math.min(near, Math.hypot(q[0] - a[0] - ex * t, q[1] - a[1] - ey * t));
  }
  return inn || near < m;
}
const circle = (fn: (a: number) => V3, n = 96) => Array.from({ length: n }, (_, i) => px(fn((i / n) * TAU)));
const { R, thick, Rs, H, RP } = SEAL;
export const DISC_HULL = hull([
  ...circle((a) => discW([R * Math.cos(a), 0, R * Math.sin(a)])),
  ...circle((a) => discW([R * Math.cos(a), -thick, R * Math.sin(a)])),
]);
export const SEAL_HULL = hull([
  ...circle((a) => sealW([Rs * Math.cos(a), -H / 2, Rs * Math.sin(a)])),
  ...circle((a) => sealW([Rs * Math.cos(a), H / 2, Rs * Math.sin(a)])),
]);
export const IMP_HULL = hull(circle((a) => discW([RP * 1.02 * Math.cos(a), 0, RP * 1.02 * Math.sin(a)])));

// ── The pose: static for now (the seal at rest over its impression; it ignores slide and time); later it will carry
// the seal's lowering and lift
export type SealPose = { rest: true };
const REST: SealPose = { rest: true };
export const sealPose = (): SealPose => REST;

// The ticked horizon through the disc's centre, left out where it passes behind the glass
const C2 = px(SEAL.at);
export const SEAL_HORIZON = Math.round(C2[1] * 10) / 10;
export const SEAL_GAP = (() => {
  let a = Infinity, b = -Infinity;
  for (const q of DISC_HULL) { a = Math.min(a, q[0]); b = Math.max(b, q[0]); }
  return [a - 3, b + 3] as const;
})();

export function sealVectors(): Record<string, Attrs> {
  const offAll = (q: P2, m = 2) => !inside(SEAL_HULL, q, m) && !inside(IMP_HULL, q, m);
  // the orbit about the disc: a circle a little outside the rim at the disc's base, rolled a little off its plane (its
  // far side lower, so it stays behind the glass there); its far half under the canvas (only beside the glass), its
  // near half over it
  const orb = (a: number, s = 1): V3 => discW(rotX([1.36 * s * Math.cos(a), -thick - 0.03, 1.36 * s * Math.sin(a)], rad(-2.5)));
  const far = (_p: V3, q: { p: P2; z: number }) => q.z > project(SEAL.at).z && !inside(DISC_HULL, q.p, 1.5) && offAll(q.p);
  const near = (_p: V3, q: { p: P2; z: number }) => q.z <= project(SEAL.at).z && offAll(q.p);
  const orbit = (keep: typeof far) => curve((u) => orb(u * TAU), 260, keep);

  // the graduated arc on the rim: fine ticks just outside the disc's bottom edge (so they stay clear of the glass),
  // front right, every 3°, every fifth longer
  const rimPt = (a: number, s: number): V3 => discW([R * s * Math.cos(rad(a)), -thick, R * s * Math.sin(rad(a))]);
  let rimTicks = "";
  for (let a = 22, i = 0; a <= 88 + 1e-6; a += 3, i++) rimTicks += seg2(px(rimPt(a, 1.035)), px(rimPt(a, i % 5 === 0 ? 1.1 : 1.065)));
  const rimArc = curve((u) => rimPt(16 + u * 78, 1.035), 60);

  // the one registration mark: a small cross lying in the disc's plane at the impression's far edge, the axis's foot
  const mk = (a: number, r = 1.2): string => {
    const c = patPt(r, a), t: V3 = [-Math.sin(rad(a)), 0, -Math.cos(rad(a))], n: V3 = [Math.cos(rad(a)), 0, -Math.sin(rad(a))];
    const d = 0.05;
    return seg2(px(discW(add(c, n, -d))), px(discW(add(c, n, d)))) + seg2(px(discW(add(c, t, -d))), px(discW(add(c, t, d))));
  };

  // the registration axis: on screen the disc's axis through the impression's centre, from just under the seal down to
  // the far mark, where it stops (so it never crosses the green)
  const foot = px(discW(patPt(1.2, 90)));
  let top: P2 = px(discW([0, SEAL.lift, 0]));
  for (let i = 0; i <= 200; i++) {
    const q = px(discW([0, SEAL.lift * (1 - i / 200), 0]));
    if (!inside(SEAL_HULL, q, 5)) { top = q; break; }
  }
  return {
    orbitBack: { d: orbit(far) },
    orbitFront: { d: orbit(near) },
    rimTicks: { d: rimTicks },
    rimArc: { d: rimArc },
    marks: { d: mk(90) },
    axis: { d: seg2(top, foot) },
    axisGrad: { x1: top[0].toFixed(2), y1: top[1].toFixed(2), x2: foot[0].toFixed(2), y2: foot[1].toFixed(2) },
    axisTop: { transform: xf(top) },
    m0: { transform: xf(px(orb(rad(208)))) },
    m1: { transform: xf(px(orb(rad(-30)))) },
  };
}
