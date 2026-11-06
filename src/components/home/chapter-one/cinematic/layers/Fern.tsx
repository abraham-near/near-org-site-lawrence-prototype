import type { Ell, Pt } from "../geom";
import { poly, pt, spiral, spiralPt } from "../geom";
import { Arc, Axis, Brackets, Dial, Dot, Path, Plexus, Ring, Square, Ticks, Trace } from "../vec";

// B · Unfurl: the crozier measured like a watch movement. A hairline spiral runs down the centre of the coiled stem,
// fitted to its whorls (about 1.19× per quarter turn) and carried on out into the stem; only its last inner turn is
// green. Around it: the coil's circle and its golden-ratio construction circles, a ticked scale, a dial and axes through
// the eye; the dew drops are ringed and joined (strongest at the drops).
const EYE: Pt = [1801, 600];
const R0 = 234; // the band's radius at the top of the coil (90°)
const K = 1.19;
const START = -20; // where the stem leaves the coil
const TURN = 450; // the last inner turn starts here
const END = 740;
const R = 262;
const PHI = 1.618;
const CIRC: Ell = { cx: EYE[0], cy: EYE[1], rx: R, ry: R };
const rAt = (a: number) => R0 * Math.pow(K, (90 - a) / 90); // the spiral's radius at angle a (R0 at 90°)
const STEM: Pt[] = [spiralPt(EYE, rAt(START), START, START, K), [2118, 700], [2152, 800], [2196, 900], [2252, 1000], [2318, 1100], [2387, 1200], [2446, 1300], [2500, 1400], [2548, 1500]];
const DROPS: Pt[] = [[1709, 307], [1655, 348], [2063, 403], [2130, 521], [2176, 655], [2113, 865], [2323, 941], [2234, 1050], [2470, 1176], [2405, 1378]];
const CHAIN = [[0, 1], [0, 2], [2, 3], [3, 4], [4, 5], [5, 7], [6, 7], [6, 8], [8, 9]] as const;

export function FernLayer() {
  return (
    <g>
      {/* Construction: the coil's circle and the golden circles inside it */}
      <Arc e={CIRC} t0={0} t1={360} tone="ink" a={0.3} />
      <Arc e={CIRC} t0={0} t1={360} s={1 / PHI} tone="ink" a={0.26} dash="6 6" />
      <Arc e={CIRC} t0={0} t1={360} s={1 / (PHI * PHI)} tone="ink" a={0.22} dash="1 5" />
      <Ticks e={CIRC} t0={100} t1={260} step={1} len={-7} major={5} majorLen={-13} tone="ink" a={0.3} />
      {[0, 90, 180, 270].map((t) => <Square key={t} p={pt(CIRC, t)} s={5} a={0.55} />)}

      {/* The outer scale */}
      <Arc e={CIRC} t0={118} t1={250} s={1.3} tone="ink" a={0.45} />
      <Ticks e={CIRC} t0={118} t1={250} step={2} len={9} major={5} majorLen={20} s={1.3} tone="ink" a={0.4} />
      <Arc e={CIRC} t0={250} t1={272} s={1.3} tone="ink" a={0.7} w={1} />
      <Ring p={pt(CIRC, 250, 1.3)} r={7} a={0.6} />
      <Square p={pt(CIRC, 160, 1.3)} s={4.5} a={0.55} />

      {/* Axes and the dial at the eye */}
      <Axis a={[EYE[0] - 400, EYE[1]]} b={[EYE[0] + 330, EYE[1]]} op={0.3} />
      <Axis a={[EYE[0], EYE[1] - 380]} b={[EYE[0], EYE[1] + 340]} op={0.3} />
      <Dial p={EYE} r={34} step={10} len={-4} major={3} majorLen={-8} a={0.4} />
      <Brackets p={EYE} w={52} h={52} l={12} a={0.45} />

      {/* The spiral down the coiled stem, out into the stem; the last inner turn in green */}
      <Path d={spiral(EYE, rAt(START), START, TURN, K)} tone="deep" a={0.6} w={0.75} />
      <Path d={spiral(EYE, rAt(TURN), TURN, END, K)} tone="green" a={1} w={0.9} />
      <Trace id="b-stem" pts={STEM} every={1} tick={8} tone="deep" a={0.5} dip={0.45} />
      <Path d={poly(STEM.map(([x, y]) => [x + 46, y - 4] as const))} tone="ink" a={0.18} dash="2 6" />
      <Dot p={spiralPt(EYE, rAt(END), END, END, K)} r={3.5} tone="green" a={1} />

      {/* The dew, tracked */}
      <Plexus id="b-dew" pts={DROPS} links={CHAIN} tone="ink" a={0.55} dot={2.4} />
      {DROPS.map((p, i) => <Ring key={i} p={p} r={i === 0 ? 20 : 13} a={0.5} />)}
      <Dot p={DROPS[0]} r={3.6} tone="green" a={1} />
    </g>
  );
}
