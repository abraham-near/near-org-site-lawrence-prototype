import type { ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../types";
import s from "./survey.module.css";

// Survey (D53), after PARK Stuttgart's instrument detail and Arc'teryx's viewfinders: each object drawn in hairline as
// a measured drawing on a faint dot-grid plate, with crosshair nodes on its key points, dimension and leader lines out
// to small mono words from the line (never numbers or coordinates), registration targets and a tick scale. The green
// node marks the thing that's yours. Drawn at 240 × 180.

const CH = 6.6; // mono at 10 units, with tracking

// The instrument frame: a tick scale along the top and two registration targets at matching insets (14, 8) from
// opposite corners. The dot grid and its feathered paper wash are the .field layer under the SVG (survey.module.css).
const INSET = { x: 14, y: 8 };
function Field() {
  const { x, y } = INSET;
  const ticks: string[] = [];
  for (let i = 0, tx = x + 10; tx <= 240 - x - 10; i++, tx += 4) ticks.push(`M${tx} ${y}v${i % 5 === 0 ? 4.5 : 2}`);
  return (
    <>
      <path className={s.scale} d={`M${x + 10} ${y}H${240 - x - 10}${ticks.join("")}`} />
      <Reg x={x} y={y} />
      <Reg x={240 - x} y={180 - y} />
    </>
  );
}

const Reg = ({ x, y }: { x: number; y: number }) => (
  <g className={s.reg}><circle cx={x} cy={y} r="3.2" /><path d={`M${x - 6} ${y}h12M${x} ${y - 6}v12`} /></g>
);

// A crosshair node: a small ring with four arms that stop short of it
function Node({ x, y, green = false }: { x: number; y: number; green?: boolean }) {
  return (
    <g>
      <path className={s.arm} d={`M${x - 7} ${y}h3.6M${x + 3.4} ${y}h3.6M${x} ${y - 7}v3.6M${x} ${y + 3.4}v3.6`} />
      <circle className={green ? s.gNode : s.node} cx={x} cy={y} r="2.4" />
    </g>
  );
}

// A leader: from a node, a diagonal, then a shoulder that underlines the word
function Leader({ d, x, y, text, anchor = "start" }: { d: string; x: number; y: number; text: string; anchor?: "start" | "end" }) {
  return (
    <>
      <path className={s.dim} d={d} />
      <text className={s.label} x={x} y={y} textAnchor={anchor}>{text}</text>
    </>
  );
}

// Architectural slash ticks at a dimension's ends
const slash = (x: number, y: number) => `M${x - 2.2} ${y + 2.2}l4.4-4.4`;

// A horizontal dimension: extension lines from the object, the line with slash ends, the word above it
function DimH({ x1, x2, y, from1, from2, text }: { x1: number; x2: number; y: number; from1: number; from2: number; text: string }) {
  return (
    <>
      <path className={s.dim} d={`M${x1} ${from1}V${y - 3}M${x2} ${from2}V${y - 3}M${x1 - 3} ${y}H${x2 + 3}${slash(x1, y)}${slash(x2, y)}`} />
      <text className={s.label} x={(x1 + x2) / 2} y={y - 3.5} textAnchor="middle">{text}</text>
    </>
  );
}

// A callout tag: paper box, hairline, index square, mono word
function Tag({ x, y, text, anchor = "start" }: { x: number; y: number; text: string; anchor?: "start" | "end" }) {
  const w = Math.round(text.length * CH + 20);
  const left = anchor === "end" ? x - w : x;
  return (
    <g className={s.tag} transform={`translate(${left} ${y})`}>
      <rect width={w} height="16" />
      <rect className={s.idx} x="5" y="6.5" width="3" height="3" />
      <text x="13" y="11.6">{text}</text>
    </g>
  );
}

const Draw = ({ children }: { children: ReactNode }) => <><Field />{children}</>;

// Data: the note in elevation, its lines now private squares; leaders name what the lines were (prompts,
// transactions), and the green node on the last row leads out to the "Private" tag
const ROWS = [60, 66, 42, 54];
function Data() {
  return (
    <Draw>
      <path className={s.obj} d="M72 30H138L156 48V142H72Z" />
      <path className={s.edge} d="M138 30V48H156" />
      <path className={s.fine} d="M80 54H130" />
      <g className={s.ink}>
        {ROWS.map((l, i) => Array.from({ length: Math.floor(l / 6) + 1 }, (_, j) => <rect key={`${i}-${j}`} x={81 + j * 6} y={64 + i * 13} width="2.2" height="2.2" />))}
      </g>
      <Node x={76.5} y={65.1} />
      <Leader d="M74.8 63.4L68 50H18" x={20} y={47} text="PROMPTS" />
      <Node x={76.5} y={104.1} />
      <Leader d="M77.5 106.4L86 156H168" x={88} y={153} text="TRANSACTIONS" />
      <Node x={130} y={91.1} green />
      <path className={s.dim} d="M132.4 93.5L150 118H158" />
      <Tag x={224} y={110} text="PRIVATE" anchor="end" />
      <Node x={156} y={48} />
    </Draw>
  );
}

// A coin in plan: rim, inner rim, centre lines through it
const Coin = ({ cx, cy, green = false }: { cx: number; cy: number; green?: boolean }) => (
  <>
    <circle className={green ? s.gFill : s.obj} cx={cx} cy={cy} r="13" />
    <circle className={green ? s.gRim : s.fine} cx={cx} cy={cy} r="9" />
    <path className={s.centre} d={`M${cx - 18} ${cy}h36M${cx} ${cy - 18}v36`} />
  </>
);

// Assets: the account card in plan with the cards behind as hidden (dashed) edges; the swap arc between two coins,
// the destination green; the move measured beneath
function Assets() {
  return (
    <Draw>
      <rect className={s.hidden} x="52" y="34" width="144" height="80" rx="5" />
      <rect className={s.hidden} x="44" y="44" width="156" height="80" rx="5.5" />
      <rect className={s.obj} x="36" y="54" width="168" height="102" rx="6" />
      <Coin cx={78} cy={120} />
      <Coin cx={162} cy={120} green />
      <path className={s.edge} d="M78 107C88 72 152 72 162 107" />
      <path className={s.ink} d="M162.3 107.6l-4.4-5.2 4.9-1.2z" />
      <DimH x1={78} x2={162} y={147} from1={137} from2={137} text="MOVE" />
      <Node x={120} y={80.8} />
      <path className={s.dim} d="M122 78.5L130 67H134" />
      <Tag x={134} y={59} text="SWAP" />
      <Node x={36} y={54} />
      <Leader d="M36 46.5V30H90" x={40} y={27} text="ACCOUNT" />
    </Draw>
  );
}

// Intelligence: the enclave as a chip in plan (pins, die, bond lines); a request goes in, the signed receipt comes out
// with the green node on its seal, led down to the "Signed proof" tag
function Intelligence() {
  const pins = [68, 76, 84, 92, 100, 108];
  return (
    <Draw>
      <path className={s.edge} d={pins.map((p) => `M${p + 30} 60v-5M${p + 30} 116v5M92 ${p - 2}h-5M148 ${p - 2}h5`).join("")} />
      <rect className={s.obj} x="92" y="60" width="56" height="56" rx="2" />
      <rect className={s.edge} x="106" y="74" width="28" height="28" rx="1" />
      <path className={s.fine} d="M96 64l10 10M144 64l-10 10M96 112l10-10M144 112l-10-10" />
      <path className={s.centre} d="M100 88h40M120 68v40" />
      <DimH x1={92} x2={148} y={44} from1={52} from2={52} text="HARDWARE" />
      {/* the request in */}
      <rect className={s.obj} x="30" y="76" width="34" height="24" rx="2" />
      <path className={s.fine} d="M36 84h22M36 91h14" />
      <path className={s.hidden} d="M66 88H81" />
      <path className={s.ink} d="M85 88l-4.4-2.6v5.2z" />
      {/* the signed receipt out */}
      <path className={s.hidden} d="M155 88H169" />
      <path className={s.ink} d="M173 88l-4.4-2.6v5.2z" />
      <path className={s.obj} d="M176 70h30v42l-3.75-2.6-3.75 2.6-3.75-2.6-3.75 2.6-3.75-2.6-3.75 2.6-3.75-2.6-3.75 2.6z" />
      <path className={s.fine} d="M181 78h20M181 85h13" />
      <Node x={106} y={102} />
      <Leader d="M104.3 103.7L80 132H22" x={24} y={129} text="INFERENCE" />
      <Node x={193} y={99} green />
      <path className={s.dim} d="M193 102.4V136" />
      <Tag x={224} y={136} text="SIGNED PROOF" anchor="end" />
    </Draw>
  );
}

// A key hanging from (0, 0) on the ring: bow, shaft, two bits
const Key = ({ cls }: { cls: string }) => (
  <g className={cls}>
    <circle cx="0" cy="0" r="7" />
    <circle cx="0" cy="0" r="2.6" />
    <path d="M-1.3 7V46h2.6V7M1.3 34h5.5v4.5h-5.5M1.3 41h4v3.5h-4" />
  </g>
);

// Identity: the badge in elevation, corded to a ring beside it; the old key turned away in phantom line, the new key
// green with the green node on its bow, the turn measured as an angle and named "rotation"
const C = { x: 142, y: 46, r: 11 }; // ring
const polar = (deg: number, r: number) => ({ x: C.x + r * Math.sin((deg * Math.PI) / 180), y: C.y + r * Math.cos((deg * Math.PI) / 180) });
function Identity() {
  const pNew = polar(0, C.r), pOld = polar(80, C.r);
  const a = polar(4, 34), b = polar(76, 34), mid = polar(40, 34);
  return (
    <Draw>
      <rect className={s.obj} x="28" y="48" width="94" height="104" rx="6" />
      <rect className={s.edge} x="63" y="54" width="24" height="4.5" rx="2.25" />
      <circle className={s.obj} cx="75" cy="84" r="14" />
      <circle className={s.edge} cx="75" cy="80" r="4.4" />
      <path className={s.edge} d="M67 93a8 6 0 0 1 16 0" />
      <path className={s.centre} d="M56 84h38M75 65v38" />
      <text className={s.name} x="75" y="121" textAnchor="middle">your-name</text>
      <text className={s.near} x="75" y="135" textAnchor="middle">.near</text>
      <circle className={s.edge} cx="114" cy="56" r="2.2" />
      <path className={s.edge} d="M116.1 55.3L131.4 49.6" />
      <circle className={s.edge} cx={C.x} cy={C.y} r={C.r} />
      <g transform={`translate(${pOld.x} ${pOld.y}) rotate(-80)`}><Key cls={s.phantom} /></g>
      <g transform={`translate(${pNew.x} ${pNew.y})`}><Key cls={s.gFill} /></g>
      {/* the turn, measured */}
      <path className={s.dim} d={`M${a.x} ${a.y}A34 34 0 0 0 ${b.x} ${b.y}${slash(a.x, a.y)}${slash(b.x, b.y)}`} />
      <Leader d={`M${mid.x} ${mid.y}L178 92H226`} x={224} y={89} text="ROTATION" anchor="end" />
      <Node x={28} y={152} />
      <Node x={pNew.x} y={pNew.y} green />
      <Leader d={`M${C.x + 1} ${C.y - C.r - 2.4}L154 24H226`} x={224} y={21} text="POST-QUANTUM" anchor="end" />
      <Tag x={224} y={148} text="35+ CHAINS" anchor="end" />
    </Draw>
  );
}

const ART = { data: Data, assets: Assets, intelligence: Intelligence, identity: Identity };

function SurveyArt({ which }: { which: OwnKey }) {
  const Art = ART[which];
  return (
    <div className={s.art} aria-hidden="true">
      <span className={s.field} />
      <svg viewBox="0 0 240 180" focusable="false"><Art /></svg>
    </div>
  );
}

export const style: StyleDef = {
  key: "survey",
  name: "Survey",
  refs: "PARK Stuttgart, Arc'teryx viewfinders",
  summary: "Each object as a measured drawing: a hairline outline on a faint dot-grid field that feathers into the mist, with crosshair nodes on its key points, dimension and leader lines out to small mono words from the line, registration targets and a tick scale. One green node marks the thing that's yours.",
  motion: "The grid and tick scale fade in, the object draws on, then the dimension and leader lines extend from their nodes and the words fade in, the green node last.",
  Art: SurveyArt,
};
