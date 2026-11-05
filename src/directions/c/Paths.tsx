import type { ReactNode } from "react";
import { Anchor, Ext, Guides, Hatch } from "./Shapes";
import { N_RUN } from "./construction";
import styles from "./Lower.module.css";

// Field, section 8: Get into NEAR, three ways in (copy board Step 18, unchanged), as three columns on the grid. Each
// column is one link, headed by a construction glyph from the shape system: Trade (two bands staggered on the
// diagonal: an exchange), Integrate (a plane slotted into a frame), Build (slabs stepping down the diagonal). None of
// them forms a letter or a UI icon. On hover (mouse) or focus the
// glyph's key plane fills NEAR green and a green rule draws across the column's top (D28's two speeds).
type Path = { name: string; line: ReactNode; action: string; href: string; glyph: ReactNode };
const nb = (s: string) => <span className={styles.nowrap}>{s}</span>;
const S = 240;
const par = (x: number, y: number, w: number, h: number) => `${x},${y} ${x + w},${y} ${x + w + h * N_RUN},${y + h} ${x + h * N_RUN},${y + h}`;

// Two bands on the diagonal, staggered and apart (one hatched, one the key plane), joined by a dashed exchange line
const A = { x: 12, y: 44, w: 40, h: 80 }, B = { x: 130, y: 104, w: 40, h: 80 };
const aRightAt = (y: number) => A.x + A.w + (y - A.y) * N_RUN;
const Trade = (
  <>
    <path className={styles.gDash} d="M8 204H232" />
    <polygon points={par(A.x, A.y, A.w, A.h)} fill="url(#c-path-h)" />
    <polygon points={par(A.x, A.y, A.w, A.h)} className={styles.gLine} />
    <polygon points={par(B.x, B.y, B.w, B.h)} className={styles.gKey} />
    <polygon points={par(B.x, B.y, B.w, B.h)} className={styles.gLine} />
    <path className={styles.gDash} d={`M${aRightAt(B.y).toFixed(1)} ${B.y}H${B.x}`} />
    <Anchor x={A.x} y={A.y} /><Anchor x={A.x + A.w + A.h * N_RUN} y={A.y + A.h} />
    <Anchor x={B.x} y={B.y} /><Anchor x={B.x + B.w + B.h * N_RUN} y={B.y + B.h} />
  </>
);
// A host frame with an opening on its left side; a plane cut on the diagonal slots into it
const Integrate = (
  <>
    <rect x="70" y="40" width="140" height="160" fill="url(#c-path-h)" opacity="0.6" />
    <path className={styles.gLine} d="M70 100V40H210V200H70V140" />
    <polygon points={par(22, 100, 70, 40)} className={styles.gKey} />
    <polygon points={par(22, 100, 70, 40)} className={styles.gLine} />
    <path className={styles.gDash} d="M0 120H22" />
    <Anchor x={70} y={100} /><Anchor x={70} y={140} /><Anchor x={210} y={40} /><Anchor x={210} y={200} />
  </>
);
// Slabs stepping down the diagonal inside an offset crop frame that the last one breaks out of
const STEP = 50, SX = (i: number) => 24 + i * STEP * N_RUN;
const Build = (
  <>
    <rect className={styles.gDash} x="10" y="40" width="186" height="168" />
    <path className={styles.gDash} d={`M${SX(0) - 30 * N_RUN} 30L${SX(2) + 40 * N_RUN} ${160 + 40}`} />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={SX(i)} y={60 + i * STEP} width="110" height="28" fill={i === 1 ? undefined : "url(#c-path-h)"} className={i === 1 ? styles.gKey : undefined} />
        <rect x={SX(i)} y={60 + i * STEP} width="110" height="28" className={styles.gLine} />
        <Anchor x={SX(i)} y={60 + i * STEP} />
      </g>
    ))}
  </>
);

const PATHS: Path[] = [
  { name: "Trade on NEAR", line: "Trade, earn yield and go confidential, all from one near.com account.", action: "Open near.com", href: "https://near.com", glyph: Trade },
  { name: "Integrate NEAR", line: <>Add {nb("NEAR Intents")} for confidential {nb("cross-chain")} execution, or {nb("NEAR AI")} for private inference you can verify.</>, action: "Integration docs", href: "https://docs.near.org/", glyph: Integrate },
  { name: "Build on NEAR", line: <>Build onchain apps and AI agents on battle-tested infrastructure with built-in confidentiality and {nb("cross-chain")} reach.</>, action: "Start building", href: "https://docs.near.org/", glyph: Build },
];

export function Paths() {
  return (
    <section id="paths" className={styles.paths} aria-labelledby="c-paths-title">
      <Guides />
      {/* The glyphs' shared hatch, defined once */}
      <svg className={styles.defs} aria-hidden="true" focusable="false"><defs><Hatch id="c-path-h" angle={-56} gap={4.5} width={0.7} color="var(--color-ink)" /></defs></svg>
      <div className={styles.wrap}>
        <h2 id="c-paths-title" className={`t-h1 ${styles.pHeading}`}>Get into <span className="accent">NEAR</span></h2>
        <ul className={styles.pList}>
          {PATHS.map((p) => (
            <li key={p.name}>
              <a className={styles.pCard} href={p.href}>
                <span className={styles.pRule} aria-hidden="true" />
                <svg className={styles.pGlyph} viewBox={`0 0 ${S} ${S}`} aria-hidden="true" focusable="false">
                  {p.glyph}
                </svg>
                <span className={`t-h3 ${styles.pName}`}>{p.name}</span>
                <span className={styles.pLine}>{p.line}</span>
                <span className={styles.pAction}>{p.action}<Ext /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
