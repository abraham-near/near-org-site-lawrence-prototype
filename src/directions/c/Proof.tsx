import { Guides, Hatch } from "./Shapes";
import { N_RUN } from "./construction";
import styles from "./Lower.module.css";

// Field, section 4: Proof, the page's first full-bleed NEAR-green field (ink type, 8.4:1). A frieze of diagonal
// bands at the N's angle runs across the top, cropped by the field's edge, and travels up the diagonal as the reader
// scrolls (FieldMotion). Then the five verified figures (PRODUCT.md §5, F1 F3 F5/F6 F7 F8, as on the current strip) as
// a Swiss table: the Intents figure leads at display size, the other four on hairlines beside it.
const FIGURES: { value: string; unit?: string; caption: string }[] = [
  { value: "$36.8B+", caption: "settled through NEAR Intents, all time, as of 31 Oct 2026" }, // F1 (its date is mandatory)
  { value: "35+", unit: "chains", caption: "reachable from one account" }, // F3
  { value: "1.2", unit: "s", caption: "finality by protocol design, with ~600 ms blocks measured" }, // F5, F6
  { value: "1M+", unit: "TPS", caption: "in a public, reproducible benchmark (70 shards, Dec 2025)" }, // F7
  { value: "5+", unit: "years", caption: "on mainnet, since 2020" }, // F8
];

// The frieze: bands 64 wide every 150, cut on the diagonal, taller than their window (which shows the middle 200)
// so they can travel up the diagonal without leaving a gap. All are hairlines; one is hatched.
const FH = 420, BW = 64, STEP = 150, N = 18, HATCHED = 9;
const band = (x: number) => `${x},0 ${x + BW},0 ${x + BW + FH * N_RUN},${FH} ${x + FH * N_RUN},${FH}`;

export function Proof() {
  const [lead, ...rest] = FIGURES;
  return (
    <section id="proof" className={styles.proof} data-tone="green" aria-labelledby="proof-title">
      <Guides />
      <div className={styles.frieze} aria-hidden="true">
        <svg viewBox={`0 0 ${STEP * N} ${FH}`} preserveAspectRatio="xMidYMin slice" className={styles.friezeSvg} data-drift="260">
          <defs><Hatch id="c-proof-h" angle={-56} gap={5} width={0.8} color="var(--color-ink)" /></defs>
          {Array.from({ length: N }, (_, i) => {
            const x = i * STEP - 360;
            return (
              <g key={i}>
                {i === HATCHED && <polygon points={band(x)} fill="url(#c-proof-h)" />}
                <polygon points={band(x)} className={styles.inkLine} />
              </g>
            );
          })}
        </svg>
      </div>
      <div className={styles.wrap}>
        <h2 id="proof-title" className={`t-label ${styles.proofLabel}`}>NEAR in numbers</h2>
        <div className={styles.figs}>
          <div className={styles.lead}>
            <p className={styles.leadValue}>{lead.value}</p>
            <p className={styles.caption}>{lead.caption}</p>
          </div>
          <ul className={styles.cells}>
            {rest.map((f) => (
              <li key={f.caption} className={styles.cell}>
                <p className={styles.value}>{f.value}{f.unit && <span className={styles.unit}>{f.unit}</span>}</p>
                <p className={styles.caption}>{f.caption}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
