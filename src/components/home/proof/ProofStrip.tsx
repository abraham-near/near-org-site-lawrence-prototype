import type React from "react";
import { ProofReveal } from "./ProofReveal";
import styles from "./Proof.module.css";

// Section 3 (spec/pages/home.md §3, D10): quiet credibility, not a headline. Five verified figures (PRODUCT.md §5)
// with short captions in a hairline strip (REF-PROOF-hyperliquid). Lawrence removed the footnote marks and the
// sources line (2026-11-02); sources and the 31 Oct 2026 snapshot date stay recorded in PRODUCT.md §5.

const FIGURES: { value: string; unit?: string; caption: string; fid: string }[] = [
  { value: "$36.8B+", caption: "settled through NEAR Intents, all time", fid: "F1" },
  { value: "35+", unit: "chains", caption: "reachable from one account", fid: "F3" },
  { value: "1.2", unit: "s", caption: "finality by protocol design, with ~600 ms blocks measured", fid: "F5, F6" },
  { value: "1M+", unit: "TPS", caption: "in a public, reproducible benchmark (70 shards, Dec 2025)", fid: "F7" },
  { value: "5+", unit: "years", caption: "on mainnet, since 2020", fid: "F8" },
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
              <p className={styles.caption}>{f.caption}</p>
            </li>
          ))}
        </ul>
      </div>
      <ProofReveal />
    </section>
  );
}
