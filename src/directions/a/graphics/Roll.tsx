import type React from "react";
import s from "./survey.module.css";

// Rolling numerals (research/dir-a.md §4): each digit is a column of 0–9 that rolls to its value, one after another,
// when its watch area comes into view. Screen readers get the value once; the columns are decorative.
export function Roll({ value, className = "", delay = 0 }: { value: string; className?: string; delay?: number }) {
  let n = 0;
  return (
    <span className={`${s.roll} ${className}`} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className={s.roll}>
        {[...value].map((ch, i) => {
          if (!/\d/.test(ch)) return <span key={i} className={s.rollCh}>{ch === " " ? " " : ch}</span>;
          const k = n++;
          return (
            <span key={i} className={s.rollCol}>
              <span className={s.rollSize}>{ch}</span>
              <span className={s.rollStrip} style={{ "--n": Number(ch), "--i": k } as React.CSSProperties}>
                {Array.from({ length: 10 }, (_, d) => <span key={d}>{d}</span>)}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
