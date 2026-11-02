import type React from "react";
import { ProofReveal } from "./ProofReveal";
import styles from "./Proof.module.css";

// Section 3 (spec/pages/home.md §3, D10): quiet credibility, not a headline. Five verified figures (PRODUCT.md §5)
// with dated, checkable captions (REF-PROOF-stripe) in a hairline strip (REF-PROOF-hyperliquid). No "live" dots yet:
// these are 31 Oct 2026 snapshots until live data is wired (TASKS).
// Sources, numbered for the per-figure marks (PRODUCT.md §5).
const SOURCES = ["Dune (@near)", "NEAR 1Click API", "NEAR protocol design and NearBlocks", "NEAR public benchmark", "NearBlocks"];

const FIGURES: { value: string; unit?: string; caption: string; fid: string; src: number }[] = [
  { value: "$36.8B+", caption: "settled through NEAR Intents, all time", fid: "F1", src: 1 },
  { value: "35+", unit: "chains", caption: "reachable from one account", fid: "F3", src: 2 },
  { value: "1.2", unit: "s", caption: "finality by protocol design, with ~600 ms blocks measured", fid: "F5, F6", src: 3 },
  { value: "1M+", unit: "TPS", caption: "in a public, reproducible benchmark (70 shards, Dec 2025)", fid: "F7", src: 4 },
  { value: "5+", unit: "years", caption: "on mainnet, since 2020", fid: "F8", src: 5 },
];

export function ProofStrip() {
  return (
    <section className={styles.proof} aria-labelledby="proof-title" data-proof>
      <div className={styles.inner}>
        <h2 id="proof-title" className="sr-only">NEAR in numbers</h2>
        <ul className={styles.figures}>
          {FIGURES.map((f, i) => (
            <li key={f.fid} className={styles.cell} style={{ "--i": i } as React.CSSProperties}>
              <p className={styles.value}>
                {f.value}
                {f.unit && <span className={styles.unit}>{f.unit}</span>}
              </p>
              {/* The last word and its source mark never part (no mark alone on a line) */}
              <p className={styles.caption}>
                {f.caption.slice(0, f.caption.lastIndexOf(" ") + 1)}
                <span className={styles.keep}>{f.caption.slice(f.caption.lastIndexOf(" ") + 1)}<sup className={styles.mark}><a href={`#proof-src-${f.src}`} aria-label={`Source ${f.src}`}>{f.src}</a></sup></span>
              </p>
            </li>
          ))}
        </ul>
        <div className={styles.note}>
          <p>As of 31 Oct 2026.</p>
          <ol className={styles.sources}>
            {SOURCES.map((s, i) => <li key={s} id={`proof-src-${i + 1}`}>{s}</li>)}
          </ol>
        </div>
      </div>
      <ProofReveal />
    </section>
  );
}
