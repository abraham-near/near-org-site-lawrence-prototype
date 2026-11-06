import { add, angle, CAM_POS, curve, dot, project, px, rad, rotX, seg2, xf, type Attrs, type P2, type V3 } from "../geo";

// Identity option E, "refined" (D80, lab): Orbit's identity drawing rebuilt in the shared studio. A slim machined green
// ring (the new keys, the only green part) floats over a frosted glass disc with a bright chrome micro-bevel (a fine
// chrome hoop under it, blurred by the frost); a hairline
// ghost of the same ring sits at its previous, steeper tilt about the same centre, and a graduated protractor measures
// the single rotation between them; the account's wide orbit runs round both. No text.
//
// Everything is placed in the drawing's frame (y up, the disc's top face at y = 0), tilted toward the camera by TILT
// and set at POS; the vectors project the same points the WebGL scene renders. No three.js here (the server draws the
// rest state from this file).

export const REFINED = {
  tilt: rad(9), // the frame's tilt toward the camera: the disc is seen at about 21° (12° camera + 9°)
  pos: [0, -0.18, 0] as V3, // the frame's origin in the world
  disc: { R: 1.32, thick: 0.05 },
  ring: { c: [0, 0.5, 0] as V3, r: 0.84, w: 0.09, h: 0.064 },
  under: { r: 1.2, y: -0.3, tube: 0.011 }, // a fine chrome hoop hung under the disc: its front clear of the rim, the rest blurred by the frost
  // the single rotation: the old ring is the new one turned by θ about a level axis through the centre, `psi` from
  // the frame's x toward the camera; its back left lifts, its front right drops
  turn: { psi: rad(-50), theta: rad(24) },
  prot: { r: 0.92, foot: 0.46, from: -9, to: 36, step: 3 }, // the protractor (degrees from the new axis), its radius and where its axes start
  wide: { r: 1.72, y: -0.3 }, // in the hoop's plane
};
const { tilt, pos, disc, ring: RG, turn, prot: PR, wide: WD } = REFINED;

export const W = (p: V3): V3 => add(rotX(p, tilt), pos); // frame → world
const C = RG.c;
// the turn's basis: the axis `a` (level), `u` level and square to it at the back, `n` straight up
export const AXIS: V3 = [Math.cos(turn.psi), 0, Math.sin(turn.psi)];
const U: V3 = [Math.sin(turn.psi), 0, -Math.cos(turn.psi)];
const N: V3 = [0, 1, 0];
// a point of the frame turned about the axis through C by `t` (radians): u toward n
export function turned(p: V3, t: number): V3 {
  const v: V3 = [p[0] - C[0], p[1] - C[1], p[2] - C[2]];
  const ka = dot(v, AXIS), ku = dot(v, U), kn = dot(v, N);
  const cu = ku * Math.cos(t) - kn * Math.sin(t), cn = ku * Math.sin(t) + kn * Math.cos(t);
  return [C[0] + AXIS[0] * ka + U[0] * cu + N[0] * cn, C[1] + AXIS[1] * ka + U[1] * cu + N[1] * cn, C[2] + AXIS[2] * ka + U[2] * cu + N[2] * cn];
}
// a point on the ring's circle (radius s · r) at angle a, level, about C
const circ = (a: number, s = RG.r): V3 => [C[0] + s * Math.cos(a), C[1], C[2] + s * Math.sin(a)];

// The pose: how far the ring has turned from the old tilt to the new (1 at rest). Static for now (D80): the motion
// later turns it from 0 to 1 on arrival.
export type RefinedPose = { k: number };
export const refinedPose = (): RefinedPose => ({ k: 1 });
// the ring's own turn for a pose (0 at rest), about AXIS through C
export const ringTurn = (p: RefinedPose) => turn.theta * (1 - p.k);

// The camera in the frame (for the glass test)
const CAM_F: V3 = rotX([CAM_POS[0] - pos[0], CAM_POS[1] - pos[1], CAM_POS[2] - pos[2]], -tilt);
const TOP = disc.thick / 2;
// seen through the disc's top face (behind the glass from the camera)
const toFrame = (p: V3) => rotX([p[0] - pos[0], p[1] - pos[1], p[2] - pos[2]], -tilt);
const underGlass = (p: V3) => {
  if (p[1] >= TOP) return false;
  const t = (CAM_F[1] - TOP) / (CAM_F[1] - p[1]);
  const x = CAM_F[0] + t * (p[0] - CAM_F[0]), z = CAM_F[2] + t * (p[2] - CAM_F[2]);
  return Math.hypot(x, z) < disc.R + 0.02;
};

// inside a closed polygon on screen
function within(poly: P2[], q: P2) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < ((b[0] - a[0]) * (q[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}

export function refinedVectors(pose: RefinedPose): Record<string, Attrs> {
  const rt = ringTurn(pose);
  // the ring's band on screen (its centreline, turned with it), to keep every line off the green part
  const band: P2[] = [];
  for (let i = 0; i < 360; i++) band.push(px(W(turned(circ((i / 360) * Math.PI * 2), rt))));
  const offRing = (_p: V3, q: { p: P2 }) => {
    for (const b of band) if (Math.hypot(q.p[0] - b[0], q.p[1] - b[1]) < 7) return false;
    return true;
  };
  // and inside the ring's outline: lines behind it stop at its edge, so nothing reads through the hole as a scratch
  const outline: P2[] = [];
  for (let i = 0; i < 180; i++) outline.push(px(W(turned(circ((i / 180) * Math.PI * 2, RG.r + RG.w / 2), rt))));
  const inside = (q: P2) => within(outline, q);
  // and the disc's face on screen (its top and bottom rims), for the ghost: where it passes over the glass it would read
  // as engraved on it, so that part is left out and the ghost floats clear of the disc
  const topRim: P2[] = [], botRim: P2[] = [];
  for (let i = 0; i < 180; i++) {
    const a = (i / 180) * Math.PI * 2;
    topRim.push(px(W([(disc.R + 0.03) * Math.cos(a), TOP, (disc.R + 0.03) * Math.sin(a)])));
    botRim.push(px(W([(disc.R + 0.03) * Math.cos(a), -TOP, (disc.R + 0.03) * Math.sin(a)])));
  }
  const overDisc = (q: P2) => within(topRim, q) || within(botRim, q);
  const TAU = Math.PI * 2;

  // the ghost: the ring's circle at the old tilt (its centreline)
  const ghost = curve((u) => W(turned(circ(u * TAU), turn.theta)), 320, (p, q) => offRing(p, q) && !inside(q.p) && !overDisc(q.p) && !underGlass(toFrame(p)));

  // the wide orbit round disc and ring, in the disc's plane
  const wideAt = (a: number, s = 1): V3 => W([WD.r * s * Math.cos(a), WD.y, WD.r * s * Math.sin(a)]);
  const Oz = project(W([0, WD.y, 0])).z;
  const wideKeep = (side: "b" | "f") => (p: V3, q: { p: P2; z: number }) => (side === "b" ? q.z > Oz - 0.03 && !inside(q.p) && !overDisc(q.p) : q.z <= Oz + 0.03) && offRing(p, q);
  const wide = (side: "b" | "f") => curve((u) => wideAt(u * TAU), 300, wideKeep(side));
  // its scale, front right (angles: 0 is +x, π/2 toward the camera)
  let wideTicks = "";
  for (let d = 18, i = 0; d <= 74; d += 2, i++) wideTicks += seg2(px(wideAt(rad(d))), px(wideAt(rad(d), i % 5 === 0 ? 1.06 : 1.03)));
  // (each hidden if it would sit behind the glass or the ring)
  const dots = [104, 124, 160, 198, 350, 86].map((d) => {
    const p = wideAt(rad(d)), q = project(p);
    const show = !(q.z > Oz && (overDisc(q.p) || inside(q.p))) && offRing(p, q);
    return { transform: xf(q.p), opacity: show ? "1" : "0" };
  });

  // the hoop's scale: fine ticks just outside the chrome hoop under the disc, front left, on a baseline
  const H = REFINED.under;
  const rimAt = (a: number, s: number): V3 => W([H.r * s * Math.cos(a), H.y, H.r * s * Math.sin(a)]);
  let rim = "";
  for (let d = 112, i = 0; d <= 160; d += 3, i++) rim += seg2(px(rimAt(rad(d), 1.035)), px(rimAt(rad(d), i % 4 === 0 ? 1.08 : 1.058)));
  const rimArc = curve((u) => rimAt(rad(112 + u * 48), 1.035), 40);

  // the protractor: the ring's axis now (straight up through its centre) and at the old tilt, as dashed lines rising
  // from just above the ring, with a graduated arc between them in the plane of the turn and the sweep (ink) from
  // the old axis to the new; 0° is the new axis, θ the old
  const pAt = (deg: number, s = 1): V3 => W(turned(add(C, N, PR.r * s), rad(deg)));
  let pt = "";
  for (let d = PR.from; d <= PR.to + 1e-6; d += PR.step) {
    const major = d % 12 === 0; // 0 (the new axis), 12, 24 (the old one), 36
    pt += seg2(px(pAt(d)), px(pAt(d, major ? 1.075 : 1.04)));
  }
  const pArc = curve((u) => pAt(PR.from + u * (PR.to - PR.from)), 80);
  const th = (turn.theta * 180) / Math.PI;
  const sweep = curve((u) => pAt(th - 1.6 - u * (th - 4), 0.96), 60); // from just past the old axis's ring marker
  const tip = px(pAt(0, 0.96)), pre = px(pAt(1.2, 0.96));
  const ray = (t: number) => seg2(px(W(turned(add(C, N, PR.foot), t))), px(W(turned(add(C, N, PR.r * 1.13), t))));
  const oldTop = px(pAt(th, 0.96));

  return {
    ghost: { d: ghost },
    wideBack: { d: wide("b") },
    wideFront: { d: wide("f") },
    wideTicks: { d: wideTicks },
    ...Object.fromEntries(dots.map((t, i) => [`dot${i}`, t])),
    rim: { d: rim },
    rimArc: { d: rimArc },
    protTicks: { d: pt },
    protArc: { d: pArc },
    sweep: { d: sweep },
    head: { transform: xf(tip, angle(pre, tip)) },
    rays: { d: ray(turn.theta) + ray(0) },
    oldTop: { transform: xf(oldTop) },
  };
}

// The ticked horizon at the disc's centre, left out where it passes behind the glass
export const REFINED_HORIZON = (() => {
  const c = px(W([0, 0, 0]));
  let x0 = Infinity, x1 = -Infinity;
  for (let i = 0; i < 360; i++) {
    const a = (i / 360) * Math.PI * 2;
    for (const y of [TOP, -TOP]) { const q = px(W([disc.R * Math.cos(a), y, disc.R * Math.sin(a)])); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); }
  }
  return { y: Math.round(c[1] * 10) / 10, gap: [x0 - 3, x1 + 3] as const };
})();
