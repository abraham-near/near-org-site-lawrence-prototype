import { add, curve, dot, project, px, rad, rotX, rotY, rotZ, seg2, smooth, sphere, xf, type Attrs, type P2, type V3 } from "./geo";

// The two stations as numbers (D72): where everything is for a given slide and time (the pose), and the vector layer
// drawn from that pose by projecting the same points the WebGL scene renders. Shared by the server's rest state and
// the live frames. t = 0 is the rest pose (reduced motion, phones, no JS, and the fallback still).

const TAU = Math.PI * 2;

// ── Data: a frosted disc with a polished rim, flat to camera at the centre and turned up to 64° at the edges; a green
// ball swings left and right behind it on a 7.2 s loop. The disc's frame is tilted back by the camera's elevation so
// "flat" is exactly face-on.
export const DATA = {
  R: 1, thick: 0.05, ball: 0.25,
  swing: 1.52, period: 7.2, rest: -1.02, // the ball's reach either side, and where it rests (half behind the left edge)
  // the turn: flat within ±0.05 of the centre, fully turned (64°) from ±0.45 out, so it all happens where the rail
  // has faded the station in
  turn: rad(64), still: 0.05, full: 0.45,
  orbit: { r: 1.62, tilt: rad(15), roll: rad(-4), y: -0.02 },
};
export const DATA_TILT = -rad(12); // the disc frame's tilt (= -CAM.el): its +z axis points at the camera

export type DataPose = { yaw: number; ball: V3 };
export function dataPose(slide: number, t: number): DataPose {
  const u = smooth((Math.abs(slide) - DATA.still) / (DATA.full - DATA.still));
  const yaw = -Math.sign(slide) * DATA.turn * u;
  const ph = Math.asin(DATA.rest / DATA.swing);
  const x = DATA.swing * Math.sin(ph + (TAU * t) / DATA.period);
  // behind the disc; further back while it is turned, so its swept edge never meets the ball
  const z = -(0.5 + 0.85 * Math.abs(Math.sin(yaw)));
  return { yaw, ball: [x, 0, z] };
}

// The orbit's plane in the disc's frame: tilted toward the camera and rolled a little, like Orbit's ORB_D
const orbitPt = (a: number, s = 1): V3 => {
  const { r, tilt, roll, y } = DATA.orbit;
  return rotZ(rotX([r * s * Math.cos(a), y, r * s * Math.sin(a)], tilt), roll);
};
const dataW = (p: V3) => rotX(p, DATA_TILT); // disc frame → world

export function dataVectors({ yaw, ball }: DataPose): Record<string, Attrs> {
  const n: V3 = [Math.sin(yaw), 0, Math.cos(yaw)]; // the disc's face normal (toward the camera when flat)
  const front = (p: V3) => dot(p, n) > 0;
  const back = (p: V3) => !front(p);
  const shift = -yaw; // marks on the orbit ride round with the disc's turn
  const occ = [sphere(dataW(ball), DATA.ball)];
  const ring = (s: number, keep: (p: V3) => boolean) => curve((u) => dataW(orbitPt(u * TAU, s)), 220, (p) => keep(rotX(p, -DATA_TILT)), occ);
  const ticksOn = (a0: number, a1: number, step: number, keep: (p: V3) => boolean) => {
    let d = "";
    for (let a = a0, i = 0; a <= a1 + 1e-6; a += step, i++) {
      const t = rad(a) + shift, p = orbitPt(t);
      if (!keep(p)) continue;
      const q0 = px(dataW(p)), q1 = px(dataW(orbitPt(t, i % 5 === 0 ? 1.07 : 1.035)));
      d += seg2(q0, q1);
    }
    return d;
  };
  const at = (a: number, s = 1) => px(dataW(orbitPt(rad(a) + shift, s)));

  // the disc's own scale: fine ticks just outside its rim, lower left, turning with it
  const rimPt = (a: number, s: number): V3 => rotY([s * Math.cos(a), s * Math.sin(a), DATA.thick / 2], yaw);
  let rim = "";
  for (let a = 196, i = 0; a <= 256; a += 3, i++) rim += seg2(px(dataW(rimPt(rad(a), 1.045))), px(dataW(rimPt(rad(a), i % 5 === 0 ? 1.1 : 1.07))));
  const rimArc = curve((u) => dataW(rimPt(rad(150 + u * 46), 1.045)), 40);

  // the ball's track: a horizon through it, its scale on the left where the ball comes out from behind the glass
  const tk = (x: number): V3 => dataW([x, 0, ball[2] - 0.01]); // a hair behind the ball's centre, so the ball hides it
  const x0 = -2.02, edge = -Math.cos(yaw) * DATA.R - 0.06;
  let scale = "";
  for (let i = 0, x = x0; x <= edge - 0.02; x += 0.075, i++) {
    const q = px(tk(x));
    scale += `M${q[0].toFixed(2)} ${q[1].toFixed(2)}v${i % 5 === 0 ? -5 : -2.2}`;
  }
  const lead = at(38);
  return {
    // under the canvas (muted by the glass, hidden by the ball)
    orbitBack: { d: ring(1, back) },
    innerBack: { d: ring(0.72, back) },
    ticksBack: { d: ticksOn(198, 264, 3, back) },
    track: { d: curve((u) => tk(edge + u * (2.02 - edge)), 60, () => true, occ) },
    // over it
    orbitFront: { d: ring(1, front) },
    innerFront: { d: ring(0.72, front) },
    ticksFront: { d: ticksOn(100, 176, 2, front) },
    rim: { d: rim },
    rimArc: { d: rimArc },
    trackLeft: { d: curve((u) => tk(x0 + u * (edge - x0)), 40, () => true, occ) },
    trackScale: { d: scale },
    trackEnd: { transform: xf(px(tk(x0))) },
    p150: { transform: xf(at(150)) },
    p30: { transform: xf(at(30)) },
    p232: { transform: xf(at(232)) },
    p120: { transform: xf(at(120, 0.72)) },
    leadDot: { transform: xf(lead) },
    leader: { d: seg2(lead, LABEL_DATA_TO) },
  };
}
export const LABEL_DATA_TO: P2 = [356, 238];
export const LABEL_DATA: P2 = [388, 252];

// ── Assets: the angled frosted ring (a flat glass washer with polished edges, as in Orbit) and one green ball riding
// round it on a 14 s loop, with a short green trail on its own orbit (strongest at the ball, fading back over 75°,
// carried rigidly by the ball, so no light ever runs along a line). Around it a second, slower layer of atlas graphics,
// every piece in the ring's plane and projected each frame:
// - an outer graduated dial counter-rotating once a minute, with index ticks every 45°;
// - three markers (ring, cross, square) orbiting the construction circle the other way from the ball, each with a short
//   radial tick toward the washer;
// - three dashed arcs on an inner circle in the hole, drawing on and off in turn (their dashes stay put);
// - a reading at the ball: a radius from the ring's axis out to the ball, with fine ticks, strongest at its two ends.
// Far halves sit under the canvas (behind the frost and the ball), near halves over it; nothing is drawn across the ball.
export const ASSETS = {
  rOut: 1.6, rIn: 1.04, thick: 0.06, ball: 0.27,
  tilt: rad(11), y: -0.12, period: 14, rest: rad(152), trail: rad(75),
  dial: { r: 1.6 * 1.34, period: 60 }, marks: { r: 1.6 * 1.2, period: 38, at: [206, 328, 88] },
  arcs: { r: 0.8, len: rad(64), cycle: 9, at: [200, 320, 80] },
};
export const ASSETS_PATH = (ASSETS.rOut + ASSETS.rIn) / 2;
const BALL_Y = ASSETS.thick / 2 + ASSETS.ball; // resting on the glass
const assetsW = (p: V3): V3 => add(rotX(p, ASSETS.tilt), [0, ASSETS.y, 0]);

export type AssetsPose = { green: V3; phi: number; t: number };
export function assetsPose(_slide: number, t: number): AssetsPose {
  // anticlockwise seen from above: along the near side it runs left to right
  const phi = ASSETS.rest - (TAU * t) / ASSETS.period;
  return { green: [ASSETS_PATH * Math.cos(phi), BALL_Y, ASSETS_PATH * Math.sin(phi)], phi, t };
}

// An arc of the inner circle's draw: on (0–1.6 s), held, off back toward its start (4.2–5.8 s), then gone until its turn
function drawn(t: number) {
  const u = ((t % ASSETS.arcs.cycle) + ASSETS.arcs.cycle) % ASSETS.arcs.cycle;
  if (u < 1.6) return smooth(u / 1.6);
  if (u < 4.2) return 1;
  if (u < 5.8) return 1 - smooth((u - 4.2) / 1.6);
  return 0;
}

export function assetsVectors({ green, phi, t }: AssetsPose): Record<string, Attrs> {
  const occ = [sphere(assetsW(green), ASSETS.ball)];
  const B = occ[0];
  // never across the ball: anything inside its outline on screen (with a hair of margin) is left out
  const clear = (_p: V3, q: { p: P2 }) => Math.hypot(q.p[0] - B.c[0], q.p[1] - B.c[1]) > B.r + 2;
  const top = ASSETS.thick / 2;
  const pathY = top + 0.004;
  const at = (r: number, a: number, y = pathY): V3 => assetsW([r * Math.cos(a), y, r * Math.sin(a)]);
  const far = (a: number) => Math.sin(a) < 0; // the half of the ring's plane behind its centre
  const circ = (r: number, y: number, a0: number, a1: number, n = 160) => curve((u) => at(r, a0 + u * (a1 - a0), y), n, clear);
  const tick = (r0: number, r1: number, a: number, y = pathY) => {
    const p = project(at(r0, a, y)), q = project(at(r1, a, y));
    return clear(at(r0, a, y), p) && clear(at(r1, a, y), q) ? seg2(p.p, q.p) : "";
  };

  // fine ticks on the far side of the path, fixed: the ball rolls across them
  let ticks = "";
  for (let a = 200, i = 0; a <= 320; a += 3, i++) ticks += tick(ASSETS_PATH, ASSETS_PATH * (i % 5 === 0 ? 1.075 : 1.04), rad(a));

  // the trail, at the ball's centre height: from its tail (faded out) to where it tucks in behind the ball
  const trailPt = (u: number) => at(ASSETS_PATH, phi + ASSETS.trail * (1 - u), BALL_Y);
  const N = 90;
  let head: P2 = px(trailPt(0));
  for (let i = 0; i <= N; i++) {
    const p = trailPt(i / N), q = project(p);
    if (!clear(p, q)) break;
    head = q.p;
  }
  const tail = px(trailPt(0));

  // the outer dial, counter-rotating: two opposite graduated sectors of 120° (an arc with fine ticks every 3°, longer
  // every 15°, index ticks at their ends), so the turn reads without filling the frame
  const D = ASSETS.dial, spin = (TAU * t) / D.period;
  let dialBack = "", dialFront = "", ringBack = "", ringFront = "";
  for (const s0 of [spin, spin + Math.PI]) {
    for (let i = 0; i <= 40; i++) {
      const a = s0 + rad(i * 3), d = tick(D.r, D.r * (i === 0 || i === 40 ? 1.08 : i % 5 === 0 ? 1.045 : 1.022), a, 0);
      if (far(a)) dialBack += d; else dialFront += d;
    }
    // the sector's arc, split where it crosses from the far half to the near one
    const steps = 48;
    for (let i = 0; i < steps; i++) {
      const a = s0 + (rad(120) * i) / steps, b = s0 + (rad(120) * (i + 1)) / steps;
      const d = curve((u) => at(D.r, a + u * (b - a), 0), 1, clear);
      if (far((a + b) / 2)) ringBack += d; else ringFront += d;
    }
  }

  // the orbiting markers: each in front of or behind the ring as it goes round, with its radial tick
  const M = ASSETS.marks, mspin = (TAU * t) / M.period;
  const marks: Record<string, Attrs> = {};
  M.at.forEach((deg, i) => {
    const a = rad(deg) + mspin, p = at(M.r, a, 0), q = project(p);
    const show = clear(p, q), back = far(a);
    const d = tick(M.r * 0.955, M.r * 0.91, a, 0);
    marks[`mk${i}b`] = { transform: xf(q.p), opacity: show && back ? "1" : "0" };
    marks[`mk${i}f`] = { transform: xf(q.p), opacity: show && !back ? "1" : "0" };
    marks[`mt${i}b`] = { d: back ? d : "" };
    marks[`mt${i}f`] = { d: back ? "" : d };
  });

  // the inner dashed arcs, drawing on and off in turn (each grows from its start and retracts to it)
  const A = ASSETS.arcs, arcs: Record<string, Attrs> = {};
  A.at.forEach((deg, i) => {
    const u = drawn(t - i * (A.cycle / 3));
    const a0 = rad(deg);
    arcs[`arc${i}`] = { d: u > 0.002 ? circ(A.r, pathY, a0, a0 + A.len * u, Math.max(2, Math.round(40 * u))) : "" };
  });

  // the reading: a radius from the ring's axis to the ball, cut where it meets the ball's outline
  const c0 = at(0, 0), cq = project(c0);
  let end: P2 = cq.p, rticks = "";
  for (let i = 0; i <= 60; i++) {
    const p = at((ASSETS_PATH * i) / 60, phi), q = project(p);
    if (!clear(p, q)) break;
    end = q.p;
  }
  for (let r = 0.2; r < ASSETS_PATH - 0.3; r += 0.12) {
    const n: V3 = [-Math.sin(phi), 0, Math.cos(phi)], m = [r * Math.cos(phi), pathY, r * Math.sin(phi)] as const;
    const p0 = assetsW([m[0] - n[0] * 0.035, m[1], m[2] - n[2] * 0.035]), p1 = assetsW([m[0] + n[0] * 0.035, m[1], m[2] + n[2] * 0.035]);
    if (clear(p0, project(p0)) && clear(p1, project(p1))) rticks += seg2(px(p0), px(p1));
  }

  const C = 1.2;
  return {
    constructBack: { d: circ(ASSETS.rOut * C, 0, Math.PI, TAU, 120) },
    constructFront: { d: circ(ASSETS.rOut * C, 0, 0, Math.PI, 120) },
    pathBack: { d: circ(ASSETS_PATH, pathY, Math.PI, TAU) },
    pathFront: { d: circ(ASSETS_PATH, pathY, 0, Math.PI) },
    ticks: { d: ticks },
    trail: { d: curve(trailPt, N, clear) },
    trailGrad: { x1: tail[0].toFixed(2), y1: tail[1].toFixed(2), x2: head[0].toFixed(2), y2: head[1].toFixed(2) },
    dialRingBack: { d: ringBack },
    dialRingFront: { d: ringFront },
    dialBack: { d: dialBack },
    dialFront: { d: dialFront },
    ...marks,
    ...arcs,
    reading: { d: seg2(cq.p, end) },
    readingTicks: { d: rticks },
    readingGrad: { x1: cq.p[0].toFixed(2), y1: cq.p[1].toFixed(2), x2: end[0].toFixed(2), y2: end[1].toFixed(2) },
    readingFrom: { transform: xf(cq.p) },
    readingTo: { transform: xf(end) },
  };
}
export const assetsHorizon = () => Math.round(px(assetsW([0, 0, 0]))[1] * 10) / 10;
