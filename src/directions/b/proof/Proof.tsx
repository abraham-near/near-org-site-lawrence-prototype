import type React from "react";
import Image from "next/image";
import glass from "../glass.module.css";
import s from "./Proof.module.css";

// Direction B, Proof (spec/pages/home.md §3): quiet credibility. Five verified figures (PRODUCT.md §5; the same wording
// as the live strip) under one long bar of frosted glass, laid over a photograph of light refracted through fluted glass
// onto paper (Higgsfield, LOG.md: caustic). Around the bar the light is sharp; under it, softened: a lens over the
// numbers. Hairline dividers and a fine scale along the bar's foot. Static (no motion); sources and the 31 Oct 2026
// snapshot date stay in PRODUCT.md §5 (Lawrence, 2026-11-02).
const FIGURES: { value: string; unit?: string; caption: string; fid: string }[] = [
  { value: "$36.8B+", caption: "settled through NEAR Intents, all time", fid: "F1" },
  { value: "35+", unit: "chains", caption: "reachable from one account", fid: "F3" },
  { value: "1.2", unit: "s", caption: "finality by protocol design, with ~600 ms blocks measured", fid: "F5, F6" },
  { value: "1M+", unit: "TPS", caption: "in a public, reproducible benchmark (70 shards, Dec 2025)", fid: "F7" },
  { value: "5+", unit: "years", caption: "on mainnet, since 2020", fid: "F8" },
];

export function Proof() {
  return (
    <section id="proof" className={s.proof} aria-labelledby="b-proof-title">
      <div className={s.inner}>
        <h2 id="b-proof-title" className="sr-only">NEAR in numbers</h2>
        <div className={s.band}>
          <Image src="/directions/b/dir-b-caustic.webp" alt="" fill sizes="(min-width: 1440px) 1312px, 100vw" decoding="async" className={s.light} />
          <ul className={`${glass.glass} ${glass.edge} ${s.bar}`}>
            {FIGURES.map((f, i) => (
              <li key={f.fid} className={s.cell} style={{ "--i": i } as React.CSSProperties}>
                <p className={s.value}>
                  {f.value}
                  {f.unit && <span className={s.unit}>{f.unit}</span>}
                </p>
                <p className={s.caption}>{f.caption}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
