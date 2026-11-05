import type { ReactNode } from "react";
import s from "./lamella.module.css";

// Shared drawing parts for "Lamella" and "Lamella, front-on" (D54, D55): the fluted-glass line model, tick scales,
// crosses, labels and the three-layer frame (lines behind the render, the render, lines and labels in front).

export type P = [number, number];
export const r2 = (n: number) => Math.round(n * 100) / 100;

// Evenly spaced flute edges from x0 to x1
export const flutes = (x0: number, x1: number, n: number) => Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);

// The line through a and b as seen behind fluted glass whose flute edges are `edges` (K < 0 mirrors each flute's view)
export function refract(a: P, b: P, edges: number[], K = -1.7, gap = 0.45) {
  const m = (b[1] - a[1]) / (b[0] - a[0]);
  const y = (x: number) => a[1] + m * (x - a[0]);
  let d = "";
  for (let i = 0; i < edges.length - 1; i++) {
    const l = edges[i] + gap, r = edges[i + 1] - gap, c = (edges[i] + edges[i + 1]) / 2;
    d += `M${r2(l)} ${r2(y(c + K * (l - c)))}L${r2(r)} ${r2(y(c + K * (r - c)))}`;
  }
  return d;
}
// The same line, plain, between x0 and x1
export const seg = (a: P, b: P, x0: number, x1: number) => {
  const m = (b[1] - a[1]) / (b[0] - a[0]);
  return `M${r2(x0)} ${r2(a[1] + m * (x0 - a[0]))}L${r2(x1)} ${r2(a[1] + m * (x1 - a[0]))}`;
};
// A point on an ellipse (centre c, radii rx ry, rotated by rot degrees) at parameter t (radians)
export function onEllipse(c: P, rx: number, ry: number, rot: number, t: number): P {
  const p = (rot * Math.PI) / 180;
  return [c[0] + rx * Math.cos(t) * Math.cos(p) - ry * Math.sin(t) * Math.sin(p), c[1] + rx * Math.cos(t) * Math.sin(p) + ry * Math.sin(t) * Math.cos(p)];
}
// Half an ellipse: the front (toward the viewer, below its major axis) or the back
export function halfEllipse(c: P, rx: number, ry: number, rot: number, front: boolean) {
  const [a, b] = [onEllipse(c, rx, ry, rot, 0), onEllipse(c, rx, ry, rot, Math.PI)];
  return front ? `M${r2(a[0])} ${r2(a[1])}A${rx} ${ry} ${rot} 0 1 ${r2(b[0])} ${r2(b[1])}` : `M${r2(b[0])} ${r2(b[1])}A${rx} ${ry} ${rot} 0 1 ${r2(a[0])} ${r2(a[1])}`;
}
// Ticks along the segment a→b, every `step` units, `len` long, perpendicular (to the left of the direction of travel)
export function ticks(a: P, b: P, n: number, len: number, major = 0, majorLen = len * 1.8) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const x = a[0] + (dx * i) / n, y = a[1] + (dy * i) / n, l = major && i % major === 0 ? majorLen : len;
    d += `M${r2(x)} ${r2(y)}l${r2(nx * l)} ${r2(ny * l)}`;
  }
  return d;
}
// Registration cross with an open centre
export const Cross = ({ x, y, r = 4 }: { x: number; y: number; r?: number }) => (
  <path className={s.hair} d={`M${x - r} ${y}h${r - 1.2}M${x + 1.2} ${y}h${r - 1.2}M${x} ${y - r}v${r - 1.2}M${x} ${y + 1.2}v${r - 1.2}`} />
);
// The fact label: a green index square and the word, on a soft plate of the ground colour
export const Label = ({ x, y, text, w }: { x: number; y: number; text: string; w: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect className={s.plate} x="-4" y="-12.5" width={w + 20} height="18" rx="2" />
    <rect className={s.gFill} x="0" y="-6.5" width="5" height="5" />
    <text className={s.label} x="11" y="0">{text}</text>
  </g>
);
export const Micro = ({ x, y, children, anchor = "start" }: { x: number; y: number; children: ReactNode; anchor?: "start" | "middle" | "end" }) => (
  <text className={s.micro} x={x} y={y} textAnchor={anchor}>{children}</text>
);

// The three layers on the 420 × 315 box; `src` is the render under /lab/own-hybrid/
export function Frame({ src, under, over }: { src: string; under: ReactNode; over: ReactNode }) {
  return (
    <div className={s.art} aria-hidden="true">
      <svg viewBox="0 0 420 315" focusable="false">{under}</svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.render} src={`/lab/own-hybrid/${src}.webp`} alt="" draggable={false} />
      <svg viewBox="0 0 420 315" focusable="false">{over}</svg>
    </div>
  );
}
