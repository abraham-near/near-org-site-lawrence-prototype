import type { CSSProperties, ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../types";
import s from "./glass.module.css";

// "Frosted" (D53, after Microsoft Pixel R&D): the one rendered material. Each object is built from overlapping frosted
// glass panes (HTML layers with backdrop blur over the ridges); one pane per drawing is fluted, its lamellae break up
// whatever sits behind it, and a fringe of thin offset bands along its edge resolves to green. Vector hairlines sit on
// top. Drawn on the 240 × 180 box; layers stack in DOM order (a pane only blurs what comes before it).

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const box = (x: number, y: number, w: number, h: number): CSSProperties => ({ left: pct(x, 240), top: pct(y, 180), width: pct(w, 240), height: pct(h, 180) });

type PaneProps = { x: number; y: number; w: number; h: number; r?: number; cls?: string; children?: ReactNode };
const Pane = ({ x, y, w, h, r = 6, cls = "", children }: PaneProps) => (
  <div className={`${s.pane} ${cls}`} style={{ ...box(x, y, w, h), "--r": r } as CSSProperties}>{children}</div>
);
// A fluted face inside a pane: vertical ribs from `from` to `to` (0–1 of the width), or horizontal (`h`) of the height
const Ribs = ({ from = 0, to = 1, h = false }: { from?: number; to?: number; h?: boolean }) => (
  <i className={`${s.ribs} ${h ? s.ribsH : ""}`} style={h ? { left: 0, right: 0, top: `${from * 100}%`, bottom: `${(1 - to) * 100}%` } : { left: `${from * 100}%`, right: `${(1 - to) * 100}%` }} />
);
// The lamellae's bending: re-blurs alternate strips of whatever is behind the fluted box
const Bend = ({ x, y, w, h, r = 6, horizontal = false, cls = "" }: { x: number; y: number; w: number; h: number; r?: number; horizontal?: boolean; cls?: string }) => (
  <i className={`${s.bend} ${horizontal ? s.bendH : ""} ${cls}`} style={{ ...box(x, y, w, h), borderRadius: `calc(var(--u) * ${r})` }} />
);
// The fringe: vertical at x from y0 to y1, or horizontal at y from x0 to x1
const FringeV = ({ x, y0, y1 }: { x: number; y0: number; y1: number }) => (
  <i className={s.fringe} style={{ left: pct(x - 5, 240), top: pct(y0, 180), height: pct(y1 - y0, 180) }} />
);
const FringeH = ({ y, x0, x1 }: { y: number; x0: number; x1: number }) => (
  <i className={`${s.fringe} ${s.fringeH}`} style={{ top: pct(y - 5, 180), left: pct(x0, 240), width: pct(x1 - x0, 240) }} />
);
// A face of the thick block, as a polygon of design points
const Face = ({ pts, cls }: { pts: [number, number][]; cls: string }) => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys), w = Math.max(...xs) - x, h = Math.max(...ys) - y;
  const poly = pts.map(([px, py]) => `${((px - x) / w) * 100}% ${((py - y) / h) * 100}%`).join(", ");
  return <div className={`${s.face} ${cls}`} style={{ ...box(x, y, w, h), clipPath: `polygon(${poly})` }} />;
};
const TagBg = ({ x, y, w }: { x: number; y: number; w: number }) => <div className={s.tag} style={box(x, y, w, 20)} />;
const TagText = ({ x, y, w, text, dot = false }: { x: number; y: number; w: number; text: string; dot?: boolean }) => (
  <g transform={`translate(${x} ${y})`}>
    {dot && <circle className={s.g} cx="11" cy="10" r="3" />}
    <text className={s.tagText} x={dot ? (w + 10) / 2 : w / 2} y="13.5" textAnchor="middle">{text}</text>
  </g>
);
const Svg = ({ children }: { children: ReactNode }) => <svg viewBox="0 0 240 180" focusable="false">{children}</svg>;
// Registration cross: a hairline + with a small gap at its centre
const Cross = ({ x, y, r = 3.5 }: { x: number; y: number; r?: number }) => (
  <path className={s.hair} d={`M${x - r} ${y}h${r - 1}M${x + 1} ${y}h${r - 1}M${x} ${y - r}v${r - 1}M${x} ${y + 1}v${r - 1}`} />
);

// Data: a fluted privacy pane stands in front of the note. Where the note's lines pass behind it they come apart into
// dots, broken up by the lamellae; the pane runs on past the note over the ridges. "Private" tag.
const ROWS = [104, 116, 96, 110, 100, 84];
function Data() {
  const fx = 100; // the fluted pane's left edge
  return (
    <>
      <Pane x={32} y={30} w={130} h={130} r={6} />
      <Svg>
        <path className={s.line} d="M44 46h26" style={{ strokeOpacity: 0.85 }} />
        {ROWS.map((l, i) => {
          const y = 64 + i * 15, end = 44 + l;
          return (
            <g key={i}>
              <path className={s.line} d={`M44 ${y}H${fx - 6}`} />
              {Array.from({ length: Math.max(0, Math.floor((end - fx - 4) / 6.5)) }, (_, j) => <circle key={j} className={s.ink} cx={fx + 5 + j * 6.5} cy={y} r="2" />)}
            </g>
          );
        })}
      </Svg>
      <Pane x={fx} y={14} w={100} h={132} r={6} cls={s.clear}><Ribs /></Pane>
      <Bend x={fx} y={14} w={100} h={132} cls={s.bendSoft} />
      <FringeV x={fx} y0={16} y1={144} />
      <TagBg x={126} y={150} w={70} />
      <Svg>
        <Cross x={22} y={20} /><Cross x={214} y={160} />
        <path className={s.faint} d={Array.from({ length: 6 }, (_, i) => `M${120 + i * 14} 10.5v-3`).join("")} />
        <TagText x={126} y={150} w={70} text="Private" dot />
      </Svg>
    </>
  );
}

// Assets: one account as three panes cascading down and to the right, each seen through the next; the front one carries
// a fluted band. Two discs below: clear fluted glass, and the destination in flat green glass, with the swap arc
// between them. "Swap" tag.
function Assets() {
  return (
    <>
      <Pane x={30} y={10} w={128} h={84} r={8} cls={s.far} />
      <Pane x={48} y={28} w={128} h={84} r={8} cls={s.far} />
      <Pane x={66} y={46} w={128} h={84} r={8}><Ribs from={0} to={0.3} /></Pane>
      <Bend x={66} y={46} w={128 * 0.3} h={84} r={8} />
      <FringeV x={66 + 128 * 0.3} y0={48} y1={128} />
      <Pane x={70} y={136} w={34} h={34} cls={s.round}><Ribs /></Pane>
      <Pane x={158} y={136} w={34} h={34} cls={`${s.round} ${s.green}`} />
      <TagBg x={109} y={158} w={44} />
      <Svg>
        <path className={s.line} d="M150 104h32M164 113h18" />
        <circle className={s.faint} cx="175" cy="153" r="11" style={{ stroke: "var(--color-forest)", strokeOpacity: 0.5 }} />
        <path className={s.dash} d="M104 148Q131 132 157 148" />
        <path className={s.hair} d="M152.4 143.3l4.6 4.7-6.4 1.2" />
        <Cross x={20} y={104} /><Cross x={212} y={34} />
        <TagText x={109} y={158} w={44} text="Swap" />
      </Svg>
    </>
  );
}

// Intelligence: a thick glass block, fluted across its front. A message travels in from the left; a signed receipt
// comes out of the right side. "Signed proof" tag.
function Intelligence() {
  const d = 14, x = 74, y = 52, w = 88, h = 78; // the block's front face, and its depth up and to the right
  return (
    <>
      <Pane x={170} y={82} w={52} h={34} r={2} cls={s.paper} />
      <Svg>
        <path className={s.line} d="M184 93h22M184 101h14" />
        <circle className={s.g} cx="210" cy="104" r="5" />
        <path className={s.check} d="M207.8 104.2l1.6 1.6 3-3.2" />
      </Svg>
      <Face pts={[[x, y], [x + d, y - d], [x + w + d, y - d], [x + w, y]]} cls={s.top} />
      <Face pts={[[x + w, y], [x + w + d, y - d], [x + w + d, y + h - d], [x + w, y + h]]} cls={s.side} />
      <Pane x={x} y={y} w={w} h={h} r={2}><Ribs from={0.08} to={0.92} /></Pane>
      <Bend x={x + w * 0.08} y={y} w={w * 0.84} h={h} r={0} />
      <FringeV x={x + w * 0.08} y0={y + 2} y1={y + h - 2} />
      <Pane x={12} y={64} w={46} h={26} r={9} />
      <TagBg x={122} y={146} w={86} />
      <Svg>
        <path className={s.hair} d={`M${x} ${y}l${d} ${-d}h${w}M${x + w} ${y}l${d} ${-d}v${h}l${-d} ${d}`} />
        <path className={s.hair} d="M222 82l-3 4.3 3 4.2-3 4.3 3 4.2-3 4.3 3 4.2-3 4.3 3 4.2" />
        {/* the sealed core: a dashed square seen through the flutes */}
        <rect className={s.dash} x="102" y="75" width="32" height="32" rx="2" style={{ strokeOpacity: 0.6 }} />
        <circle className={s.ink} cx="25" cy="77" r="1.8" /><circle className={s.ink} cx="35" cy="77" r="1.8" /><circle className={s.ink} cx="45" cy="77" r="1.8" />
        <path className={s.dash} d="M60 77h10" />
        <path className={s.hair} d="M66.5 73.5l3.5 3.5-3.5 3.5" />
        <text className={s.micro} x="74" y="146">Inference</text>
        <Cross x={20} y={130} /><Cross x={210} y={30} />
        <TagText x={122} y={146} w={86} text="Signed proof" dot />
      </Svg>
    </>
  );
}

// Identity: a tall glass badge with a fluted clip band. The key ring hangs from its right side: the new key hangs
// straight down in green glass, the old key swings away beside it. "35+ chains" tag.
function Identity() {
  const rx = 174, ry = 50; // the key ring
  const key = (
    <>
      <circle className={s.hair} cx={rx} cy={ry + 19} r="9" />
      <path className={s.hair} d={`M${rx} ${ry + 28}v44M${rx} ${ry + 61}h7M${rx} ${ry + 68}h5`} />
    </>
  );
  return (
    <>
      <Pane x={46} y={22} w={100} h={132} r={10}><Ribs h from={0} to={0.2} /></Pane>
      <Bend x={46} y={22} w={100} h={132 * 0.2} r={10} horizontal />
      <FringeH y={22 + 132 * 0.2} x0={48} x1={144} />
      <Pane x={rx - 9} y={ry + 10} w={18} h={18} cls={`${s.round} ${s.green}`} />
      <TagBg x={118} y={146} w={76} />
      <Svg>
        <rect className={s.hair} x="84" y="30" width="24" height="5" rx="2.5" />
        <circle className={s.hair} cx="96" cy="78" r="12" />
        <path className={s.hair} d="M87.5 87.5a9 7 0 0 1 17 0" />
        <text className={s.name} x="96" y="114" textAnchor="middle">your-name</text>
        <text className={`${s.name} ${s.muted}`} x="96" y="128" textAnchor="middle">.near</text>
        {/* the ring, on a strap from the badge's edge */}
        <path className={s.hair} d={`M146 ${ry}H${rx - 10}`} />
        <circle className={s.hair} cx={rx} cy={ry} r="10" />
        <g className={s.ghost} transform={`rotate(-38 ${rx} ${ry})`}>{key}</g>
        <circle className={s.hair} cx={rx} cy={ry + 19} r="3" style={{ stroke: "var(--color-forest)" }} />
        <path className={s.gLine} d={`M${rx} ${ry + 28}v44M${rx} ${ry + 61}h7M${rx} ${ry + 68}h5`} />
        <Cross x={30} y={14} /><Cross x={30} y={166} />
        <TagText x={118} y={146} w={76} text="35+ chains" />
      </Svg>
    </>
  );
}

const ART = { data: Data, assets: Assets, intelligence: Intelligence, identity: Identity };

function FrostedArt({ which }: { which: OwnKey }) {
  const Art = ART[which];
  return <div className={s.art} aria-hidden="true"><Art /></div>;
}

export const style: StyleDef = {
  key: "glass",
  name: "Frosted",
  refs: "Microsoft Pixel R&D",
  summary: "Each object is built from overlapping frosted glass panes over the misty ridges, so you see one pane through the next. One pane per drawing is fluted: its lamellae break up whatever is behind it, and a fringe of thin bands along its edge resolves to green. Fine ink hairlines sit on top, and flat green glass marks what's yours.",
  motion: "Panes slide into their overlap and the frost settles (blur eases in), the fringe fades up along the fluted edge, then the one change plays: the lines pass behind the flutes as dots, the green disc fades in at the end of the arc, the receipt slides out of the block, the old key swings away as the green one settles.",
  Art: FrostedArt,
};
