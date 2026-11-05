import type React from "react";
import { buildStack, type Layer } from "@/components/home/stack/geometry";
import { LAYERS } from "@/components/home/stack/layers";
import { RAMPS, SEAM } from "./palette";
import st from "./Stack.module.css";

// Direction A, the Stack drawn as an engineering plate (research/dir-a.md §5.3). The geometry is the live page's
// (stack/geometry.ts, unchanged): the Protocol pillar through the Intents, NEAR AI and near.com frames, painted back
// to front, with the pillar redrawn over each ring's back edges (covers). Restyled: each layer is drawn twice, in the
// sage ramp (at rest) and the green ramp (selected or hovered), as vertical gradients; the green copy fades in, so
// only one object on the plate is saturated. Around it: a z-scale on the left with the selected layer's extent in
// green, leader lines from each layer to its name and figure on the right (HTML, so the type stays at its true size),
// and registration marks at the plate's corners. Decorative (aria-hidden): the list and detail carry the content.
const G = buildStack(16);
const [vx, vy, vw, vh] = G.viewBox.split(" ").map(Number);
const SCALE_X = vx - 54, LABEL_GAP = 64; // the z-scale left of the drawing; room on the right for the leaders' elbows
const VX = SCALE_X - 24, VW = vw + (vx - VX) + LABEL_GAP, VY = vy, VH = vh;

const pts = (f: string) => f.split(" ").map((p) => p.split(",").map(Number) as [number, number]);
const layerPts = (layer: Layer) => G.layers.find((l) => l.layer === layer)!.pieces.flatMap((p) => p.faces.flatMap((f) => pts(f.points)));
const ORDER: Layer[] = ["protocol", "intents", "ai", "com"];
const right = vx + vw;
// Label slots, top to bottom in the order the anchors sit (pillar top, then the rings' right corners)
const SLOT: Record<Layer, number> = { protocol: 0.1, com: 0.32, ai: 0.49, intents: 0.66 };
const anchors = ORDER.map((layer) => {
  const p = layerPts(layer);
  const maxX = Math.max(...p.map((q) => q[0]));
  const ay = Math.min(...p.filter((q) => q[0] > maxX - 0.5).map((q) => q[1]));
  const ys = p.map((q) => q[1]);
  const sy = VY + VH * SLOT[layer];
  const lx = VX + VW; // the leaders end at the plate's right edge, where the label column starts
  return { layer, ax: maxX, ay, sy, lx, top: Math.min(...ys), foot: Math.max(...ys), leader: `M${maxX.toFixed(1)} ${ay.toFixed(1)}H${(right + 8).toFixed(1)}L${(lx - 18).toFixed(1)} ${sy.toFixed(1)}H${lx.toFixed(1)}` };
});
// The drawing's width over its height, so the page can size it to the screen's height
export const PLATE_ASPECT = VW / VH;
const top = (y: number) => ({ top: `${((y - VY) / VH) * 100}%` });

function Faces({ pieces, ramp }: { pieces: { key: string; faces: { kind: "t" | "l" | "r"; points: string }[] }[]; ramp: "sage" | "green" }) {
  return (
    <>
      {pieces.map((p) => (
        <g key={p.key}>{p.faces.map((f) => <polygon key={f.kind} points={f.points} fill={`url(#a-${ramp}-${f.kind})`} stroke={SEAM} />)}</g>
      ))}
    </>
  );
}

export function StackPlate() {
  return (
    <div className={st.plate} aria-hidden="true" data-plate>
      <svg className={st.iso} viewBox={`${VX} ${VY} ${VW} ${VH}`} focusable="false" data-iso>
        <defs>
          {(["sage", "green"] as const).flatMap((r) => (["t", "l", "r"] as const).map((k) => (
            <linearGradient key={`${r}${k}`} id={`a-${r}-${k}`} gradientUnits="userSpaceOnUse" x1="0" y1={VY} x2="0" y2={VY + VH}>
              <stop offset="0" stopColor={RAMPS[r][k][0]} />
              <stop offset="1" stopColor={RAMPS[r][k][1]} />
            </linearGradient>
          )))}
          {G.covers.map((c) => <clipPath key={c.id} id={`a-${c.id}`}>{c.clip.map((p, i) => <polygon key={i} points={p} />)}</clipPath>)}
        </defs>

        {/* The z-scale: a tick every 20 units, a longer one every 100; the selected layer's extent in green */}
        <g className={st.scale}>
          <line x1={SCALE_X} x2={SCALE_X} y1={VY + 12} y2={VY + VH - 12} />
          {Array.from({ length: Math.floor((VH - 24) / 20) + 1 }, (_, k) => (
            <line key={k} x1={SCALE_X} x2={SCALE_X + (k % 5 === 0 ? 14 : 6)} y1={VY + 12 + k * 20} y2={VY + 12 + k * 20} />
          ))}
        </g>
        {anchors.map((a) => (
          <rect key={a.layer} className={st.extent} data-tone={a.layer} x={SCALE_X - 2} y={a.top} width="3" height={a.foot - a.top} />
        ))}

        {G.layers.map((l) => (
          <g key={l.layer}>
            <g className={st.c} data-tone={l.layer} data-li={l.index}>
              <g className={st.b}>
                <g className={st.sage}><Faces pieces={l.pieces} ramp="sage" /></g>
                <g className={st.lit}><Faces pieces={l.pieces} ramp="green" /></g>
              </g>
            </g>
            {G.covers.filter((c) => c.ring === l.index).map((c) => (
              <g key={c.id} className={st.c} data-tone={c.layer} data-li={c.ring}>
                <g className={st.cover} clipPath={`url(#a-${c.id})`}>
                  <g className={st.sage}>{c.faces.map((f) => <polygon key={f.kind} points={f.points} fill={`url(#a-sage-${f.kind})`} stroke={SEAM} />)}</g>
                  <g className={st.lit}>{c.faces.map((f) => <polygon key={f.kind} points={f.points} fill={`url(#a-green-${f.kind})`} stroke={SEAM} />)}</g>
                </g>
              </g>
            ))}
          </g>
        ))}
        <g className={st.c} data-tone="protocol" data-li="0">
          <g className={st.b}><image href="/brand/icon.svg" width="1" height="1" transform={G.markTransform} preserveAspectRatio="xMidYMid meet" /></g>
        </g>

        {/* Leaders: a quiet one for every layer, and the selected one drawn on in green over it */}
        {anchors.map((a) => (
          <g key={a.layer} className={st.leader} data-tone={a.layer}>
            <path className={st.leadRest} d={a.leader} />
            <path className={st.leadOn} d={a.leader} pathLength={1} />
            <circle className={st.anchor} cx={a.ax} cy={a.ay} r="3.2" />
          </g>
        ))}

        {/* Registration marks at the plate's corners (left only: the label column runs down the right) */}
        {[[VX + 10, VY + 10], [VX + 10, VY + VH - 10]].map(([x, y], i) => (
          <g key={i} className={st.reg} transform={`translate(${x} ${y})`}><circle r="6" /><path d="M-11 0H11M0-11V11" /></g>
        ))}
      </svg>

      <div className={st.labels}>
      {anchors.map((a) => {
        const L = LAYERS.find((x) => x.key === a.layer)!;
        return (
          <span key={a.layer} className={st.label} data-tone={a.layer} style={top(a.sy) as React.CSSProperties}>
            <span className={st.labelName}>{L.name}</span>
            <span className={st.labelStat}>{L.stats[0].value} <span className={st.labelUnit}>{L.stats[0].label}</span></span>
          </span>
        );
      })}
      </div>
    </div>
  );
}
