import type React from "react";
import s from "./survey.module.css";

// The survey's small marks (research/dir-a.md §4), as SVG fragments to place inside a drawing.

// A registration mark: a circle with a crosshair through it
export function RegMark({ x, y, r = 7, delay = 0 }: { x: number; y: number; r?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <circle className={`${s.hair} ${s.draw}`} r={r} pathLength={1} />
      <path className={`${s.hair} ${s.draw}`} d={`M${-r * 1.8} 0H${r * 1.8}M0 ${-r * 1.8}V${r * 1.8}`} pathLength={1} />
    </g>
  );
}

// A crosshair node: a + with a gap, a dot, and (optionally) one ring that pulses once on arrival
export function Node({ x, y, green = false, pulse = false, delay = 0, size = 7 }: { x: number; y: number; green?: boolean; pulse?: boolean; delay?: number; size?: number }) {
  const g = size, gap = 2.5;
  return (
    <g transform={`translate(${x} ${y})`} style={{ "--d": `${delay}ms` } as React.CSSProperties}>
      <g className={s.pop}>
        <path className={green ? s.green : s.ink} d={`M${-g} 0H${-gap}M${gap} 0H${g}M0 ${-g}V${-gap}M0 ${gap}V${g}`} />
        <circle r={green ? 2.25 : 1.75} className={green ? s.greenFill : s.inkFill} />
      </g>
      {pulse && <circle className={`${green ? s.green : s.hair} ${s.pulse}`} r={g} />}
    </g>
  );
}

// Plate corners: four small L marks just outside a figure (position: relative parent)
export function Corners() {
  const L = <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path className={s.ink} d="M0 14V0H14" /></svg>;
  return <span className={s.corners} aria-hidden="true">{L}{L}{L}{L}</span>;
}
