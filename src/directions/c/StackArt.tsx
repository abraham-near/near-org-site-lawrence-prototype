import { buildStack } from "@/components/home/stack/geometry";
import { Anchor } from "./Shapes";
import styles from "./Stack.module.css";

// The Stack in the Field style, on the shared geometry (components/home/stack/geometry.ts, unchanged): the Protocol
// pillar through the Intents, NEAR AI and near.com frames. Same shape, new skin:
//   - every face is a flat plane with an ink construction hairline;
//   - left faces are finely hatched (on the N's hook angle), right faces carry a duotone gradient band that runs
//     through the whole drawing's height (userSpaceOnUse), so the bands line up from layer to layer;
//   - the selected (or hovered) layer is drawn in the full green duotone; the others stay quiet, as a pale
//     construction drawing, so the layer being read is the only saturated thing in the section.
// Dashed construction lines (the pillar's axis, the outer frame's base) and anchor squares on the outer frame's
// corners sit over it. Decorative (aria-hidden): the list and detail carry the content.
const G = buildStack(40);

type Pt = [number, number];
const pts = (s: string): Pt[] => s.split(" ").map((p) => p.split(",").map(Number) as Pt);
function hull(list: Pt[]): Pt[] {
  const p = [...list].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const q of p) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length > 1 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
}
// The outer frame's silhouette (a hexagon in iso) and the pillar's, for the anchors and construction lines
const outer = hull(G.layers[3].pieces.flatMap((p) => p.faces.flatMap((f) => pts(f.points))));
const pillar = hull(G.layers[0].pieces.flatMap((p) => p.faces.flatMap((f) => pts(f.points))));
const [vx, vy, vw, vh] = G.viewBox.split(" ").map(Number);
const bottom = Math.max(...outer.map((q) => q[1]), ...pillar.map((q) => q[1]));
const pillarBottom = Math.max(...pillar.map((q) => q[1]));
const pillarTopY = Math.min(...pillar.map((q) => q[1]));
const left = outer.reduce((a, b) => (b[0] < a[0] ? b : a)), right = outer.reduce((a, b) => (b[0] > a[0] ? b : a));
// The outer frame's back corner projects onto the pillar's top (the N tile): no anchor there
const inside = ([x, y]: Pt, poly: Pt[]) => {
  const c = poly.map((a, i) => { const b = poly[(i + 1) % poly.length]; return (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]); });
  return c.every((v) => v >= -0.5) || c.every((v) => v <= 0.5);
};
const pillarMid = (pillarTopY + pillarBottom) / 2;
const corners = outer.filter((q) => !(q[1] < pillarMid && inside(q, pillar)));

export function StackArt() {
  return (
    <svg className={styles.iso} viewBox={G.viewBox} aria-hidden="true" focusable="false" data-iso>
      <defs>
        {/* Hatches: quiet (ink on surface) and full (forest on deep green) */}
        <pattern id="c-st-hq" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-56)">
          <rect width="4" height="4" fill="var(--st-quiet-l)" />
          <line x1="0" y1="2" x2="4" y2="2" stroke="var(--st-quiet-hatch)" strokeWidth="0.7" />
        </pattern>
        <pattern id="c-st-hf" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-56)">
          <rect width="4" height="4" fill="var(--st-full-l)" />
          <line x1="0" y1="2" x2="4" y2="2" stroke="var(--st-full-hatch)" strokeWidth="0.8" />
        </pattern>
        {/* Duotone bands, top of the drawing to its foot */}
        <linearGradient id="c-st-gq" gradientUnits="userSpaceOnUse" x1="0" y1={vy} x2="0" y2={vy + vh}>
          <stop offset="0" stopColor="var(--st-quiet-r1)" />
          <stop offset="1" stopColor="var(--st-quiet-r2)" />
        </linearGradient>
        <linearGradient id="c-st-gf" gradientUnits="userSpaceOnUse" x1="0" y1={vy} x2="0" y2={vy + vh}>
          <stop offset="0" stopColor="var(--st-full-r1)" />
          <stop offset="0.55" stopColor="var(--st-full-r2)" />
          <stop offset="1" stopColor="var(--st-full-r3)" />
        </linearGradient>
        {G.covers.map((c) => (
          <clipPath key={c.id} id={`c-${c.id}`}>{c.clip.map((p, i) => <polygon key={i} points={p} />)}</clipPath>
        ))}
      </defs>

      {/* Construction: the pillar's axis; the outer frame's base, carried out past both sides, arrives with that frame */}
      <g className={styles.construct}>
        <path d={`M0 ${vy + 4}V${pillarTopY - 6}`} />
        <path d={`M0 ${pillarBottom + 6}V${vy + vh - 4}`} />
      </g>
      <g className={`${styles.construct} ${styles.anchors}`}>
        <path d={`M${vx + 4} ${left[1]}H${left[0] - 10}`} />
        <path d={`M${right[0] + 10} ${right[1]}H${vx + vw - 4}`} />
      </g>

      {G.layers.map((l) => (
        <g key={l.layer}>
          <g className={styles.c} data-tone={l.layer} data-li={l.index}>
            <g className={styles.b}>
              {l.pieces.map((p) => (
                <g key={p.key}>{p.faces.map((f) => <polygon key={f.kind} className={styles[f.kind]} points={f.points} />)}</g>
              ))}
            </g>
          </g>
          {G.covers.filter((c) => c.ring === l.index).map((c) => (
            <g key={c.id} className={styles.c} data-tone={c.layer} data-li={c.ring}>
              <g className={styles.cover} clipPath={`url(#c-${c.id})`}>
                {c.faces.map((f) => <polygon key={f.kind} className={styles[f.kind]} points={f.points} />)}
              </g>
            </g>
          ))}
        </g>
      ))}
      <g className={styles.c} data-tone="protocol" data-li="0">
        <g className={styles.b}>
          <image href="/brand/icon.svg" width="1" height="1" transform={G.markTransform} preserveAspectRatio="xMidYMid meet" />
        </g>
      </g>

      <g className={styles.anchors}>
        {corners.map(([x, y], i) => <Anchor key={i} x={x} y={y} s={7} />)}
        <Anchor x={0} y={bottom + 18} s={7} />
      </g>
    </svg>
  );
}
