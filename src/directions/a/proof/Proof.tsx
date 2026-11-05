import type React from "react";
import { Roll } from "../graphics/Roll";
import s from "../graphics/survey.module.css";
import p from "./Proof.module.css";

// Direction A, Proof (research/dir-a.md §5.4): the live page's five figures (PRODUCT.md §5; same values and captions
// as components/home/proof/ProofStrip.tsx) read as instruments. Each value rolls to place once, and under it a small
// scale that is true to the figure counts up: the volume on a 0–40 billion axis, 35 ticks for 35+ chains, a 0–2 s
// time scale with the ~600 ms block and the 1.2 s finality marked, 70 ticks for the benchmark's 70 shards, and the
// years on mainnet from 2020. Quiet: h3-scale figures, hairlines, no headline numbers.

const W = 240;
const tick = (k: number, x: number, h: number, extra = "", green = false) => (
  <line key={k} className={`${green ? s.green : s.hair} ${s.tick} ${extra}`} x1={x} x2={x} y1={20 - h} y2={20} style={{ "--i": k } as React.CSSProperties} />
);

function Count({ n, plus = false }: { n: number; plus?: boolean }) {
  const gap = (W - (plus ? 18 : 0)) / (n - 1);
  return (
    <svg className={p.scale} viewBox={`0 0 ${W} 24`} aria-hidden="true" focusable="false" style={{ "--a-step": `${Math.round(900 / n)}ms` } as React.CSSProperties}>
      <path className={`${s.faint}`} d={`M0 20.5H${W}`} />
      {Array.from({ length: n }, (_, k) => tick(k, k * gap, k % 5 === 0 ? 12 : 7))}
      {plus && <path className={`${s.hair} ${s.dash} ${s.fade}`} d={`M${W - 14} 14H${W}`} style={{ "--d": "1000ms" } as React.CSSProperties} />}
    </svg>
  );
}

function Volume() {
  // 0 to 40 (billions), a tick per billion, a long one per ten; the green run to 36.8
  const g = W / 40;
  return (
    <svg className={p.scale} viewBox={`0 0 ${W} 24`} aria-hidden="true" focusable="false" style={{ "--a-step": "12ms" } as React.CSSProperties}>
      {Array.from({ length: 41 }, (_, k) => tick(k, k * g, k % 10 === 0 ? 12 : 5))}
      <path className={`${s.green} ${s.draw}`} d={`M0 20H${36.8 * g}`} pathLength={1} style={{ "--d": "300ms", "--a-dur": "1.6s" } as React.CSSProperties} />
      <circle cx={36.8 * g} cy="20" r="2.75" className={`${s.greenFill} ${s.pop}`} style={{ "--d": "1700ms" } as React.CSSProperties} />
    </svg>
  );
}

function Finality() {
  // 0 to 2 s, a tick per 100 ms; the ~600 ms block and the 1.2 s finality in green
  const g = W / 20;
  return (
    <svg className={p.scale} viewBox={`0 0 ${W} 24`} aria-hidden="true" focusable="false" style={{ "--a-step": "30ms" } as React.CSSProperties}>
      <path className={s.faint} d={`M0 20.5H${W}`} />
      {Array.from({ length: 21 }, (_, k) => tick(k, k * g, k === 6 ? 9 : k === 12 ? 16 : k % 10 === 0 ? 12 : 5, "", k === 6 || k === 12))}
      <circle cx={12 * g} cy="3.5" r="2.75" className={`${s.greenFill} ${s.pop}`} style={{ "--d": "900ms" } as React.CSSProperties} />
    </svg>
  );
}

function Years() {
  // 2020 to now (Nov 2026), a tick per quarter, a long one per year; the green run from 2020 to now
  const q = W / 28;
  return (
    <svg className={p.scale} viewBox={`0 0 ${W} 24`} aria-hidden="true" focusable="false" style={{ "--a-step": "20ms" } as React.CSSProperties}>
      {Array.from({ length: 28 }, (_, k) => tick(k, k * q, k % 4 === 0 ? 12 : 5))}
      <path className={`${s.green} ${s.draw}`} d={`M0 20H${27 * q}`} pathLength={1} style={{ "--d": "300ms" } as React.CSSProperties} />
    </svg>
  );
}

const FIGURES: { value: string; unit?: string; caption: string; scale: React.ReactNode; axis?: [string, string] }[] = [
  { value: "$36.8B+", caption: "settled through NEAR Intents, all time", scale: <Volume />, axis: ["0", "40B"] }, // F1
  { value: "35+", unit: "chains", caption: "reachable from one account", scale: <Count n={35} plus /> }, // F3
  { value: "1.2", unit: "s", caption: "finality by protocol design, with ~600 ms blocks measured", scale: <Finality />, axis: ["0", "2 s"] }, // F5, F6
  { value: "1M+", unit: "TPS", caption: "in a public, reproducible benchmark (70 shards, Dec 2025)", scale: <Count n={70} /> }, // F7
  { value: "5+", unit: "years", caption: "on mainnet, since 2020", scale: <Years />, axis: ["2020", ""] }, // F8
];

export function Proof() {
  return (
    <section id="proof" className={`${p.proof} ${s.sheet}`} aria-labelledby="a-proof-title">
      <div className={p.inner}>
        <div className={p.head}>
          <h2 id="a-proof-title" className="t-label">NEAR in numbers</h2>
          <span className={p.headRule} aria-hidden="true" />
        </div>
        <ul className={p.figures}>
          {FIGURES.map((f, i) => (
            <li key={f.caption} className={p.cell} data-a-watch="0.5" style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
              <p className={p.value}>
                <Roll value={f.value} delay={i * 120} />
                {f.unit && <span className={p.unit}>{f.unit}</span>}
              </p>
              <div className={p.instrument}>
                {f.scale}
                {f.axis && <p className={p.axis} aria-hidden="true"><span className={s.num}>{f.axis[0]}</span><span className={s.num}>{f.axis[1]}</span></p>}
              </div>
              <p className={p.caption}>{f.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
