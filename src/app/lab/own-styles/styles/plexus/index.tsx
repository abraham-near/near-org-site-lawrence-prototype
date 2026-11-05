import type { ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../types";
import { fade, rise, ticks, type Pt, type Seg } from "./mesh";
import styles from "./plexus.module.css";

// Plexus (D53), after Sui's one motif and the hero's tracked layer (chapter-one/layer): the hero's lines and dust reach
// down into the story and touch each object. The objects are plain hairline drawings over a veil of paper, with nodes
// only at a handful of anchor points; from those anchors a few long tracked lines run off towards distant points, fading
// along their length, and two or three motes of dust rise off each object on lines that fade as they lengthen. The owned
// point is the hero's green node in its ring of ticks. No light ever runs along a line (D45). Drawn at 240 × 180.

// Segments grouped by strength, one path each
function Lines({ segs, w = 0.6, green = false }: { segs: Seg[]; w?: number; green?: boolean }) {
  const by = new Map<number, string>();
  for (const s of segs) { const o = Math.round(s.o * 50) / 50; if (o > 0) by.set(o, (by.get(o) ?? "") + s.d); }
  return <>{[...by].map(([o, d]) => <path key={o} className={green ? styles.gline : styles.line} strokeWidth={w} strokeOpacity={o} d={d} />)}</>;
}

// The atmosphere around an object: long lines from its anchors to far points, and dust rising off it
function Air({ long, from, motes }: { long: [Pt, Pt][]; from: Pt; motes: Pt[] }) {
  const dust = rise(from, motes);
  return (
    <>
      <Lines segs={long.flatMap(([a, b]) => fade(a, b, 0.6, 0, 14))} w={0.55} />
      {long.map(([, b], i) => <circle key={i} className={styles.dot} cx={b[0]} cy={b[1]} r="0.8" opacity="0.25" />)}
      <Lines segs={dust.lines} w={0.45} />
      {dust.dots.map((d, i) => <circle key={`m${i}`} className={styles.dot} cx={d.x} cy={d.y} r={d.r} opacity={d.o} />)}
    </>
  );
}

const Node = ({ at: [x, y] }: { at: Pt }) => <circle className={styles.ring} cx={x} cy={y} r="2" />;

// The owned point: a green node in a ticked ring
const You = ({ at: [x, y], children }: { at: Pt; children?: ReactNode }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle className={styles.youRing} r="4.6" />
    <path className={styles.youTicks} d={ticks(6.2, 7.8)} />
    <circle className={styles.you} r="2.4" />
    {children}
  </g>
);

const Tag = ({ x, y, w, text, from }: { x: number; y: number; w: number; text: string; from?: [Pt, Pt] }) => (
  <>
    {from && <path className={styles.leader} d={`M${from[0][0]} ${from[0][1]}L${from[1][0]} ${from[1][1]}`} />}
    <g className={styles.tag} transform={`translate(${x} ${y})`}>
      <rect width={w} height="19" />
      <text x={w / 2} y="13" textAnchor="middle">{text}</text>
    </g>
  </>
);

// Data: a note (another behind it); its first lines are text, the rest have become private dots. The owned point sits on
// its edge, the tag hung off to the side
function Data() {
  const ROWS = [76, 84, 60, 70, 48];
  return (
    <>
      <Air long={[[[52, 34], [6, 6]], [[52, 152], [8, 172]], [[156, 152], [234, 168]]]} from={[146, 40]} motes={[[162, 16], [178, 8], [164, 2]]} />
      <path className={styles.back} d="M62 24h82l22 22v96H62z" />
      <path className={styles.object} d="M52 34h82l22 22v96H52z" />
      <path className={styles.object} d="M134 34v22h22" />
      {ROWS.map((len, i) => {
        const y = 66 + i * 14;
        if (i < 2) return <path key={i} className={styles.text} d={`M66 ${y}h${len * 0.42}M${66 + len * 0.46} ${y}h${len * 0.54}`} />;
        const from = i === 2 ? 66 + 26 : 66;
        return (
          <g key={i}>
            {i === 2 && <path className={styles.text} d={`M66 ${y}h20`} />}
            {Array.from({ length: Math.floor((66 + len - from) / 8) + 1 }, (_, k) => <circle key={k} className={styles.dot} cx={from + 2 + k * 8} cy={y} r="1.8" />)}
          </g>
        );
      })}
      <Node at={[52, 34]} />
      <Node at={[52, 152]} />
      <You at={[156, 106]} />
      <Tag x={170} y={97} w={58} text="Private" from={[[163.8, 106], [170, 106]]} />
    </>
  );
}

// Assets: the account as a stack of cards turned a little away, two coins in front and the swap arcing between them;
// the coin it arrives at is solid green, in its ring of ticks
function Assets() {
  const skew = "matrix(1 0 -0.12 1 14.4 0)"; // x' = x − 0.12 (y − 120)
  return (
    <>
      <Air long={[[[49.9, 54], [4, 34]], [[64.8, 30], [30, 4]], [[196.8, 30], [238, 12]]]} from={[160, 132]} motes={[[178, 110], [194, 102], [186, 92]]} />
      <g transform={skew}>
        <rect className={styles.back} x="54" y="30" width="132" height="86" rx="6" />
        <rect className={styles.mid} x="48" y="42" width="144" height="90" rx="6" />
        <rect className={styles.object} x="42" y="54" width="156" height="96" rx="6" />
        <path className={styles.text} d="M56 72h30" />
      </g>
      <path className={styles.dash} d="M93 134Q123 100 153 134" />
      <circle className={styles.object} cx="86" cy="146" r="13" />
      <circle className={styles.inner} cx="86" cy="146" r="9" />
      <g transform="translate(160 146)">
        <circle className={styles.youRing} r="16.5" />
        <path className={styles.youTicks} d="M0-19v4M19 0h-4M0 19v-4M-19 0h4" />
        <circle className={styles.you} r="13" />
      </g>
      <Node at={[49.9, 54]} />
      <Node at={[64.8, 30]} />
      <Tag x={105} y={96} w={36} text="Swap" />
    </>
  );
}

// Intelligence: the enclave as a sealed block in hairline, a message dropping into the slot on top and a signed receipt
// coming out of the slit in front, sealed by the owned point
function Intelligence() {
  return (
    <>
      <Air long={[[[172, 64], [236, 76]], [[64, 146], [8, 168]], [[64, 82], [8, 58]]]} from={[158, 64]} motes={[[170, 40], [186, 30], [176, 22]]} />
      <path className={styles.object} d="M64 82l22-18h86l-22 18zM150 82l22-18v64l-22 18zM64 82h86v64H64z" />
      <path className={styles.slotFill} d="M103 75.5h26l5-4.5h-26z" />
      <path className={styles.object} d="M102 16h32a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6h-10l-6 6-6-6h-10a6 6 0 0 1-6-6V22a6 6 0 0 1 6-6z" />
      {[108, 118, 128].map((x) => <circle key={x} className={styles.dot} cx={x} cy="27" r="1.5" />)}
      <path className={styles.dash} d="M118 47V70" />
      <path className={styles.slit} d="M86 128h40" />
      <path className={styles.object} d="M90 128.5h32v36l-4 4-4-4-4 4-4-4-4 4-4-4-4 4-4-4z" />
      <path className={styles.text} d="M96 137h18M96 143h11" />
      <Node at={[172, 64]} />
      <Node at={[64, 146]} />
      <You at={[112, 154]} />
      <Tag x={136} y={145} w={84} text="Signed proof" from={[[119.8, 154], [136, 154]]} />
    </>
  );
}

// A key in its own frame: bow at the origin, the shaft along +x
const KEY = "M7.6 0H50M40 0v7M48 0v5";

// Identity: an ID badge on a key ring; the old key has turned away (faint), the new key's bow is the owned point
function Identity() {
  return (
    <>
      <Air long={[[[72, 146], [8, 170]], [[168, 50], [236, 34]], [[110, 18], [30, 4]]]} from={[188, 30]} motes={[[200, 12], [214, 6], [206, -4]]} />
      <g className={styles.old} transform="translate(120 24) rotate(152) translate(19 0)">
        <circle className={styles.line} r="7.6" strokeWidth="0.6" />
        <path className={styles.line} strokeWidth="0.6" d={KEY} />
      </g>
      <circle className={styles.ringLine} cx="120" cy="24" r="11" />
      <path className={styles.object} d="M120 35v15" />
      <rect className={styles.object} x="72" y="50" width="96" height="96" rx="8" />
      <rect className={styles.object} x="108" y="57" width="24" height="5" rx="2.5" />
      <circle className={styles.object} cx="120" cy="84" r="13" />
      <circle className={styles.object} cx="120" cy="80" r="4.5" />
      <path className={styles.object} d="M111.5 93.5a8.5 7 0 0 1 17 0" />
      <text className={styles.name} x="120" y="118" textAnchor="middle">your-name</text>
      <text className={`${styles.name} ${styles.muted}`} x="120" y="132" textAnchor="middle">.near</text>
      <g transform="translate(120 24) rotate(8) translate(19 0)">
        <path className={styles.gline} strokeWidth="1.2" d={KEY} />
        <You at={[0, 0]} />
      </g>
      <Node at={[72, 146]} />
      <Node at={[168, 50]} />
      <Node at={[168, 146]} />
      <Tag x={132} y={156} w={72} text="35+ chains" from={[[168, 148], [168, 156]]} />
    </>
  );
}

const ART = { data: Data, assets: Assets, intelligence: Intelligence, identity: Identity };

function PlexusArt({ which }: { which: OwnKey }) {
  const Art = ART[which];
  return (
    <div className={styles.art} data-art={which} aria-hidden="true">
      <svg viewBox="0 0 240 180" focusable="false"><Art /></svg>
    </div>
  );
}

export const style: StyleDef = {
  key: "plexus",
  name: "Plexus",
  refs: "Sui (one motif), the hero's tracked plexus",
  summary:
    "The hero's lines and dust reach down into the story: each object is a plain hairline drawing with nodes at just a few anchor points, long tracked lines run off from them fading with distance, and a few motes rise off it on fading threads. What's yours is the hero's green node in its ring of ticks.",
  motion:
    "As its station arrives, the long lines draw on from the anchors and fade out at their far ends, the motes lift off the object one by one on their threads, and the green node's ring of ticks opens last.",
  Art: PlexusArt,
};
