import type React from "react";
import s from "./survey.module.css";

// A ticked scale (research/dir-a.md §4) as an SVG group: `count` minor ticks `gap` apart along x, a major tick every
// `major`, and numerals under the majors (data only, Mono). Ticks count up one after another when their watch area
// comes into view. `label(k)` gives the numeral for major tick k (index along the scale); null skips it.
export type RulerProps = {
  count: number; gap: number; major?: number; minor?: number; majorH?: number; x?: number; y?: number;
  label?: (k: number) => string | null; delay?: number; step?: number; up?: boolean; green?: number[];
};

export function RulerX({ count, gap, major = 10, minor = 5, majorH = 11, x = 0, y = 0, label, delay = 0, step = 14, up = false, green = [] }: RulerProps) {
  const dir = up ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y})`} style={{ "--d": `${delay}ms`, "--a-step": `${step}ms` } as React.CSSProperties}>
      <path className={`${s.hair} ${s.draw}`} d={`M0 0H${(count - 1) * gap}`} pathLength={1} style={{ "--a-dur": "1.1s" } as React.CSSProperties} />
      {Array.from({ length: count }, (_, k) => {
        const isMajor = k % major === 0, mid = !isMajor && minor && k % minor === 0;
        const h = isMajor ? majorH : mid ? majorH * 0.62 : majorH * 0.36;
        const g = green.includes(k);
        return (
          <line key={k} className={`${g ? s.green : s.hair} ${s.tick}`} x1={k * gap} x2={k * gap} y1={0} y2={dir * h}
            style={{ "--i": k, transformOrigin: up ? "50% 100%" : "50% 0%" } as React.CSSProperties} />
        );
      })}
      {label && Array.from({ length: count }, (_, k) => {
        if (k % major !== 0) return null;
        const t = label(k);
        return t === null ? null : (
          <text key={`t${k}`} className={`${s.svgNum} ${s.fade}`} x={k * gap} y={up ? -majorH - 6 : majorH + 15} textAnchor="middle" style={{ "--d": `${delay + k * step}ms` } as React.CSSProperties}>{t}</text>
        );
      })}
    </g>
  );
}
