import type { Ell, Pt } from "../geom";
import { pt, pts, seg } from "../geom";
import { Arc, Axis, Brackets, Cross, Dot, Path, Ring, Ruler, Square, Ticks, Trace } from "../vec";
import DATA from "../data/c.json";

// C · Dune: one long crest drawn between light and shadow, traced from the photo and ticked; the far crests and a few
// wind ripples traced finer. A contour scale stands at the right edge with dashed leaders from the crest's peak and its
// two bends; the lower bend carries a protractor and its tangent; the peak is sighted, with the one green node.
const crest = pts(DATA.crest);
const PEAK: Pt = [2490, 362];
const BEND_UP: Pt = [2001, 600];
const BEND_LO: Pt = [1928, 1040];
const PRO: Ell = { cx: BEND_LO[0], cy: BEND_LO[1], rx: 150, ry: 150 };
const SCALE_X = 2400; // inside the frame at every width

export function DuneLayer() {
  return (
    <g>
      {/* The land */}
      <Trace id="c-crest" pts={crest} every={4} tick={10} tone="ink" a={0.55} />
      <Trace id="c-lead" pts={pts(DATA.lead)} every={4} tick={7} tone="ink" a={0.32} />
      <Trace id="c-far1" pts={pts(DATA.far1)} every={4} tick={6} tone="ink" a={0.26} />
      <Trace id="c-far2" pts={pts(DATA.far2)} every={4} tick={6} tone="ink" a={0.3} />
      {DATA.rip.map((r, i) => <Trace key={i} id={`c-rip${i}`} pts={pts(r)} every={3} tick={5} tone="ink" a={0.2} dip={0.4} />)}

      {/* The contour scale and its leaders */}
      <Path d={`M${SCALE_X} 300V1480`} tone="ink" a={0.4} />
      <Path d={Array.from({ length: 60 }, (_, i) => `M${SCALE_X} ${300 + i * 20}h${i % 5 === 0 ? 18 : 8}`).join("")} tone="ink" a={0.38} />
      {[PEAK, BEND_UP, BEND_LO].map((p, i) => (
        <g key={i}>
          <Path d={seg(p, [SCALE_X, p[1]])} tone="ink" a={0.28} dash="3 6" />
          <Square p={[SCALE_X, p[1]]} s={5} a={0.6} />
        </g>
      ))}

      {/* The lower bend: a protractor and the crest's tangent */}
      <Arc e={PRO} t0={150} t1={330} tone="ink" a={0.35} />
      <Ticks e={PRO} t0={150} t1={330} step={3} len={7} major={5} majorLen={16} tone="ink" a={0.35} />
      <Path d={seg([BEND_LO[0] - 150, BEND_LO[1] + 210], [BEND_LO[0] + 130, BEND_LO[1] - 182])} tone="ink" a={0.3} dash="8 6" />
      <Path d={seg([BEND_LO[0] - 170, BEND_LO[1]], [BEND_LO[0] + 170, BEND_LO[1]])} tone="ink" a={0.25} dash="2 5" />
      <Arc e={{ ...PRO, rx: 70, ry: 70 }} t0={306} t1={360} tone="deep" a={0.8} />
      <Cross p={BEND_LO} s={12} a={0.6} />
      <Ring p={pt(PRO, 216)} r={6} a={0.55} />
      <Ring p={BEND_UP} r={8} a={0.6} />
      <Cross p={BEND_UP} s={14} a={0.45} />

      {/* The peak sighted */}
      <Axis a={[PEAK[0], 205]} b={[PEAK[0], PEAK[1] - 26]} op={0.4} />
      <Ruler id="c-top" x0={PEAK[0] - 260} x1={PEAK[0] + 180} y={230} step={12} major={5} len={5} majorLen={12} a={0.4} fade={120} fadeEnd={80} />
      <Brackets p={PEAK} w={30} h={30} l={9} a={0.5} />
      <Ring p={PEAK} r={12} tone="deep" a={0.9} />
      <Dot p={PEAK} r={4.5} tone="green" a={1} />
    </g>
  );
}
