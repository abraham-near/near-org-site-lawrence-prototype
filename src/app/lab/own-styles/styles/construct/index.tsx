import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../types";
import s from "./construct.module.css";

// Construction (D53): each object cut down to a few bold flat forms (circles, quarter arcs, rounded rectangles, one
// 50° diagonal) in ink, grey and one green, set over the thin drawing that built them: construction circles, guide
// lines, centre marks, square anchor points. Poster-like and sparse. Drawn at 240 × 180.

const D50 = (50 * Math.PI) / 180;
const COS = Math.cos(D50), SIN = Math.sin(D50);
const r2 = (n: number) => Math.round(n * 100) / 100;

// Construction marks
const Mark = ({ x, y, size = 4, className = s.mark }: { x: number; y: number; size?: number; className?: string }) => (
  <path className={className} d={`M${x - size} ${y}h${size * 2}M${x} ${y - size}v${size * 2}`} />
);
const Sq = ({ x, y }: { x: number; y: number }) => <rect className={s.sq} x={x - 1.5} y={y - 1.5} width="3" height="3" />;
const Node = ({ x, y }: { x: number; y: number }) => <circle className={s.node} cx={x} cy={y} r="1.7" />;
const circle = (cx: number, cy: number, r: number) => `M${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}Z`;

// Sans at 10.5 units: about 5.9 units a character
function Pill({ x, y, text, anchor = "start" }: { x: number; y: number; text: string; anchor?: "start" | "middle" }) {
  const w = Math.round(text.length * 5.9 + 20);
  const left = anchor === "middle" ? x - w / 2 : x;
  return (
    <g className={s.pill} transform={`translate(${left} ${y})`}>
      <rect width={w} height="20" rx="10" />
      <text x={w / 2} y="13.8" textAnchor="middle">{text}</text>
    </g>
  );
}

// Data: the note as a grey slab, its folded corner an ink quarter disc read off a construction circle. Its first line
// still reads as a line, the next breaks apart, and the rest have become private dots: the green moment, with the
// "Private" pill set on the end of their row.
function Data() {
  const L = 64, T = 22, R = 164, B = 152, F = 32; // the note, and the fold's radius
  const note = `M${L + 10} ${T}H${R - F}A${F} ${F} 0 0 1 ${R} ${T + F}V${B - 10}a10 10 0 0 1 -10 10H${L + 10}a10 10 0 0 1 -10 -10V${T + 10}a10 10 0 0 1 10 -10Z`;
  const fold = `M${R - F} ${T + F}V${T}A${F} ${F} 0 0 1 ${R} ${T + F}Z`;
  return (
    <>
      <g>
        <path className={s.guide} d={`M20 ${T}H226M20 ${B}H226M${L} 6V176M${R} 6V176M20 116H226`} />
        <circle className={s.cons} cx={(L + R) / 2} cy={(T + B) / 2} r="58" />
        <path className={s.cons} d={circle(R - F, T + F, F)} />
      </g>
      <path className={s.grey} d={note} />
      <path className={s.ink} d={fold} />
      <g className={s.ink}>
        <rect x="80" y="72" width="56" height="8" rx="4" />
        <rect x="80" y="92" width="18" height="8" rx="4" />
        <rect x="104" y="92" width="12" height="8" rx="4" />
        <circle cx="128" cy="96" r="4" />
      </g>
      <g className={s.dots}>
        {[0, 1, 2, 3].map((j) => <circle key={`a${j}`} cx={84 + j * 13} cy="116" r="4.5" />)}
        {[0, 1, 2].map((j) => <circle key={`b${j}`} cx={84 + j * 13} cy="136" r="4.5" />)}
      </g>
      <Mark x={R - F} y={T + F} className={s.markOn} />
      <Sq x={R - F} y={T} /><Sq x={R} y={T + F} /><Sq x={L} y={B} />
      <Pill x={132} y={106} text="Private" />
    </>
  );
}

// Assets: three cards (ink, white, grey). The swap is one bold quarter arc, read off its construction circle, from the
// ink coin to the green one; its pill hangs off the arc's midpoint on a hairline.
function Assets() {
  const ox = 150, oy = 132, rr = 54, cr = 16; // the arc's centre and radius
  const a: [number, number] = [ox - rr, oy], b: [number, number] = [ox, oy - rr];
  const mid: [number, number] = [r2(ox - rr * Math.SQRT1_2), r2(oy - rr * Math.SQRT1_2)];
  return (
    <>
      <path className={s.guide} d={`M18 ${oy}H222M18 ${b[1]}H222M${a[0]} 8V176M${ox} 8V176`} />
      <rect className={s.ink} x="68" y="24" width="104" height="60" rx="12" />
      <rect className={s.white} x="56" y="36" width="128" height="60" rx="13" />
      <rect className={s.grey} x="44" y="48" width="152" height="112" rx="14" />
      <path className={s.consOn} d={circle(ox, oy, rr) + `M${ox} ${oy}L${mid[0]} ${mid[1]}`} />
      <rect className={s.ink} x="160" y="144" width="26" height="6" rx="3" />
      <path className={s.arc} d={`M${a[0]} ${a[1]}A${rr} ${rr} 0 0 1 ${b[0]} ${b[1]}`} />
      <circle className={s.ink} cx={a[0]} cy={a[1]} r={cr} />
      <circle className={s.green} cx={b[0]} cy={b[1]} r={cr} />
      <Mark x={a[0]} y={a[1]} className={s.markOn} />
      <Mark x={b[0]} y={b[1]} className={s.markG} />
      <Mark x={ox} y={oy} />
      <path className={s.lanyard} d={`M${mid[0]} ${mid[1]}L98 80`} />
      <Node x={mid[0]} y={mid[1]} />
      <Pill x={84} y={62} text="Swap" anchor="middle" />
    </>
  );
}

// Intelligence: the enclave as a sealed ink square drawn over its own construction. A message (an ink circle with one
// square corner) comes in down the 50° diagonal; the signed receipt (green, torn edge, tick) slides out underneath.
function Intelligence() {
  const cx = 96, cy = 74, h = 38; // the enclave's centre and half-size
  const at = (t: number) => [r2(cx + t * COS), r2(cy + t * SIN)];
  const [g0x, g0y] = at(-104), [g1x, g1y] = at(132);
  const [mx, my] = at(-78);
  const x0 = 92, x1 = 128, yb = 160; // the receipt
  const teeth = Array.from({ length: 9 }, (_, i) => `L${x1 - i * 4} ${yb + (i % 2 ? 4 : 0)}`).join("");
  return (
    <>
      <path className={s.guide} d={`M${g0x} ${g0y}L${g1x} ${g1y}M20 ${cy}H226M${cx} 6V176`} />
      <circle className={s.cons} cx={cx} cy={cy} r="56" />
      <path className={s.green} d={`M${x0} ${cy}H${x1}V${yb}${teeth}L${x0} ${yb}Z`} />
      <path className={s.inkLine} d={`M${x0 + 8} 126H${x1 - 8}M${x0 + 8} 133H${x1 - 14}`} />
      <path className={s.tick} d={`M${x0 + 8} 147l4 4 8-8`} />
      <rect className={s.ink} x={cx - h} y={cy - h} width={h * 2} height={h * 2} rx="6" />
      <path className={s.consDark} d={circle(cx, cy, 24) + circle(cx, cy, 12) + `M${cx - h} ${cy}H${cx + h}M${cx} ${cy - h}V${cy + h}`} />
      <Mark x={cx} y={cy} className={s.markOn} />
      <path className={s.ink} d={`${circle(mx, my, 13)}M${mx} ${my}V${my + 13}H${mx + 13}V${my}Z`} />
      <g className={s.onDark}>
        {[-5.5, 0, 5.5].map((d) => <circle key={d} cx={mx + d} cy={my} r="1.7" />)}
      </g>
      <Sq x={cx - h} y={cy - h} /><Sq x={cx + h} y={cy + h} />
      <Node x={mx + 13} y={my + 13} />
      <Pill x={142} y={124} text="Signed proof" />
    </>
  );
}

// A key: bow with a hole, a shaft, two bits; drawn along +x from its bow centre
const KEY = "M9.37 -3.5H52V10H47V3.5H43V8H38V3.5H9.37A10 10 0 1 1 9.37 -3.5ZM3.5 0A3.5 3.5 0 1 0 -3.5 0A3.5 3.5 0 1 0 3.5 0Z";

// Identity: the badge (grey, an ink disc on its construction circle for the portrait, the name) and, beside it, the key ring. The old key turns away as an outline
// along its construction circle; the new key (green) hangs on the 50° diagonal.
function Identity() {
  const kx = 160, ky = 62, kr = 11;
  const key = (deg: number) => `translate(${kx} ${ky}) rotate(${deg}) translate(${kr} 0)`;
  const [g0x, g0y] = [r2(kx - 60 * COS), r2(ky - 60 * SIN)];
  const [g1x, g1y] = [r2(kx + 112 * COS), r2(ky + 112 * SIN)];
  const sweep = 66;
  const p = (deg: number) => [r2(kx + sweep * Math.cos((deg * Math.PI) / 180)), r2(ky + sweep * Math.sin((deg * Math.PI) / 180))];
  const [s0x, s0y] = p(-28), [s1x, s1y] = p(42);
  return (
    <>
      <path className={s.guide} d={`M${g0x} ${g0y}L${g1x} ${g1y}M20 ${ky}H226M20 52H226`} />
      <circle className={s.cons} cx={kx} cy={ky} r={kr + 52} />
      <path className={s.arrowArc} d={`M${s0x} ${s0y}A${sweep} ${sweep} 0 0 1 ${s1x} ${s1y}`} />
      <rect className={s.grey} x="34" y="52" width="88" height="116" rx="14" />
      <rect className={s.ink} x="66" y="62" width="24" height="7" rx="3.5" />
      <circle className={s.consOn} cx="78" cy="100" r="22" />
      <path className={s.consOn} d="M52 100H104M78 74V126" />
      <circle className={s.ink} cx="78" cy="100" r="13" />
      <Mark x={78} y={100} className={s.markOn} />
      <text className={s.name} x="78" y="146" textAnchor="middle">your-name</text>
      <text className={`${s.name} ${s.muted}`} x="78" y="159" textAnchor="middle">.near</text>
      <path className={s.lanyard} d={`M90 65.5H${kx - kr}`} />
      <path className={s.oldKey} d={KEY} transform={key(-28)} fillRule="evenodd" />
      <path className={s.green} d={KEY} transform={key(50)} fillRule="evenodd" />
      <circle className={s.ring} cx={kx} cy={ky} r={kr} />
      <Mark x={kx} y={ky} />
      <Sq x={34} y={52} /><Sq x={122} y={52} />
      <Pill x={150} y={150} text="35+ chains" />
    </>
  );
}

const ART = { data: Data, assets: Assets, intelligence: Intelligence, identity: Identity };

function ConstructArt({ which }: { which: OwnKey }) {
  const Art = ART[which];
  return (
    <div className={s.art} aria-hidden="true">
      <svg viewBox="0 0 240 180" focusable="false"><Art /></svg>
    </div>
  );
}

export const style: StyleDef = {
  key: "construct",
  name: "Construction",
  refs: "Momentum, Fractalized (construction drawings)",
  summary:
    "Each object cut down to a few bold flat forms (circles, quarter arcs, rounded rectangles, one 50° diagonal) in ink, grey and one green, over the thin construction circles, guides and centre marks that built them. Poster-like, with plenty of air.",
  motion:
    "The construction lines draw on first, then the solid forms fade and scale in on their centre marks one by one, the green form last; the guides then fade back.",
  Art: ConstructArt,
};
