import type { Ell, Pt } from "../geom";
import { pt, pts } from "../geom";
import { Arc, Axis, Brackets, Cross, Dot, Path, Ring, Square, Ticks, Trace } from "../vec";
import DATA from "../data/a.json";

// A · Above the clouds: the massif's skyline and its ridges traced from the photo (ticked, strongest at the ticks), the
// summit sighted (brackets, a cross, a green node, a ticked altimeter arc and a laddered dash-dot axis), one orbit lying
// level round the peak with its far side dashed behind the rock, and the near forest's tree tops marked with crosses and
// rings, and survey pins on the tallest tops.
const SUMMIT: Pt = [1856, 386];
const ALT: Ell = { cx: SUMMIT[0], cy: SUMMIT[1], rx: 160, ry: 160 };
const ORB: Ell = { cx: 1880, cy: 600, rx: 330, ry: 46, rot: -1.5 };

const sil = pts(DATA.sil).filter((p) => p[0] >= 1160);
const front = pts(DATA.front).filter((p) => p[0] <= 2560);
// Tree tops along the near forest's crest, a touch inside it
const TOPS: Pt[] = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128]
  .filter((i) => i < front.length)
  .map((i) => [front[i][0], front[i][1] + 6] as const);
// Five survey pins on the tallest tops: a short staff up from the tree, a ring at its head
const PINS: Pt[] = [TOPS[2], TOPS[5], TOPS[8], TOPS[11], TOPS[14]].filter(Boolean);

export function SummitLayer() {
  return (
    <g>
      {/* The land */}
      <Trace id="a-sil" pts={sil} every={4} tick={9} tone="ink" a={0.5} />
      <Trace id="a-mid" pts={pts(DATA.mid)} every={4} tick={6} tone="ink" a={0.3} />
      <Trace id="a-mid2" pts={pts(DATA.mid2)} every={4} tick={6} tone="ink" a={0.3} />
      <Trace id="a-low" pts={pts(DATA.low)} every={4} tick={6} tone="ink" a={0.28} />
      <Trace id="a-right" pts={pts(DATA.right)} every={4} tick={6} tone="white" a={0.55} />
      <Trace id="a-front" pts={front} every={5} tick={8} tone="white" a={0.6} />

      {/* Tree tops on the near forest: crosses and rings, and five survey pins */}
      {TOPS.map((p, i) => (i % 3 === 1 ? <Ring key={i} p={p} r={6} tone="white" a={0.75} /> : <Cross key={i} p={p} s={6} tone="white" a={0.7} />))}
      {PINS.map((p, i) => (
        <g key={i}>
          <Path d={`M${p[0]} ${p[1] - 10}V${p[1] - 46}M${p[0] - 5} ${p[1] - 28}h10`} tone="white" a={0.7} />
          <Ring p={[p[0], p[1] - 52]} r={6} tone={i === 2 ? "deep" : "white"} a={0.85} />
        </g>
      ))}

      {/* The orbit round the peak: far side behind the rock, near side in front with its scale */}
      <Arc e={ORB} t0={180} t1={360} tone="ink" a={0.3} dash="5 7" />
      <Arc e={ORB} t0={0} t1={180} tone="ink" a={0.58} />
      <Ticks e={ORB} t0={10} t1={170} step={2} len={6} major={5} majorLen={15} tone="ink" a={0.45} />
      <Arc e={ORB} t0={20} t1={160} s={1.18} tone="ink" a={0.22} dash="1 5" />
      <Ring p={pt(ORB, 118)} r={8} a={0.7} />
      <Square p={pt(ORB, 44)} s={5} a={0.65} />
      <Cross p={pt(ORB, 0)} s={8} a={0.55} />
      <Cross p={pt(ORB, 180)} s={8} a={0.4} />

      {/* The summit sighted */}
      <Axis a={[SUMMIT[0], SUMMIT[1] - 176]} b={[SUMMIT[0], SUMMIT[1] - 30]} op={0.4} />
      <Path d={Array.from({ length: 13 }, (_, i) => `M${SUMMIT[0] - (i % 4 === 0 ? 10 : 5)} ${SUMMIT[1] - 40 - i * 10}h${i % 4 === 0 ? 20 : 10}`).join("")} tone="ink" a={0.35} />
      <Arc e={ALT} t0={226} t1={314} tone="ink" a={0.5} />
      <Ticks e={ALT} t0={226} t1={314} step={2} len={6} major={5} majorLen={14} tone="ink" a={0.45} />
      <Ticks e={ALT} t0={226} t1={314} step={1} len={-4} tone="ink" a={0.25} />
      <Arc e={ALT} t0={262} t1={270} tone="deep" a={1} w={1.5} />
      <Square p={pt(ALT, 246)} s={4.5} a={0.6} />
      <Ring p={pt(ALT, 298)} r={5} a={0.6} />
      <Brackets p={SUMMIT} w={34} h={34} l={10} a={0.5} />
      <Cross p={SUMMIT} s={24} a={0.45} />
      <Ring p={SUMMIT} r={13} tone="deep" a={0.9} />
      <Dot p={SUMMIT} r={4.5} tone="green" a={1} />
    </g>
  );
}
