import { curve, px, rad, rotX, rotY, seg2, xf, type Attrs, type P2, type V3 } from "../geo";

// Identity option "bezel" (D80, lab): a watchmaker's piece in a gentle three-quarter. Numbers only (no three.js), so
// the server draws the rest state's vectors from the same geometry the WebGL scene renders.
//
// In the piece's own frame z points out of its face and angles run anticlockwise from 3 o'clock, as seen from the
// front. From the outside in:
// - the case: a fixed polished ring with a rounded top, its index (a fine raised chrome bar) at 12 o'clock;
// - the bezel, which turns: a fluted polished collar round a thin, flat frosted glass ring, the glass carrying fine
//   chrome graduations (every 3°, longer every 15°, one click) and a polished bead at its zero; behind the glass two
//   fine chrome rings, which the frost blurs;
// - a thin polished ring and a turned chrome hub;
// - set in the hub, a small domed green jewel (the account), the only green part.
// At rest the bezel has been turned exactly one click clockwise, so its zero sits one step past the index.
export const BEZEL = {
  tilt: rad(32), // the face tipped back from facing the camera (its top away)
  yaw: rad(16), // and turned a little to the right: a gentle three-quarter
  scale: 0.9, // the whole piece, in the slot
  step: rad(15), // one click
  ticks: 120, // graduations round the bezel (every 3°); every fifth is a click
  case: { rIn: 0.97, rOut: 1.06, zBot: -0.08, zTop: -0.004 },
  index: { r0: 0.992, r1: 1.05, w: 0.012, h: 0.034 },
  collar: { rIn: 0.945, rOut: 0.984, zBot: -0.05, zTop: 0.05, flutes: 120, depth: 0.009 },
  glass: { rIn: 0.37, rOut: 0.952, zBot: 0, zTop: 0.034 },
  back: [{ r: 0.53, tube: 0.012 }, { r: 0.74, tube: 0.02 }], // chrome rings behind the glass, at z = back.z
  backZ: -0.075,
  grad: { r1: 0.928, minor: 0.898, major: 0.86, wMinor: 0.0072, wMajor: 0.011, h: 0.005 },
  zero: { r: 0.893, bead: 0.024 },
  ring: { r: 0.362, tube: 0.012, z: 0.026 },
  hub: { r: 0.352 },
  jewel: { r: 0.13, h: 0.085, z: 0.03 }, // a domed cabochon: base radius, height, base height
};
const PITCH = -(rad(12) + BEZEL.tilt); // the camera's elevation, so +z faces the lens, then the tilt
export const BEZEL_FRAME = { x: PITCH, y: BEZEL.yaw };

// The piece's frame → world (three: scale, then rotation.y, then rotation.x: Rx · Ry · S · v)
export const toWorld = (p: V3): V3 => rotX(rotY([p[0] * BEZEL.scale, p[1] * BEZEL.scale, p[2] * BEZEL.scale], BEZEL.yaw), PITCH);
const pt = (r: number, a: number, z = 0): V3 => [r * Math.cos(a), r * Math.sin(a), z];
const at = (r: number, deg: number, z = 0): P2 => px(toWorld(pt(r, rad(deg), z)));

export type BezelPose = { turn: number };
// Static: the bezel one click clockwise of the index (later it clicks round on arrival and settles)
export const bezelPose = (): BezelPose => ({ turn: -BEZEL.step });

// The vectors, in the piece's plane (z = 0, about mid-depth): all outside the case, so nothing crosses the glass, the
// metal or the green disc
const V = { lead: 1.09, arc: 1.3, read: 1.47, scale: 1.14 };
export function bezelVectors({ turn }: BezelPose): Record<string, Attrs> {
  const idx = 90, zero = 90 + (turn * 180) / Math.PI; // degrees: the index at 12 o'clock, the zero one click clockwise
  const arc = (r: number, a0: number, a1: number, n = 60) => curve((u) => toWorld(pt(r, rad(a0 + u * (a1 - a0)))), n);

  // the step: a graduated arc from the index to the zero, ticks every 1.5° (the ends longer), an arrowhead at the zero
  let stepTicks = "";
  const n = Math.round((idx - zero) / 1.5);
  for (let i = 0; i <= n; i++) {
    const a = idx + ((zero - idx) * i) / n, end = i === 0 || i === n;
    stepTicks += seg2(at(V.arc, a), at(V.arc + (end ? 0.075 : i % 5 === 0 ? 0.05 : 0.03), a));
  }
  const stepFrom = at(V.arc, idx), stepTo = at(V.arc, zero);

  // the construction circle round the rest of the way, a hair apart from the step at each end
  const ring = arc(V.arc, idx + 3, zero + 360 - 3, 240);

  // a fine scale low on the left, just outside the case: every 3°, longer every 15°
  let scale = "";
  for (let a = 201, i = 0; a <= 255; a += 3, i++) scale += seg2(at(V.scale, a), at(V.scale + (i % 5 === 0 ? 0.06 : 0.032), a));

  const idxEnd = at(V.read, idx), idxStart = at(V.lead, idx);
  return {
    ring: { d: ring },
    stepArc: { d: arc(V.arc, idx, zero, 24) },
    stepGrad: { x1: stepFrom[0].toFixed(2), y1: stepFrom[1].toFixed(2), x2: stepTo[0].toFixed(2), y2: stepTo[1].toFixed(2) },
    stepTicks: { d: stepTicks },
    zeroDot: { transform: xf(stepTo) },
    idxLine: { d: seg2(idxStart, idxEnd) },
    idxGrad: { x1: idxStart[0].toFixed(2), y1: idxStart[1].toFixed(2), x2: idxEnd[0].toFixed(2), y2: idxEnd[1].toFixed(2) },
    idxDot: { transform: xf(idxEnd) },
    zeroLine: { d: seg2(at(V.lead, zero), at(V.arc - 0.012, zero)) },
    scale: { d: scale },
    scaleArc: { d: arc(V.scale, 196, 262, 40) },
    mk0: { transform: xf(at(V.arc, 214)) },
    mk1: { transform: xf(at(V.arc, 326)) },
    mk2: { transform: xf(at(V.scale + 0.06, 262)) },
  };
}

// The ticked ecliptic through the piece's centre, left out where the piece covers it (it passes behind)
const outline = (r: number, z: number) => Array.from({ length: 721 }, (_, i) => at(r, i / 2, z));
export const BEZEL_HORIZON = Math.round(px(toWorld([0, 0, 0]))[1] * 10) / 10;
export const BEZEL_GAP = (() => {
  let lo = Infinity, hi = -Infinity;
  for (const o of [outline(BEZEL.case.rOut, BEZEL.case.zBot), outline(BEZEL.case.rOut, BEZEL.case.zTop), outline(BEZEL.collar.rOut, BEZEL.collar.zTop)]) {
    for (let i = 1; i < o.length; i++) {
      const [a, b] = [o[i - 1], o[i]];
      if ((a[1] - BEZEL_HORIZON) * (b[1] - BEZEL_HORIZON) > 0) continue;
      const x = a[0] + ((b[0] - a[0]) * (BEZEL_HORIZON - a[1])) / (b[1] - a[1] || 1);
      lo = Math.min(lo, x); hi = Math.max(hi, x);
    }
  }
  return [lo - 3, hi + 3] as const;
})();
export function bezelEcliptic() {
  const y = BEZEL_HORIZON.toFixed(2), [g0, g1] = BEZEL_GAP;
  let d = `M8 ${y}H${g0.toFixed(2)}M${g1.toFixed(2)} ${y}H412`;
  for (let x = 8, i = 0; x <= 412; x += 6, i++) if (x < g0 || x > g1) d += `M${x} ${y}v${i % 5 === 0 ? -4.5 : -2}`;
  return d;
}
