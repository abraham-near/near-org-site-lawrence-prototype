import type { ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../types";
import s from "./fine.module.css";

// Fine line (D53): Tempo's stablecoin-accounts card, taken further. Each object is the front card of a small stack
// whose tabs carry words from the station's line in small mono caps; hairlines at 0.75, white fills, a second rim
// under the front card, dotted paths with end ticks, a tiny black pill, one green element. Drawn at 240 × 180.

// Mono at 10 units: about 6.6 units a character with the tracking
const pillW = (text: string, dot: boolean) => Math.round(text.length * 6.6 + (dot ? 24 : 16));

function Pill({ x, y, text, dot = false, anchor = "start" }: { x: number; y: number; text: string; dot?: boolean; anchor?: "start" | "end" | "middle" }) {
  const w = pillW(text, dot);
  const left = anchor === "end" ? x - w : anchor === "middle" ? x - w / 2 : x;
  return (
    <g className={s.pill} transform={`translate(${left} ${y})`}>
      <rect width={w} height="16" rx="8" />
      {dot && <circle className={s.g} cx="10" cy="8" r="2.5" />}
      <text x={dot ? 17 : 8} y="11.6">{text}</text>
    </g>
  );
}

// The stack: two softly tinted tabs behind (only their tops show), a second rim under the front card, the front card
// with its mono label and a faint inset panel that holds the drawing
type Box = { x: number; y: number; w: number; h: number };
function Stack({ front, tabs, label, children, r = 7 }: { front: Box; tabs: [string, string]; label: string; children?: ReactNode; r?: number }) {
  const { x, y, w, h } = front;
  return (
    <>
      <rect className={s.card3} x={x + 16} y={y - 32} width={w - 32} height="48" rx={r - 1} />
      <text className={s.label3} x={x + 26} y={y - 19}>{tabs[0]}</text>
      <rect className={s.card2} x={x + 8} y={y - 16} width={w - 16} height="48" rx={r - 0.5} />
      <text className={s.label2} x={x + 18} y={y - 3}>{tabs[1]}</text>
      <rect className={s.under} x={x + 1.5} y={y + 4} width={w - 3} height={h} rx={r} />
      <rect className={s.card} x={x} y={y} width={w} height={h} rx={r} />
      <text className={s.label} x={x + 10} y={y + 15}>{label}</text>
      <rect className={s.panel} x={x + 6} y={y + 22} width={w - 12} height={h - 28} rx={r - 3} />
      {children}
    </>
  );
}

// A dotted run with Tempo's end ticks
const Run = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
  <>
    <path className={s.dot} d={`M${x1} ${y}H${x2}`} />
    <path className={s.soft} d={`M${x1} ${y - 3.5}v7M${x2} ${y - 3.5}v7`} />
  </>
);

// A small arrowhead pointing right at (x, y)
const Head = ({ x, y }: { x: number; y: number }) => <path className={s.head} d={`M${x} ${y}l-4.2-2.5v5z`} />;

// Data: the note's lines have become fine private dots; a "Private" pill closes the run below
const ROWS = [132, 150, 102, 120];
function Data() {
  return (
    <Stack front={{ x: 30, y: 44, w: 180, h: 120 }} tabs={["TRANSACTIONS", "PROMPTS"]} label="CONFIDENTIAL">
      <g className={s.ink}>
        {ROWS.map((l, i) => Array.from({ length: Math.floor(l / 6) + 1 }, (_, j) => <circle key={`${i}-${j}`} cx={44 + j * 6} cy={82 + i * 12} r="1.2" />))}
      </g>
      <Pill x={200} y={138} text="PRIVATE" dot anchor="end" />
    </Stack>
  );
}

// A coin with nested rims
const Coin = ({ cx, cy, green = false }: { cx: number; cy: number; green?: boolean }) => (
  <>
    <circle className={green ? s.gRing : s.face} cx={cx} cy={cy} r="13" />
    <circle className={green ? s.gInner : s.soft} cx={cx} cy={cy} r="9.5" />
    <circle className={green ? s.gInner : s.soft} cx={cx} cy={cy} r="3.5" />
  </>
);

// Assets: one account card over its stack; a hairline arc swaps one coin into the other, which is green
function Assets() {
  return (
    <Stack front={{ x: 30, y: 44, w: 180, h: 120 }} tabs={["MOVE", "HOLD"]} label="ACCOUNT">
      <path className={s.line} d="M74 114C84 74 156 74 166 114" />
      <path className={s.head} d="M166.2 114.5l-4.2-5.4 4.9-1.1z" />
      <Pill x={120} y={70} text="SWAP" anchor="middle" />
      <Coin cx={72} cy={127} />
      <Coin cx={168} cy={127} green />
      <Run x1={72} x2={168} y={152} />
    </Stack>
  );
}

// Intelligence: inside the enclave card a message enters the sealed chamber and a signed receipt leaves it
function Intelligence() {
  const pins = [82, 90, 98, 106, 114];
  return (
    <Stack front={{ x: 24, y: 44, w: 192, h: 118 }} tabs={["AGENTS", "INFERENCE"]} label="ENCLAVES">
      <g transform="translate(0 3)">
      {/* the message going in */}
      <rect className={s.face} x="38" y="85" width="36" height="26" rx="3.5" />
      <path className={s.soft} d="M45 94h22M45 101h14" />
      <path className={s.ghost} d="M77 98H90" />
      <Head x={94} y={98} />
      {/* the sealed chamber: a chip with pins and a lock */}
      <path className={s.soft} d={pins.map((y) => `M98 ${y}h-4M142 ${y}h4`).join("")} />
      <rect className={s.face} x="98" y="73" width="44" height="50" rx="3.5" />
      <rect className={s.rim} x="102.5" y="77.5" width="35" height="41" rx="2" />
      <rect className={s.line} x="112" y="96" width="16" height="12" rx="2" />
      <path className={s.line} d="M115 96v-3.2a5 5 0 0 1 10 0V96" />
      <circle className={s.ink} cx="120" cy="102" r="1.1" />
      {/* the signed receipt coming out */}
      <path className={s.ghost} d="M146 98H159" />
      <Head x={163} y={98} />
      <path className={s.face} d="M166 78h34v40l-4.25-3-4.25 3-4.25-3-4.25 3-4.25-3-4.25 3-4.25-3-4.25 3z" />
      <path className={s.soft} d="M172 87h22M172 94h14" />
      <circle className={s.g} cx="191" cy="105" r="5" />
      <path className={s.tick} d="M188.6 105l1.7 1.7 3.2-3.2" />
      </g>
      <Pill x={206} y={138} text="SIGNED PROOF" anchor="end" />
    </Stack>
  );
}

// A key hanging from (0, 0) on the ring: a bow with nested rims, a shaft drawn as two lines, two bits
const Key = ({ cls, green = false }: { cls: string; green?: boolean }) => (
  <g className={cls}>
    <circle className={green ? s.gRing : undefined} cx="0" cy="0" r="8" />
    <circle className={green ? s.gInner : undefined} cx="0" cy="0" r="5.5" />
    <circle cx="0" cy="0" r="2.4" className={green ? s.face : undefined} />
    <path className={green ? s.gShaft : undefined} d="M-1.4 8V58h2.8V8M1.4 44h6v5h-6M1.4 52h4.5v4h-4.5" />
  </g>
);

// Identity: a name badge over its stack; a split ring threaded through a hole in its corner holds the new (green) key,
// the old one turned well away in a dashed outline
const RING = { x: 155, y: 60, r: 11 };
const onRing = (deg: number) => ({ x: RING.x + RING.r * Math.sin((deg * Math.PI) / 180), y: RING.y + RING.r * Math.cos((deg * Math.PI) / 180) });
function Identity() {
  const pNew = onRing(45), pOld = onRing(130);
  return (
    <>
      <Stack front={{ x: 22, y: 44, w: 132, h: 116 }} tabs={["POST-QUANTUM", "ACCOUNT"]} label="NAME">
        <rect className={s.soft} x="76" y="50" width="24" height="4.5" rx="2.25" />
        <circle className={s.face} cx="54" cy="98" r="17" />
        <circle className={s.rim} cx="54" cy="98" r="13.5" />
        <circle className={s.line} cx="54" cy="93" r="5" />
        <path className={s.line} d="M45 108a9.5 7 0 0 1 18 0" />
        <text className={s.name} x="80" y="96">your-name</text>
        <text className={s.near} x="80" y="110">.near</text>
        <circle className={s.line} cx="145" cy="56" r="2.2" />
      </Stack>
      <circle className={s.line} cx={RING.x} cy={RING.y} r={RING.r} />
      <path className={s.soft} d={`M${RING.x + 8.6} ${RING.y - 6.9}a11 11 0 0 0-6-3.9`} />
      <g transform={`translate(${pOld.x} ${pOld.y}) rotate(-130)`}><Key cls={s.oldKey} /></g>
      <g transform={`translate(${pNew.x} ${pNew.y}) rotate(-45)`}><Key cls={s.line} green /></g>
      <Pill x={170} y={150} text="35+ CHAINS" anchor="end" />
    </>
  );
}

const ART = { data: Data, assets: Assets, intelligence: Intelligence, identity: Identity };

function FineArt({ which }: { which: OwnKey }) {
  const Art = ART[which];
  return (
    <div className={s.art} aria-hidden="true">
      <svg viewBox="0 0 240 180" focusable="false"><Art /></svg>
    </div>
  );
}

export const style: StyleDef = {
  key: "fine",
  name: "Fine line",
  refs: "Tempo (the stablecoin-accounts card)",
  summary: "Today's drawings taken to Tempo's finish: each object is the front card of a small stack whose tabs carry words from the line in small mono caps, drawn in 0.75 hairlines with a second rim, dotted runs with end ticks and a tiny black pill. One green element per drawing.",
  motion: "The tabs settle down onto the front card one after another, then the dotted run and the arc draw on and the pill fades in.",
  Art: FineArt,
};
