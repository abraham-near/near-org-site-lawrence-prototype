import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import { Anchor, Hatch } from "./Shapes";
import { N_RUN, seeded } from "./construction";
import styles from "./Story.module.css";

// The four "Own your" plates on the rail: precise line drawings in the Field shape system (hairlines, hatched planes,
// anchor squares, one flat NEAR-green plane each). Decorative: each panel's heading and line carry the meaning.
// Strokes marked data-rail-draw draw on as the panel slides in (StoryMotion); the static page shows them drawn.
const W = 480, H = 300;
const d = (s: string) => ({ d: s, pathLength: 1, className: styles.drawLine, "data-rail-draw": "" });

function Data() {
  // Records run across; a sealed plane (cut on the N's diagonal) covers them in the middle: confidential in transit
  const rows = Array.from({ length: 9 }, (_, i) => 54 + i * 24);
  const x0 = 170, w = 120, top = 40, bot = 262, run = (bot - top) * N_RUN * 0.42;
  return (
    <>
      <defs><Hatch id="c-own-data" angle={-56} gap={4} width={0.6} color="var(--color-ink)" /></defs>
      {rows.map((y, i) => (
        <g key={y}>
          <path {...d(`M24 ${y}H${x0 + (y - top) * (run / (bot - top)) - 6}`)} />
          <path {...d(`M${x0 + w + (y - top) * (run / (bot - top)) + 6} ${y}H456`)} />
          <rect className={styles.tick} x={i % 3 === 0 ? 60 : i % 3 === 1 ? 96 : 78} y={y - 3} width="6" height="6" />
          <rect className={styles.tick} x={i % 2 ? 392 : 410} y={y - 3} width="6" height="6" />
        </g>
      ))}
      <polygon className={styles.green} points={`${x0},${top} ${x0 + w},${top} ${x0 + w + run},${bot} ${x0 + run},${bot}`} />
      <polygon fill="url(#c-own-data)" opacity="0.28" points={`${x0},${top} ${x0 + w},${top} ${x0 + w + run},${bot} ${x0 + run},${bot}`} />
      <polygon className={styles.outline} points={`${x0},${top} ${x0 + w},${top} ${x0 + w + run},${bot} ${x0 + run},${bot}`} />
      <Anchor x={x0} y={top} /><Anchor x={x0 + w} y={top} /><Anchor x={x0 + run} y={bot} /><Anchor x={x0 + w + run} y={bot} />
    </>
  );
}

function Assets() {
  // Holdings as hatched stems on one baseline; every one routes to a single account point (green)
  const stems = [[40, 150], [100, 96], [160, 190], [220, 128], [280, 70]];
  const base = 268, acc = { x: 420, y: 70 };
  return (
    <>
      <defs><Hatch id="c-own-assets" angle={-56} gap={4} width={0.6} color="var(--color-ink)" /></defs>
      <path className={styles.base} d={`M24 ${base}H456`} />
      {stems.map(([x, h]) => (
        <g key={x}>
          <rect x={x} y={base - h} width="28" height={h} fill="url(#c-own-assets)" opacity="0.45" />
          <rect className={styles.outline} x={x} y={base - h} width="28" height={h} />
          <path {...d(`M${x + 28} ${base - h}L${acc.x} ${acc.y}`)} />
          <Anchor x={x + 28} y={base - h} s={6} />
        </g>
      ))}
      <rect className={styles.green} x={acc.x - 14} y={acc.y - 14} width="28" height="28" />
      <rect className={styles.outline} x={acc.x - 14} y={acc.y - 14} width="28" height="28" />
      <path className={styles.dash} d={`M${acc.x} ${acc.y + 14}V${base}`} />
      <Anchor x={acc.x} y={base} />
    </>
  );
}

function Intelligence() {
  // An enclave: a frame of stem-thick walls, hatched solid so nothing inside shows; the request goes in on the left and
  // a signed proof (the green square) comes out on the right
  const x = 150, y = 50, s = 200, t = 30;
  return (
    <>
      <defs><Hatch id="c-own-ai" angle={-56} gap={3.5} width={0.6} color="var(--color-ink)" /></defs>
      <rect x={x} y={y} width={s} height={s} fill="url(#c-own-ai)" opacity="0.55" />
      <rect className={styles.paper} x={x + t} y={y + t} width={s - 2 * t} height={s - 2 * t} />
      <rect x={x + t} y={y + t} width={s - 2 * t} height={s - 2 * t} fill="url(#c-own-ai)" opacity="0.18" />
      <rect className={styles.outline} x={x} y={y} width={s} height={s} />
      <rect className={styles.outline} x={x + t} y={y + t} width={s - 2 * t} height={s - 2 * t} />
      <path {...d(`M24 ${y + s / 2}H${x}`)} />
      <path {...d(`M${x + s} ${y + s / 2}H404`)} />
      <rect className={styles.green} x="404" y={y + s / 2 - 16} width="32" height="32" />
      <rect className={styles.outline} x="404" y={y + s / 2 - 16} width="32" height="32" />
      <Anchor x={x} y={y} /><Anchor x={x + s} y={y} /><Anchor x={x} y={y + s} /><Anchor x={x + s} y={y + s} />
      <Anchor x={24} y={y + s / 2} s={6} />
    </>
  );
}

function Identity() {
  // One account (a hatched stem) reaching every chain: 35 fine lines to 35 ticks (F3: 35+ chains), with the key on the
  // stem turned a quarter, as one rotation upgrades it to post-quantum keys
  const sx = 70, top = 40, bot = 260, ox = 98, tx = 440;
  const rnd = seeded(7);
  const ticks = Array.from({ length: 35 }, (_, i) => top + 4 + (i * (bot - top - 8)) / 34);
  return (
    <>
      <defs><Hatch id="c-own-id" angle={-56} gap={4} width={0.6} color="var(--color-ink)" /></defs>
      <rect x={sx} y={top} width="28" height={bot - top} fill="url(#c-own-id)" opacity="0.45" />
      <rect className={styles.outline} x={sx} y={top} width="28" height={bot - top} />
      {ticks.map((ty, i) => (
        <g key={i}>
          <path {...d(`M${ox} ${150 + (rnd() - 0.5) * 30}L${tx} ${ty.toFixed(1)}`)} className={`${styles.drawLine} ${styles.fine}`} />
          <path className={styles.base} d={`M${tx} ${ty.toFixed(1)}h12`} />
        </g>
      ))}
      <path className={styles.base} d={`M${tx} ${top}V${bot}`} />
      <rect className={styles.green} x={sx - 6} y={136} width="40" height="28" />
      <rect className={styles.outline} x={sx - 6} y={136} width="40" height="28" />
      <rect className={styles.outline} x={sx - 6} y={136} width="40" height="28" transform={`rotate(56 ${sx + 14} 150)`} />
      <Anchor x={sx} y={top} /><Anchor x={sx + 28} y={top} /><Anchor x={sx} y={bot} /><Anchor x={sx + 28} y={bot} />
    </>
  );
}

const PLATES: Record<OwnKey, () => React.JSX.Element> = { data: Data, assets: Assets, intelligence: Intelligence, identity: Identity };

export function OwnPlate({ which }: { which: OwnKey }) {
  const Plate = PLATES[which];
  return (
    <svg className={styles.plate} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false" data-rail-plate>
      <Plate />
    </svg>
  );
}
