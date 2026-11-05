import { add, angle, curve, dot, hidden, project, px, rad, rotX, rotY, rotZ, seg2, smooth, sphere, xf, type Attrs, type P2, type V3 } from "./geo";

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

// ── Assets: the angled frosted ring (a flat glass washer with polished edges, as in Orbit) and two equal balls, chrome
// and green, riding round it opposite each other on a 12 s loop. The swap: a green arch from the chrome ball to the
// green one, over the ring's centre; its apex never moves, so the "Swap" tag holds still while the arch swings round.
export const ASSETS = {
  rOut: 1.6, rIn: 1.04, thick: 0.06, ball: 0.27,
  tilt: rad(11), y: -0.12, period: 12, rest: rad(152), arch: 0.34,
};
export const ASSETS_PATH = (ASSETS.rOut + ASSETS.rIn) / 2;
const BALL_Y = ASSETS.thick / 2 + ASSETS.ball; // resting on the glass
const assetsW = (p: V3): V3 => add(rotX(p, ASSETS.tilt), [0, ASSETS.y, 0]);

export type AssetsPose = { chrome: V3; green: V3; phi: number };
export function assetsPose(_slide: number, t: number): AssetsPose {
  // anticlockwise seen from above: the near side runs left to right
  const phi = ASSETS.rest - (TAU * t) / ASSETS.period;
  const on = (a: number): V3 => [ASSETS_PATH * Math.cos(a), BALL_Y, ASSETS_PATH * Math.sin(a)];
  return { chrome: on(phi), green: on(phi + Math.PI), phi };
}

export function assetsVectors({ chrome, green, phi }: AssetsPose): Record<string, Attrs> {
  const occ = [sphere(assetsW(chrome), ASSETS.ball), sphere(assetsW(green), ASSETS.ball)];
  const circ = (r: number, y: number, a0: number, a1: number, n = 160, o = occ) =>
    curve((u) => assetsW([r * Math.cos(a0 + u * (a1 - a0)), y, r * Math.sin(a0 + u * (a1 - a0))]), n, () => true, o);
  const top = ASSETS.thick / 2;
  // the balls' path on the glass: far half under the canvas (muted by the frost it lies on), near half over
  const pathY = top + 0.004;
  // fine ticks on the far side of the path, fixed: the balls roll across them
  let ticks = "";
  for (let a = 200, i = 0; a <= 320; a += 3, i++) {
    const t = rad(a);
    const p0 = assetsW([ASSETS_PATH * 1.0 * Math.cos(t), pathY, ASSETS_PATH * Math.sin(t)]);
    const s = i % 5 === 0 ? 1.075 : 1.04;
    const p1 = assetsW([ASSETS_PATH * s * Math.cos(t), pathY, ASSETS_PATH * s * Math.sin(t)]);
    ticks += seg2(px(p0), px(p1));
  }
  // the swap: a low arch from the chrome ball's centre to the green one's across the ring's centre, turning with them
  // like a hand; it leaves and enters the balls where their surfaces cut it, lands with a head
  const archPt = (u: number): V3 => {
    const s = u * Math.PI;
    return [ASSETS_PATH * Math.cos(phi) * Math.cos(s), BALL_Y + ASSETS.arch * Math.sin(s), ASSETS_PATH * Math.sin(phi) * Math.cos(s)];
  };
  const N = 160;
  let b: P2 = px(assetsW(archPt(0.5))), bIn = b, a: P2 = b;
  for (let i = N / 2; i <= N; i++) {
    const p = assetsW(archPt(i / N)), q = project(p);
    if (hidden(p, q, occ)) break;
    bIn = b; b = q.p;
  }
  for (let i = N / 2; i >= 0; i--) {
    const p = assetsW(archPt(i / N)), q = project(p);
    if (hidden(p, q, occ)) break;
    a = q.p;
  }
  const apex = px(assetsW(archPt(0.5)));
  const C = 1.2;
  return {
    constructBack: { d: circ(ASSETS.rOut * C, 0, Math.PI, TAU, 120, []) },
    constructFront: { d: circ(ASSETS.rOut * C, 0, 0, Math.PI, 120, []) },
    pathBack: { d: circ(ASSETS_PATH, pathY, Math.PI, TAU) },
    pathFront: { d: circ(ASSETS_PATH, pathY, 0, Math.PI) },
    ticks: { d: ticks },
    arch: { d: curve((u) => assetsW(archPt(u)), N, () => true, occ) },
    archGrad: { x1: a[0].toFixed(2), y1: a[1].toFixed(2), x2: b[0].toFixed(2), y2: b[1].toFixed(2) },
    archFrom: { transform: xf(a) },
    archHead: { transform: xf(b, angle(bIn, b)) },
    apexDot: { transform: xf(apex) },
    apexLeader: { d: seg2(apex, [apex[0], SWAP_TAG[1] + 5]) },
    m206: { transform: xf(px(assetsW([ASSETS.rOut * C * Math.cos(rad(206)), 0, ASSETS.rOut * C * Math.sin(rad(206))]))) },
    m328: { transform: xf(px(assetsW([ASSETS.rOut * C * Math.cos(rad(328)), 0, ASSETS.rOut * C * Math.sin(rad(328))]))) },
    m140: { transform: xf(px(assetsW([ASSETS.rOut * C * Math.cos(rad(140)), 0, ASSETS.rOut * C * Math.sin(rad(140))]))) },
  };
}
// The tag sits clear of the far ball's top as it passes the back of the ring; its leader drops to the arch's apex
export const SWAP_TAG: P2 = [Math.round(px(assetsW([0, 0, 0]))[0]), Math.round(px(assetsW([0, BALL_Y + ASSETS.ball, -ASSETS_PATH]))[1] - 12)];
export const assetsHorizon = () => Math.round(px(assetsW([0, 0, 0]))[1] * 10) / 10;

