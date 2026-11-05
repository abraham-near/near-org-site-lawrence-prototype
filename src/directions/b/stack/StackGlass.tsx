import { buildStack, type Layer } from "@/components/home/stack/geometry";
import s from "./Stack.module.css";

// The Stack drawn as glass (direction B): the same geometry as the homepage (components/home/stack/geometry.ts: the
// Protocol pillar through the Intents, NEAR AI and near.com frames, painted back to front), in a new material. Each face
// is filled with a gradient that runs across the whole drawing (userSpaceOnUse), so one light falls over every piece of
// a layer, as over one slab of glass; every edge is a hairline that catches that light (lit tops, green-fringed sides).
// Under it, an isometric floor of hairlines with a dimension rule. Server-rendered, decorative (aria-hidden).
const G = buildStack(40);
const [minX, minY, W, H] = G.viewBox.split(" ").map(Number);
const C = Math.cos(Math.PI / 6);
const proj = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * 0.5 - z] as const;
const pt = (x: number, y: number, z: number) => proj(x, y, z).map((n) => n.toFixed(1)).join(",");

// The floor, just under the pillar's foot
const FZ = -652, R = 220, STEP = 40;
const floor: string[] = [];
for (let v = -R; v <= R; v += STEP) {
  floor.push(`M${pt(-R, v, FZ)}L${pt(R, v, FZ)}`);
  floor.push(`M${pt(v, -R, FZ)}L${pt(v, R, FZ)}`);
}
// A dimension rule along the floor's front-left edge, with ticks
const ticks: string[] = [];
for (let v = -R; v <= R; v += STEP / 2) {
  const a = proj(v, R + 18, FZ), b = proj(v, R + (v % STEP === 0 ? 30 : 24), FZ);
  ticks.push(`M${a[0].toFixed(1)},${a[1].toFixed(1)}L${b[0].toFixed(1)},${b[1].toFixed(1)}`);
}
const rule = `M${pt(-R, R + 18, FZ)}L${pt(R, R + 18, FZ)}`;
// The view box takes in the floor and its rule as well as the stack
const corners = [proj(-R, -R, FZ), proj(R, -R, FZ), proj(-R, R + 30, FZ), proj(R, R + 30, FZ)];
const x0 = Math.min(minX, ...corners.map((c) => c[0])) - 4, x1 = Math.max(minX + W, ...corners.map((c) => c[0])) + 4;
const y1 = Math.max(minY + H, ...corners.map((c) => c[1])) + 4;
const VB = `${x0.toFixed(1)} ${minY.toFixed(1)} ${(x1 - x0).toFixed(1)} ${(y1 - minY).toFixed(1)}`;

const LAYERS: Layer[] = ["protocol", "intents", "ai", "com"];
const KINDS = ["t", "l", "r"] as const;
// Gradient direction per face kind, across the drawing: tops lit from the upper left, sides fall into shade downwards
const DIR: Record<(typeof KINDS)[number], [number, number, number, number]> = {
  t: [minX, minY, minX + W, minY + H * 0.7],
  l: [minX, minY, minX + W * 0.4, minY + H],
  r: [minX + W, minY, minX + W * 0.6, minY + H],
};

export function StackGlass() {
  return (
    <svg className={s.iso} viewBox={VB} aria-hidden="true" focusable="false">
      <defs>
        {LAYERS.flatMap((l) => KINDS.map((k) => {
          const [x1, y1, x2, y2] = DIR[k];
          return (
            <linearGradient key={`${l}-${k}`} id={`bs-${l}-${k}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
              <stop offset="0" className={s[`${l}${k}0`]} />
              <stop offset="1" className={s[`${l}${k}1`]} />
            </linearGradient>
          );
        }))}
        {G.covers.map((c) => (
          <clipPath key={c.id} id={`b-${c.id}`}>{c.clip.map((p, i) => <polygon key={i} points={p} />)}</clipPath>
        ))}
      </defs>

      <g className={s.floor}>
        <path d={floor.join("")} />
        <path className={s.rule} d={rule + ticks.join("")} />
      </g>

      {G.layers.map((l) => (
        <g key={l.layer}>
          <g className={s.layer} data-layer={l.layer} data-li={l.index}>
            <g className={s.lift}>
              {l.pieces.map((p) => (
                <g key={p.key}>{p.faces.map((f) => <polygon key={f.kind} className={s[f.kind]} fill={`url(#bs-${l.layer}-${f.kind})`} points={f.points} />)}</g>
              ))}
            </g>
          </g>
          {G.covers.filter((c) => c.ring === l.index).map((c) => (
            <g key={c.id} className={s.layer} data-layer={c.layer} data-li={c.ring}>
              <g className={s.lift} clipPath={`url(#b-${c.id})`}>
                {c.faces.map((f) => <polygon key={f.kind} className={s[f.kind]} fill={`url(#bs-${c.layer}-${f.kind})`} points={f.points} />)}
              </g>
            </g>
          ))}
        </g>
      ))}
      <g className={s.layer} data-layer="protocol" data-li="0">
        <g className={s.lift}>
          <image href="/brand/icon.svg" width="1" height="1" transform={G.markTransform} preserveAspectRatio="xMidYMid meet" />
        </g>
      </g>
      <g className={s.thread}>
        <line x1={G.thread.x} y1={minY} x2={G.thread.x} y2={G.thread.y2} />
        <circle cx={G.thread.x} cy={G.thread.y2} r="4" />
      </g>
    </svg>
  );
}
