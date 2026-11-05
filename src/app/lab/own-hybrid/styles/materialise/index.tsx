import { useId } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../../../own-styles/styles/types";
import { ASSETS, COINS, CORE, DATA, IDENT, INTEL, RING, type Drawing } from "./geom";
import s from "./materialise.module.css";

// "Materialise" (D54, after engineering and patent drawings, and FutureDeluxe / ManvsMachine renders). Each object is
// half technical drawing, half real: on the left a hairline drawing (visible edges, hidden edges dashed, centre lines,
// shading and hatching, dimension lines), and across the middle it becomes the photoreal render (a Higgsfield still,
// transparent). The drawing is measured off the render in the render's own pixels (geom.ts) and placed with the same
// transform, so the drawn edges carry straight on into the real ones; the render fades in on a soft mask exactly there.

const W = 420;
const H = 315;
const n = (v: number) => Math.round(v * 100) / 100;

// Where each render sits in the 420 × 315 box: its top-left and scale (box units per render pixel), and the reveal: the
// x span over which the drawing gives way to the render, and its tilt (the seam leans one way or the other)
type Station = { d: Drawing; x: number; y: number; k: number; reveal: [number, number]; tilt: number };
const ST: Record<OwnKey, Station> = {
  data: { d: DATA, x: 130, y: 44, k: 0.165, reveal: [176, 222], tilt: 0.03 },
  assets: { d: ASSETS, x: 50, y: 84, k: 0.172, reveal: [190, 230], tilt: -0.1 },
  intelligence: { d: INTEL, x: 124, y: 42, k: 0.165, reveal: [180, 226], tilt: -0.1 },
  identity: { d: IDENT, x: 73, y: 48, k: 0.17, reveal: [186, 236], tilt: -0.1 },
};
// A render pixel in box units
const at = (which: OwnKey, px: number, py: number): [number, number] => {
  const { x, y, k } = ST[which];
  return [n(x + px * k), n(y + py * k)];
};

// Open arrowhead at (x, y) pointing along (dx, dy)
const head = (x: number, y: number, dx: number, dy: number, l = 4.2, w = 1.8) => {
  const m = Math.hypot(dx, dy), ux = dx / m, uy = dy / m;
  const bx = x - ux * l, by = y - uy * l;
  return `M${n(bx - uy * w)} ${n(by + ux * w)}L${n(x)} ${n(y)}L${n(bx + uy * w)} ${n(by - ux * w)}`;
};
// A dimension line between two points with arrowheads at both ends (no figures: the drawing is about form)
const dim = (x1: number, y1: number, x2: number, y2: number) =>
  `M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}${head(x2, y2, x2 - x1, y2 - y1)}${head(x1, y1, x1 - x2, y1 - y2)}`;
// Registration cross with a gap at its centre
const cross = (x: number, y: number, r = 4) => `M${x - r} ${y}h${r - 1.2}M${x + 1.2} ${y}h${r - 1.2}M${x} ${y - r}v${r - 1.2}M${x} ${y + 1.2}v${r - 1.2}`;

// ── Data: the rows of a record run in from the left, pass behind the reeded pane (dashed, hidden), and leave on the far
// side as a thinning dot matrix ──
const ROWS = [86, 98, 110, 122, 134, 146, 158];
const PANE_L = at("data", 15, 0)[0];
// (each row becomes three rows of dots, thinning out to the right; a fixed hash keeps it the same every render)
const DATA_DOTS = (() => {
  let d = "";
  ROWS.forEach((y, j) => {
    for (let r = -1; r <= 1; r++) {
      for (let i = 0; i < 34; i++) {
        const x = 294 + i * 3.2;
        const h = Math.abs(Math.sin((i + 1) * 12.9898 + (j * 3 + r) * 78.233) * 43758.5453) % 1;
        if (h < 0.92 * (1 - i / 34) ** 1.3 - (r ? 0.18 : 0)) d += `M${n(x)} ${y + r * 3.2}h0.01`;
      }
    }
  });
  return d;
})();
function DataFront() {
  const [tlx, tly] = at("data", 15, 16), [trx, try_] = at("data", 933, 251.6), [, bly] = at("data", 15, 876);
  const ox = -0.264, oy = -0.964; // outward normal of the top edge
  return (
    <>
      <path className={s.hair} d={ROWS.map((y) => `M20 ${y}H${n(PANE_L)}`).join("")} />
      <path className={s.dots} d={DATA_DOTS} />
      <path className={s.thin} d={`M${tlx + ox * 4} ${tly + oy * 4}l${n(ox * 12)} ${n(oy * 12)}M${trx + ox * 4} ${try_ + oy * 4}l${n(ox * 12)} ${n(oy * 12)}`} />
      <path className={s.hair} d={dim(tlx + ox * 12, tly + oy * 12, trx + ox * 12, try_ + oy * 12)} />
      <path className={s.thin} d={`M${tlx - 4} ${tly}H${tlx - 22}M${tlx - 4} ${bly}H${tlx - 22}`} />
      <path className={s.hair} d={dim(tlx - 17, tly, tlx - 17, bly)} />
      <rect className={s.ink} x="20" y="54" width="4" height="4" />
      <text className={s.micro} x="30" y="60">Transactions</text>
      <text className={s.micro} x="30" y="75">and prompts</text>
      <path className={s.thin} d="M330 168V182H400" />
      <text className={s.label} x="400" y="198" textAnchor="end">Private</text>
      <path className={s.thin} d={`${cross(20, 28)}${cross(400, 286)}`} />
    </>
  );
}
function DataBehind() {
  // the rows carry on behind the glass as hidden lines, as far as the drawing reaches
  return <path className={s.dash} d={ROWS.map((y) => `M${n(PANE_L)} ${y}H${ST.data.reveal[1]}`).join("")} />;
}

// ── Assets: two coins held in one clear tray; the swap arcs from the drawn coin to the real green one ──
function AssetsFront() {
  const [sx, sy] = at("assets", COINS.s.cx, COINS.s.cy), [gx, gy] = at("assets", COINS.g.cx, COINS.g.cy);
  const cx = (sx + gx) / 2, cy = 36;
  const [ax, ay] = at("assets", 25, 512), [bx, by] = at("assets", 1450, 937);
  const nx = -0.287, ny = 0.958; // outward (down) normal of the tray's front bottom edge
  const [hx, hy] = at("assets", COINS.s.cx - COINS.s.rx, COINS.s.cy);
  const [ex, ey] = at("assets", 200, 418);
  return (
    <>
      <path className={s.hair} d={`M${sx} ${sy}Q${n(cx)} ${cy} ${gx} ${gy}${head(gx, gy, gx - cx, gy - cy)}`} />
      <circle className={s.ink} cx={sx} cy={sy} r="1.5" />
      <text className={s.label} x={n(0.25 * sx + 0.5 * cx + 0.25 * gx)} y="76" textAnchor="middle">Swap</text>
      <path className={s.thin} d={`M${hx - 3} ${hy}H40`} />
      <text className={s.micro} x="20" y={hy - 4}>Hold</text>
      <path className={s.thin} d={`M${ax + nx * 3} ${ay + ny * 3}l${n(nx * 14)} ${n(ny * 14)}M${bx + nx * 3} ${by + ny * 3}l${n(nx * 14)} ${n(ny * 14)}`} />
      <path className={s.hair} d={dim(ax + nx * 13, ay + ny * 13, bx + nx * 13, by + ny * 13)} />
      <path className={s.thin} d={`M${ex} ${ey}L44 264H20`} />
      <text className={s.micro} x="20" y="280">one account</text>
      <path className={s.thin} d={`${cross(20, 28)}${cross(400, 286)}`} />
    </>
  );
}

// ── Intelligence: a request enters the crystal (drawn, then hidden inside it) and reaches the sealed core; a signed
// proof leaves on the real side, in green (the render's cap is neutralised to steel so the proof is the one green) ──
const RAY = 152;
function IntelFront() {
  const [lx] = at("intelligence", 32, 0), [rx] = at("intelligence", 1048, 0);
  const [, ty] = at("intelligence", 0, 260), [, by] = at("intelligence", 0, 960);
  const [ex, ey] = at("intelligence", 180, 342);
  return (
    <>
      <path className={s.hair} d={`M20 ${RAY}H${lx}${head(lx, RAY, 1, 0)}`} />
      <text className={s.micro} x="20" y={RAY - 6}>request</text>
      <path className={s.green} d={`M${rx} ${RAY}H372`} />
      <circle className={s.green} cx="380" cy={RAY} r="7" />
      <circle className={s.greenFill} cx="380" cy={RAY} r="3" />
      <path className={s.hair} d={`M380 ${RAY - 12}v4M380 ${RAY + 8}v4M368 ${RAY}h-4M392 ${RAY}h4`} />
      <text className={s.label} x="400" y={RAY + 26} textAnchor="end">Signed proof</text>
      <path className={s.thin} d={`M${lx - 4} ${ty}H${lx - 20}M${lx - 4} ${by}H${lx - 20}`} />
      <path className={s.hair} d={dim(lx - 15, ty, lx - 15, by)} />
      <path className={s.thin} d={`M${ex} ${ey}L150 58H20`} />
      <text className={s.micro} x="20" y="52">hardware enclaves</text>
      <path className={s.thin} d={`${cross(400, 28)}${cross(20, 286)}`} />
    </>
  );
}
function IntelBehind() {
  const [lx] = at("intelligence", 32, 0), [cx] = at("intelligence", CORE.cx - CORE.body, 0);
  return <path className={s.dash} d={`M${lx} ${RAY}H${cx}`} />;
}

// ── Identity: the drawn ring is the old key; it rotates (a perspective arc) into the real green ring, with the name
// engraved along its top face ──
function IdentFront({ id }: { id: string }) {
  const [cx, cy] = at("identity", RING.cx, RING.cy);
  const rx = 125, ry = 77;
  const p = (deg: number): [number, number] => {
    const a = (deg * Math.PI) / 180;
    return [n(cx + rx * Math.cos(a)), n(cy + ry * Math.sin(a))];
  };
  const [x0, y0] = p(192), [x1, y1] = p(348);
  const ta = (348 * Math.PI) / 180;
  // the engraving's path: the middle of the top face's front band, left to right
  const [mx, my] = at("identity", RING.cx, 428);
  const mrx = n(475 * ST.identity.k), mry = n(287 * ST.identity.k);
  const [wx, wy] = at("identity", 1385, 520);
  return (
    <>
      <defs>
        <path id={`${id}eng`} d={`M${n(mx - mrx)} ${my}A${mrx} ${mry} 0 0 0 ${n(mx + mrx)} ${my}`} />
      </defs>
      <path className={s.hair} d={`M${x0} ${y0}A${rx} ${ry} 0 0 1 ${x1} ${y1}${head(x1, y1, -rx * Math.sin(ta), ry * Math.cos(ta))}`} />
      <text className={s.micro} x={n(cx)} y={n(cy - ry - 6)} textAnchor="middle">single rotation</text>
      <text className={s.engrave} dy="4.5">
        <textPath href={`#${id}eng`} startOffset="50%" textAnchor="middle">your-name.near</textPath>
      </text>
      <path className={s.thin} d={`M${wx + 3} ${wy}L352 236H400`} />
      <text className={s.label} x="400" y="252" textAnchor="end">35+ chains</text>
      <path className={s.thin} d={`${cross(20, 28)}${cross(20, 286)}`} />
    </>
  );
}

function Drawn({ d, k }: { d: Drawing; k: number }) {
  return (
    <g className={s.draw} style={{ "--k": k } as CSSProperties}>
      {d.hatch && <path className={s.hatch} d={d.hatch} />}
      {d.fine && <path className={s.fine} d={d.fine} />}
      {d.axis && <path className={s.axis} d={d.axis} />}
      {d.hidden && <path className={s.hidden} d={d.hidden} />}
      <path className={s.line} d={d.lines} />
    </g>
  );
}

function Art({ which }: { which: OwnKey }) {
  const id = useId().replace(/:/g, "");
  const st = ST[which];
  const [r0, r1] = st.reveal;
  const behind: Partial<Record<OwnKey, ReactNode>> = { data: <DataBehind />, intelligence: <IntelBehind /> };
  return (
    <div className={s.art} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} focusable="false">
        <defs>
          {/* the reveal runs a little off vertical, so the seam reads as a sweep rather than a cut */}
          <linearGradient id={`${id}in`} gradientUnits="userSpaceOnUse" x1={r0} y1={H * (0.5 - st.tilt)} x2={r1} y2={H * (0.5 + st.tilt)}>
            <stop offset="0" className={s.white} stopOpacity="0" />
            <stop offset="1" className={s.white} />
          </linearGradient>
          <linearGradient id={`${id}out`} gradientUnits="userSpaceOnUse" x1={r0} y1={H * (0.5 - st.tilt)} x2={r1 + 14} y2={H * (0.5 + st.tilt)}>
            <stop offset="0" className={s.white} />
            <stop offset="1" className={s.white} stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}show`} maskUnits="userSpaceOnUse" x="-20" y="-20" width={W + 40} height={H + 40}>
            <rect x="-20" y="-20" width={W + 40} height={H + 40} fill={`url(#${id}in)`} />
          </mask>
          {/* the drawn edges carry on a little way over the render, so you see them land on the real ones */}
          <linearGradient id={`${id}seam`} gradientUnits="userSpaceOnUse" x1={r0} y1={H * (0.5 - st.tilt)} x2={r1 + 44} y2={H * (0.5 + st.tilt)}>
            <stop offset="0" className={s.white} stopOpacity="0" />
            <stop offset="0.45" className={s.white} stopOpacity="0.6" />
            <stop offset="1" className={s.white} stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}trace`} maskUnits="userSpaceOnUse" x="-20" y="-20" width={W + 40} height={H + 40}>
            <rect x="-20" y="-20" width={W + 40} height={H + 40} fill={`url(#${id}seam)`} />
          </mask>
          <mask id={`${id}hide`} maskUnits="userSpaceOnUse" x="-20" y="-20" width={W + 40} height={H + 40}>
            <rect x="-20" y="-20" width={W + 40} height={H + 40} fill={`url(#${id}out)`} />
          </mask>
        </defs>
        <g mask={`url(#${id}hide)`}>
          {behind[which]}
          <g transform={`translate(${st.x} ${st.y}) scale(${st.k})`}><Drawn d={st.d} k={st.k} /></g>
        </g>
        <image
          href={`/lab/own-hybrid/materialise-${which}.webp`}
          x={st.x}
          y={st.y}
          width={n(st.d.w * st.k)}
          height={n(st.d.h * st.k)}
          preserveAspectRatio="none"
          mask={`url(#${id}show)`}
        />
        <g mask={`url(#${id}trace)`}>
          <g transform={`translate(${st.x} ${st.y}) scale(${st.k})`}>
            <path className={`${s.draw} ${s.line}`} style={{ "--k": st.k } as CSSProperties} d={st.d.lines} />
          </g>
        </g>
        {which === "data" && <DataFront />}
        {which === "assets" && <AssetsFront />}
        {which === "intelligence" && <IntelFront />}
        {which === "identity" && <IdentFront id={id} />}
      </svg>
    </div>
  );
}

export const style: StyleDef = {
  key: "materialise",
  name: "Materialise",
  refs: "Engineering and patent drawings (projection, hidden lines, hatching, dimension lines); FutureDeluxe and ManvsMachine renders",
  summary:
    "Each object is half technical drawing, half real: a precise hairline drawing on the left, with hidden edges dashed and centre lines and dimensions, becomes the photoreal glass and metal render across the middle, the drawn edges running straight on into the real ones. The idea becoming a thing; one green part.",
  motion: "The drawing draws on line by line from the left, then the render fades in behind the seam as the seam slides a little to the left, and the drawing it covers fades away.",
  Art,
};
