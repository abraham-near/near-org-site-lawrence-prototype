import { useId } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../../../own-styles/styles/types";
import s from "./field.module.css";

// "Field" (D54, after Ryoji Ikeda's datamatics and test patterns, seen through frosted glass). The vector layer leads:
// dense hairline fields and dot matrices, generated here as a few <path>s with many subpaths, fill the 420 × 315 box.
// Rendered frosted glass and thin metal (Higgsfield stills, transparent) float in the field. Where the field passes
// behind a pane, a blurred copy of it is laid over the glass, masked by the glass's own silhouette (a small alpha mask
// cut from the render), so the glass reads as frosting the lines. One green element per station.

const W = 420;
const H = 315;
const n = (v: number) => Math.round(v * 100) / 100;

// Seeded PRNG (mulberry32), so the field is the same on server and client
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 1831565813) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const dot = (x: number, y: number) => `M${n(x)} ${n(y)}h0.01`;

// A render placed in the box, and its glass mask (same rectangle)
type Img = { src: string; x: number; y: number; w: number; h: number };
const IMG: Record<OwnKey, Img> = {
  data: { src: "data", x: 200, y: 38, w: 116.6, h: 210 },
  assets: { src: "assets", x: 45, y: 55, w: 329.6, h: 194.7 },
  intelligence: { src: "intelligence", x: 125, y: 55, w: 170, h: 166.6 },
  identity: { src: "identity", x: 100, y: 35, w: 219, h: 225 },
};

type Field = { thin: string; mid: string; bold: string; dots: string; fine: string; rule: string };
const empty = (): Field => ({ thin: "", mid: "", bold: "", dots: "", fine: "", rule: "" });

// Data: a datamatics band (barcode, a micro tick row, rows of hairline segments) runs into the frosted slab; past it the
// same rows come out as a thinning dot matrix
const DATA = (() => {
  const r = rng(11);
  const f = empty();
  const end = 318;
  for (let x = 24; x < end; ) {
    const p = r();
    const top = 98 + (r() < 0.18 ? r() * 18 : 0);
    const seg = `M${n(x)} ${n(top)}V150`;
    if (p < 0.72) f.thin += seg;
    else if (p < 0.94) f.mid += seg;
    else f.bold += seg;
    x += 2.2 + r() * r() * 8 + (p >= 0.9 ? 1.5 : 0);
  }
  for (let x = 24, i = 0; x < end; x += 1.8, i++) f.thin += `M${n(x)} 155v${i % 10 === 0 ? 5 : i % 2 ? 2.5 : 3.5}`;
  for (let i = 0; i < 17; i++) {
    const y = 165 + i * 2.2;
    for (let x = 24; x < end; ) {
      const len = Math.min(1.5 + r() * r() * 38, end - x);
      if (r() < 0.55) f.thin += `M${n(x)} ${n(y)}h${n(len)}`;
      x += len + 1 + r() * 3.5;
    }
  }
  // the dot matrix the rows become on the far side of the glass (private)
  for (let y = 99; y <= 202; y += 3.4) {
    for (let x = 326; x <= 398; x += 3.4) {
      const t = (x - 326) / 72;
      if (r() < 0.82 * (1 - t) ** 1.4 + 0.04) {
        if (r() < 0.3) f.dots += dot(x, y);
        else f.fine += dot(x, y);
      }
    }
  }
  return f;
})();

// Assets: a dot matrix on a plane in the frosted slab's own perspective (just under its base), so the slab floats over
// the field and frosts the part beneath it; past its edges the matrix carries on and thins out. The slab's top-face
// corners, measured on the render and dropped by its thickness, give the plane (a projective map from the unit square)
const AK = 0.156, AX = 45, AY = 55, DROP = 95;
const ap = (px: number, py: number): [number, number] => [AX + px * AK, AY + (py + DROP) * AK];
const P0 = ap(985, 18.5), P1 = ap(2106, 465), P2 = ap(1120, 1137), P3 = ap(8, 509); // back, right, front, left
const plane = (() => {
  const [x0, y0] = P0, [x1, y1] = P1, [x2, y2] = P2, [x3, y3] = P3;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, h = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
  return (u: number, v: number): [number, number] => {
    const w = g * u + h * v + 1;
    return [(a * u + b * v + x0) / w, (d * u + e * v + y0) / w];
  };
})();
const ASSETS = (() => {
  const r = rng(23);
  const f = empty();
  const N = 30;
  for (let j = -14; j <= N + 14; j++) {
    for (let i = -14; i <= N + 14; i++) {
      const u = i / N, v = j / N;
      const out = Math.max(-u, u - 1, -v, v - 1, 0); // how far past the slab's footprint
      const keep = out === 0 ? 0.92 : 0.85 * Math.exp(-out / 0.2);
      if (r() > keep) continue;
      const [x, y] = plane(u, v);
      if (x < 8 || x > 412 || y < 8 || y > 300) continue;
      if (out < 0.12 && (i + j) % 2 === 0) f.dots += dot(x, y);
      else f.fine += dot(x, y);
    }
  }
  // the ledger's rules, under the slab only: they show through it, frosted
  for (let t = 1; t < 6; t++) {
    const [ax, ay] = plane(t / 6, 0.02), [bx, by] = plane(t / 6, 0.98), [cx, cy] = plane(0.02, t / 6), [dx, dy] = plane(0.98, t / 6);
    f.mid += `M${n(ax)} ${n(ay)}L${n(bx)} ${n(by)}M${n(cx)} ${n(cy)}L${n(dx)} ${n(dy)}`;
  }
  return f;
})();

// Intelligence: a test-pattern field of vertical hairlines in two bands, with a clear channel for the request
const RAY = 143;
const GAP = 21;
const INTEL = (() => {
  const r = rng(37);
  const f = empty();
  for (let x = 22; x < 398; ) {
    const p = r();
    const up = r() < 0.2 ? 60 + r() * 34 : 60;
    const dn = r() < 0.2 ? 226 - r() * 34 : 226;
    const seg = `M${n(x)} ${n(up)}V${RAY - GAP}M${n(x)} ${RAY + GAP}V${n(dn)}`;
    if (p < 0.72) f.thin += seg;
    else if (p < 0.94) f.mid += seg;
    else f.bold += seg;
    x += 2.2 + r() * r() * 8 + (p >= 0.92 ? 1.5 : 0);
  }
  // a row of micro ticks under the channel, where no label sits
  for (let x = 22, i = 0; x < 398; x += 2, i++) f.thin += `M${x} ${RAY + GAP - 3}v${i % 5 ? -1.5 : -3}`;
  return f;
})();

// Identity: a concentric test pattern around the disc's centre, with a graduated outer ring
const C = { x: 196, y: 147 };
const IDENT = (() => {
  const r = rng(53);
  const f = empty();
  for (let rad = 20; rad < 140; rad += 2.5 + r() * 1.4) {
    const arc = `M${n(C.x - rad)} ${C.y}a${n(rad)} ${n(rad)} 0 1 0 ${n(rad * 2)} 0a${n(rad)} ${n(rad)} 0 1 0 ${n(-rad * 2)} 0`;
    const p = r();
    if (p < 0.82) f.thin += arc;
    else if (p < 0.97) f.mid += arc;
    else f.bold += arc;
  }
  for (let i = 0; i < 180; i++) {
    const a = (i / 180) * Math.PI * 2;
    const r0 = 145;
    const r1 = r0 + (i % 15 === 0 ? 8 : i % 5 === 0 ? 5 : 2.5);
    f.thin += `M${n(C.x + Math.cos(a) * r0)} ${n(C.y + Math.sin(a) * r0)}L${n(C.x + Math.cos(a) * r1)} ${n(C.y + Math.sin(a) * r1)}`;
  }
  return f;
})();

const FIELD: Record<OwnKey, Field> = { data: DATA, assets: ASSETS, intelligence: INTEL, identity: IDENT };

function Paths({ f }: { f: Field }) {
  return (
    <>
      {f.rule && <path className={s.faint} d={f.rule} />}
      {f.thin && <path className={s.f} d={f.thin} />}
      {f.mid && <path className={s.fMid} d={f.mid} />}
      {f.bold && <path className={s.fBold} d={f.bold} />}
      {f.fine && <path className={s.dotsFine} d={f.fine} />}
      {f.dots && <path className={s.dots} d={f.dots} />}
    </>
  );
}

// Registration cross with a gap at its centre
const cross = (x: number, y: number, r = 4) => `M${x - r} ${y}h${r - 1.2}M${x + 1.2} ${y}h${r - 1.2}M${x} ${y - r}v${r - 1.2}M${x} ${y + 1.2}v${r - 1.2}`;
// A scale of micro ticks from x0 to x1 at y (ticks hang down)
const scale = (x0: number, x1: number, y: number, step = 6) => {
  let d = `M${x0} ${y}H${x1}`;
  for (let x = x0, i = 0; x <= x1 + 0.01; x += step, i++) d += `M${n(x)} ${y}v${i % 5 ? 2 : 4}`;
  return d;
};

function Front({ which }: { which: OwnKey }) {
  switch (which) {
    case "data":
      return (
        <>
          <path className={s.faint} d={scale(24, 396, 26)} />
          <path className={s.hair} d={`${cross(24, 236)}${cross(396, 60)}`} />
          <rect className={s.ink} x="24" y="77" width="4" height="4" />
          <text className={s.micro} x="34" y="83">Transactions and prompts</text>
          <path className={s.hair} d="M362 206V226H396" />
          <text className={s.label} x="396" y="242" textAnchor="end">Private</text>
        </>
      );
    case "assets":
      return (
        <>
          <path className={s.hair} d="M158 118Q209.5 56 261 118" />
          <path className={s.hair} d="M256 115.4L261 118.4L260.4 112.6" />
          <circle className={s.ink} cx="158" cy="118" r="1.4" />
          <text className={s.label} x="209.5" y="80" textAnchor="middle">Swap</text>
          <path className={s.faint} d={`${cross(24, 40)}${cross(396, 276)}`} />
          <path className={s.thin} d="M223.5 249V268" />
          <text className={s.micro} x="223.5" y="284" textAnchor="middle">one account only you control</text>
        </>
      );
    case "intelligence":
      return (
        <>
          <path className={s.hair} d={`M22 ${RAY}H128`} />
          <path className={s.hair} d={`M123 ${RAY - 3.4}L128 ${RAY}L123 ${RAY + 3.4}`} />
          <text className={s.micro} x="22" y={RAY - 5}>request</text>
          <path className={s.green} d={`M292 ${RAY}H384`} />
          <rect className={s.greenFill} x="384" y={RAY - 3.5} width="7" height="7" />
          <text className={s.label} x="398" y={RAY - 7} textAnchor="end">Signed proof</text>
          <path className={s.faint} d={`${scale(128, 292, 240, 4.1)}${cross(22, 46)}${cross(398, 240)}`} />
          <text className={s.micro} x="210" y="262" textAnchor="middle">hardware enclaves</text>
        </>
      );
    case "identity":
      return (
        <>
          <ellipse className={s.dash} cx="202" cy="134" rx="109" ry="31" transform="rotate(-25 202 134)" />
          <path className={s.hair} d="M300.8 88A109 109 0 0 1 300.8 180" />
          <path className={s.hair} d="M305.8 176.8L300.8 180L300 174.1" />
          <path className={s.thin} d="M311.2 140L334 250H398" />
          <text className={s.micro} x="398" y="266" textAnchor="end">single rotation</text>
          <text className={s.mono} x="212" y="139" textAnchor="middle">your-name<tspan className={s.muted}>.near</tspan></text>
          <path className={s.hair} d="M307.1 53.8L322 38H398" />
          <text className={s.label} x="398" y="31" textAnchor="end">35+ chains</text>
        </>
      );
  }
}

function Art({ which }: { which: OwnKey }) {
  const id = useId().replace(/:/g, "");
  const img = IMG[which];
  const f = FIELD[which];
  const href = `/lab/own-hybrid/field-${img.src}.webp`;
  const glass = `/lab/own-hybrid/field-${img.src}-glass.webp`;
  const radial = which === "identity";
  return (
    <div className={s.art} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} focusable="false">
        <defs>
          {radial ? (
            <radialGradient id={`${id}g`} cx={C.x} cy={C.y} r="168" gradientUnits="userSpaceOnUse">
              <stop offset="0.7" className={s.white} />
              <stop offset="1" className={s.white} stopOpacity="0" />
            </radialGradient>
          ) : (
            <linearGradient id={`${id}g`} x1="0" x2={W} y1="0" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0.03" className={s.white} stopOpacity="0" />
              <stop offset="0.14" className={s.white} />
              <stop offset="0.86" className={s.white} />
              <stop offset="0.97" className={s.white} stopOpacity="0" />
            </linearGradient>
          )}
          <mask id={`${id}fade`} maskUnits="userSpaceOnUse" x="-20" y="-20" width={W + 40} height={H + 40}>
            <rect x="-20" y="-20" width={W + 40} height={H + 40} fill={`url(#${id}g)`} />
          </mask>
          <mask id={`${id}glass`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H} style={{ maskType: "alpha" }}>
            <image href={glass} x={img.x} y={img.y} width={img.w} height={img.h} preserveAspectRatio="none" />
          </mask>
          <filter id={`${id}blur`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="2.1" />
          </filter>
        </defs>
        <g mask={`url(#${id}fade)`}><Paths f={f} /></g>
        <image href={href} x={img.x} y={img.y} width={img.w} height={img.h} preserveAspectRatio="none" />
        <g className={s.frost} style={which === "assets" ? { opacity: 0.75 } : undefined} mask={`url(#${id}glass)`}>
          <g filter={`url(#${id}blur)`}><Paths f={f} /></g>
        </g>
        <Front which={which} />
      </svg>
    </div>
  );
}

export const style: StyleDef = {
  key: "field",
  name: "Field",
  refs: "Ryoji Ikeda (datamatics, test pattern) seen through frosted glass; Microsoft Pixel R&D (ManvsMachine) for the glass",
  summary:
    "The line work leads: dense hairline fields and dot matrices, drawn as data, fill each station, and rendered frosted glass and thin steel float in them. Where the field passes behind the glass it goes soft, as if frosted; one green element per station.",
  motion: "The field draws on row by row from the left, then the glass slides a few pixels into place and the lines behind it soften as it settles.",
  Art,
};
