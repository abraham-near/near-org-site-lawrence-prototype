import type { Ell, Pt } from "../geom";
import { pt, pts } from "../geom";
import { Arc, Axis, Brackets, Cross, Dial, Path, Ring, Ruler, Square, Ticks, Trace } from "../vec";
import DATA from "../data/d.json";

// D · The gate (the one non-organic option): a chrome ring and glass disc standing in the fog, the green glass sphere
// at its heart. Two gimbal orbits turn round the sphere (far sides dashed behind it), a dial and brackets sight it, a
// ticked scale crowns the ring, a level ruler and a dash-dot axis cross at the sphere, and the grass edge is traced
// either side.
const P: Pt = [1996, 680];
const SR = 76; // the sphere's radius
const RING: Ell = { cx: 2000, cy: 678, rx: 385, ry: 416 };
const O1: Ell = { cx: P[0], cy: P[1], rx: 290, ry: 80, rot: -14 };
const O2: Ell = { cx: P[0], cy: P[1], rx: 104, ry: 262, rot: 22 };
const left = pts(DATA.left).filter((p) => p[0] >= 1000);
const right = pts(DATA.right);

export function GateLayer() {
  return (
    <g>
      {/* The grass edge, either side of the ring */}
      <Trace id="d-gl" pts={left} every={4} tick={8} tone="ink" a={0.4} />
      <Trace id="d-gr" pts={right} every={3} tick={8} tone="ink" a={0.4} />

      {/* The crown scale, low enough to clear the nav */}
      <Arc e={RING} t0={236} t1={304} s={1.08} tone="ink" a={0.5} />
      <Ticks e={RING} t0={236} t1={304} step={2} len={7} major={5} majorLen={16} s={1.08} tone="ink" a={0.42} />
      <Ticks e={RING} t0={236} t1={304} step={1} len={-4} s={1.08} tone="ink" a={0.25} />
      <Arc e={RING} t0={264} t1={276} s={1.08} tone="deep" a={0.95} w={1.4} />
      <Square p={pt(RING, 248, 1.08)} s={4.5} a={0.6} />
      <Ring p={pt(RING, 292, 1.08)} r={5} a={0.6} />
      <Arc e={RING} t0={128} t1={232} s={1.07} tone="ink" a={0.26} dash="5 7" />
      <Arc e={RING} t0={-50} t1={50} s={1.07} tone="ink" a={0.2} dash="1 5" />

      {/* Level and plumb, crossing at the sphere; the ruler fades out at both ends */}
      <Ruler id="d-h" x0={1380} x1={2688} y={P[1]} step={14} major={5} len={5} majorLen={13} a={0.42} fade={360} fadeEnd={260} />
      <Axis a={[P[0], 222]} b={[P[0], P[1] - SR - 44]} op={0.36} />
      <Axis a={[P[0], P[1] + SR + 44]} b={[P[0], 1150]} op={0.3} />

      {/* The gimbal: two orbits round the sphere */}
      <Arc e={O1} t0={180} t1={360} tone="ink" a={0.3} dash="4 6" />
      <Arc e={O1} t0={0} t1={180} tone="ink" a={0.62} />
      <Ticks e={O1} t0={20} t1={160} step={3} len={6} major={5} majorLen={14} tone="ink" a={0.4} />
      <Arc e={O2} t0={90} t1={270} tone="ink" a={0.28} dash="4 6" />
      <Arc e={O2} t0={-90} t1={90} tone="ink" a={0.55} />
      <Ring p={pt(O1, 118)} r={9} a={0.7} />
      <Cross p={pt(O2, -60)} s={9} a={0.6} />
      <Square p={pt(O1, 30)} s={4} a={0.55} />

      {/* The sphere sighted */}
      <Ring p={P} r={SR + 30} a={0.32} />
      <Dial p={P} r={SR + 30} step={6} len={-6} major={5} majorLen={-12} a={0.35} />
      <Arc e={{ cx: P[0], cy: P[1], rx: SR + 70, ry: SR + 70 }} t0={0} t1={360} tone="ink" a={0.2} dash="1 5" />
      <Brackets p={P} w={SR + 52} h={SR + 52} l={14} a={0.45} />
      <Square p={pt(RING, 182)} s={5} a={0.6} />
      <Square p={pt(RING, -2)} s={5} a={0.6} />

      {/* Where it stands */}
      <Path d="M1930 1098H2070" tone="ink" a={0.45} />
      <Square p={[2000, 1098]} s={5} a={0.6} />
    </g>
  );
}
