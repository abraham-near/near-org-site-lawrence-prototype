import Image from "next/image";
import { useId, type CSSProperties, type ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../../../own-styles/styles/types";
import { add, arc, f, pt, ring, seg, ticks, type Ell, type Pt } from "./geom";
import s from "./sapphire.module.css";

// Sapphire (D54): Tendril's Full Sapphire tourbillon for Hublot, set in a watch-movement drawing. Each station is one
// clear sapphire part with polished steel and a single green jewel or anodised part (rendered stills with transparent
// backgrounds, `public/lab/own-hybrid/sapphire-*.webp`), registered to a hairline drawing in the render's own
// perspective: concentric construction circles, radial micro ticks, jewel-bearing crosshairs, dash-dot exploded axes and
// the crystal's hidden edges continued past the render. One SVG sits under the render (lines seen through the crystal),
// one over it. Measured on the 420 × 315 box.

const W = 420, H = 315;

// `zoom` [k, cx, cy]: the still is cropped k times tighter about (cx, cy) (the webp is cut to match), so the drawing,
// measured on the uncropped render, is scaled with it; type and strokes divide by --k to keep their size
type Zoom = readonly [number, number, number];
function Frame({ src, back, front, zoom = [1, W / 2, H / 2] }: { src: string; back: ReactNode; front: ReactNode; zoom?: Zoom }) {
  const [k, cx, cy] = zoom;
  const t = k === 1 ? undefined : `translate(${W / 2} ${H / 2}) scale(${k}) translate(${-cx} ${-cy})`;
  return (
    <div className={s.art} aria-hidden="true" style={{ "--k": k } as CSSProperties}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`}><g transform={t}>{back}</g></svg>
      <Image className={s.img} src={`/lab/own-hybrid/sapphire-${src}.webp`} alt="" fill unoptimized />
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`}><g transform={t}>{front}</g></svg>
    </div>
  );
}

// A jewel-bearing crosshair: a small ring and four arms that stop short of it
function Cross({ c, r = 4, arm = 11, cls = s.hair }: { c: Pt; r?: number; arm?: number; cls?: string }) {
  const [x, y] = c, g = r + 2.5;
  return (
    <g className={cls}>
      <circle cx={x} cy={y} r={r} />
      <path d={`M${x - arm - g} ${y}h${arm}M${x + g} ${y}h${arm}M${x} ${y - arm - g}v${arm}M${x} ${y + g}v${arm}`} />
    </g>
  );
}

// A callout: a leader from the part to a short shelf, the label sitting on the shelf
function Callout({ from, knee, to, children, cls = s.label, anchor = "start" }: { from: Pt; knee: Pt; to: number; children: ReactNode; cls?: string; anchor?: "start" | "end" }) {
  return (
    <>
      <circle className={s.ink} cx={from[0]} cy={from[1]} r="1.1" />
      <path className={s.hair} d={`M${from[0]} ${from[1]}L${knee[0]} ${knee[1]}H${to}`} />
      <text className={cls} x={anchor === "start" ? Math.min(knee[0], to) : Math.max(knee[0], to)} y={knee[1] - 4.5} textAnchor={anchor}>{children}</text>
    </>
  );
}

// Radial index lines in an ellipse's plane, between scales s1 and s2, at the given angles
const radials = (e: Ell, angles: number[], s1: number, s2: number) => angles.map((t) => seg(pt(e, t, s1), pt(e, t, s2))).join("");
const every = (step: number, from = 0) => Array.from({ length: Math.round(360 / step) }, (_, i) => from + i * step);

// A dash-dot centre line from a to b with short end ticks across it
function Axis({ a, b }: { a: Pt; b: Pt }) {
  return <path className={s.axis} d={seg(a, b)} />;
}

// ── Data: an upright sapphire disc, clear at the rim and frosted at the heart. Fine lines run in along its axle and
// leave the far side as dots; a green jewel sits in the rim
const DISC: Ell = { cx: 214, cy: 155, rx: 64, ry: 97, rot: 5 };
const AX: Pt = [52, 3]; // the axle, one disc-radius long, pointing away through the disc
function Data() {
  const C: Pt = [DISC.cx, DISC.cy];
  const rows = Array.from({ length: 9 }, (_, i) => -0.56 + i * 0.14);
  const on = (b: number) => add(C, add(pt(DISC, 90), C, -1), b); // a point on the disc's upright diameter
  return (
    <Frame
      src="data"
      back={
        <>
          {/* behind the crystal: the hidden back face, inner construction circles, the lines inside the glass */}
          <path className={s.hidden} d={ring({ ...DISC, cx: DISC.cx + AX[0] * 0.2, cy: DISC.cy + AX[1] * 0.2 }, 0.985)} />
          <path className={s.faint} d={ring(DISC, 0.62)} />
          <path className={s.faint} d={ring(DISC, 0.34)} />
          {/* in: fine lines along the axle, under the render so the crystal takes them; out: the same rows as dots */}
          {rows.map((b) => <path key={`i${b}`} className={s.hair} d={seg(add(on(b), AX, -2.35), on(b))} />)}
          {rows.map((b) => <path key={b} className={s.dotsSoft} d={seg(add(on(b), AX, 0.1), add(on(b), AX, 1.3))} />)}
          <path className={s.fine} d={ticks(DISC, 0, 357, 3, 1.1, 1.145, 10, 1.2)} />
          <path className={s.faint} d={ring(DISC, 1.155)} />
          {/* the dial's index lines between the inner construction circles */}
          <path className={s.fine} d={radials(DISC, every(30, 15), 0.38, 0.58)} />
          <path className={s.faint} d={ring(DISC, 0.5)} />
        </>
      }
      front={
        <>
          <Axis a={add(C, AX, -2.75)} b={add(C, AX, 3.3)} />
          <Axis a={pt(DISC, 270, 1.48)} b={pt(DISC, 90, 1.48)} />
          {/* the dial (its tick ring sits behind, in the disc's plane): construction circles */}
          <path className={s.faint} d={ring(DISC, 1.27)} />
          <path className={s.dash} d={arc(DISC, 200, 330, 1.4)} />
          <path className={s.dash} d={arc(DISC, 30, 150, 1.4)} />
          {rows.map((b) => <path key={b} className={s.dots} d={seg(add(on(b), AX, 1.42), add(on(b), AX, 2.95))} />)}
          <path className={s.fine} d={seg(add(on(-0.7), AX, -2.35), add(on(0.7), AX, -2.35))} />
          <Cross c={[C[0] + 4, C[1] + 1.5]} r={3.5} arm={9} />
          <Cross c={[219, 62]} r={6.5} arm={8} />
          {/* the axle's collets */}
          <Cross c={[142, 153.5]} r={2.4} arm={5} cls={s.fine} />
          <Cross c={[270.5, 158]} r={2.4} arm={5} cls={s.fine} />
          <Callout from={add(on(0.56), AX, 2.2)} knee={[338, 250]} to={404} anchor="end">Private</Callout>
        </>
      }
    />
  );
}

// ── Assets: a sapphire bridge plate (the one account, its length dimensioned) holding two wheels; the swap lifts out of the steel one and lands
// on the green one along an exploded arc
const STEEL: Ell = { cx: 157, cy: 161, rx: 38, ry: 24, rot: -16 };
const GREEN: Ell = { cx: 265, cy: 132.5, rx: 40, ry: 25, rot: -16 };
const SCREW = { tl: [96, 146] as Pt, tr: [294, 92.5] as Pt, br: [337.5, 154] as Pt, bl: [131, 215] as Pt };
const ext = (a: Pt, b: Pt, k: number) => seg(add(a, [b[0] - a[0], b[1] - a[1]], -k), add(b, [b[0] - a[0], b[1] - a[1]], k));
function Assets() {
  const A: Pt = [159, 164], B: Pt = [264, 131];
  const M: Pt = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d: Pt = [(B[0] - A[0]) / 2, (B[1] - A[1]) / 2], h = 74;
  const P = (deg: number, k = 1): Pt => {
    const r = (deg * Math.PI) / 180;
    return [f(M[0] + (d[0] * Math.cos(r)) * k), f(M[1] + (d[1] * Math.cos(r) - h * Math.sin(r)) * k)];
  };
  const path = (t0: number, t1: number) => Array.from({ length: Math.round((t0 - t1) / 3) + 1 }, (_, i) => P(t0 - i * 3)).map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("");
  const scale = Array.from({ length: 17 }, (_, i) => 160 - i * 10).map((t, i) => seg(P(t), P(t, i % 4 === 0 ? 1.1 : 1.055))).join("");
  const tip = B;
  const { tl, tr, br, bl } = SCREW;
  return (
    <Frame
      src="assets"
      zoom={[1.25, 214, 160]}
      back={
        <>
          {/* construction lines through the plate's screws, run on past its corners */}
          <path className={s.faint} d={ext(tl, tr, 0.16) + ext(bl, br, 0.16) + ext(tl, bl, 0.3) + ext(tr, br, 0.3)} />
          {/* the wheels' axes run on down through the crystal */}
          <Axis a={A} b={[A[0] - 3, A[1] + 70]} />
          <Axis a={B} b={[B[0] - 3, B[1] + 70]} />
          {/* the plate's diagonals, crossing at its centre */}
          <path className={s.faint} d={seg(tl, br) + seg(tr, bl)} />
          <Cross c={[214.6, 152]} r={2.4} arm={5} cls={s.fine} />
        </>
      }
      front={
        <>
          <path className={s.fine} d={ticks(STEEL, 0, 355, 5, 1.1, 1.16, 6, 1.24)} />
          <path className={s.dash} d={ring(STEEL, 1.34)} />
          <path className={s.dash} d={ring(GREEN, 1.3)} />
          <path className={s.fine} d={radials(GREEN, every(30), 1.1, 1.2)} />
          {/* the arc's construction: its chord and its rise */}
          <path className={s.hidden} d={seg(A, B)} />
          <Axis a={M} b={P(90)} />
          <Axis a={A} b={[A[0] + 2, A[1] - 48]} />
          <Axis a={B} b={[B[0] + 2, B[1] - 34]} />
          {/* the swap: an exploded arc with a graduated scale, landing green */}
          <path className={s.hair} d={path(180, 42)} />
          <path className={s.fine} d={scale} />
          <path className={s.gLine} d={path(42, 0)} />
          <path className={s.gFill} d={`M${tip[0]} ${tip[1]}l-1.2-6.4l4.6 2.2z`} />
          {[tl, tr, br, bl].map((c, i) => <Cross key={i} c={c} r={5.5} arm={6} cls={s.fine} />)}
          <Cross c={A} r={3} arm={8} />
          <Cross c={B} r={3} arm={8} cls={s.gHair} />
          <text className={s.label} x={P(90)[0]} y={P(90)[1] - 13} textAnchor="middle">Swap</text>
          {/* a dimension line along the plate's front edge */}
          <path className={s.hair} d={`${seg(add(bl, [9, 36]), add(br, [9, 36]))}${seg(add(bl, [7.5, 31]), add(bl, [10.5, 41]))}${seg(add(br, [7.5, 31]), add(br, [10.5, 41]))}`} />
          <path className={s.fine} d={seg(add(bl, [2, 7]), add(bl, [10.5, 41])) + seg(add(br, [2, 7]), add(br, [10.5, 41]))} />
        </>
      }
    />
  );
}

// ── Intelligence: a step-cut sapphire block sealing a machined core (the enclave). A request comes in as one ray; the
// green jewel on its corner seals what leaves
const CORE: Pt = [200, 151];
const DIAL: Ell = { cx: CORE[0], cy: CORE[1], rx: 136, ry: 122 };
function Intelligence() {
  const top = [[138, 83], [280, 96]] as const, bottom = [[131, 211.5], [287, 235]] as const;
  const coreE: Ell = { cx: CORE[0], cy: CORE[1], rx: 37, ry: 36 };
  const seal: Pt = [342, 86];
  return (
    <Frame
      src="intelligence"
      back={
        <>
          <path className={s.hair} d={seg([109, 151], [CORE[0] - 6, CORE[1]])} />
          <path className={s.dash} d={ring(coreE, 1.2)} />
          <path className={s.fine} d={ticks(coreE, 0, 357, 6, 1.32, 1.38, 5, 1.45)} />
          <Axis a={[CORE[0], 70]} b={[CORE[0], 240]} />
        </>
      }
      front={
        <>
          {/* the crystal's edges, continued past it as hidden lines */}
          <path className={s.hidden} d={ext(top[0], top[1], 0.3) + ext(bottom[0], bottom[1], 0.3)} />
          <path className={s.hidden} d="M109 112V58M109 204V262M311 124V60M311 205V266" />
          {/* the dial the core sits in, seen only where it clears the crystal */}
          <path className={s.fine} d={ticks(DIAL, 214, 326, 2, 1, 1.03, 5, 1.065)} />
          <path className={s.faint} d={arc(DIAL, 205, 335, 0.96)} />
          <path className={s.fine} d={ticks(DIAL, 52, 128, 2, 1, 1.03, 5, 1.065)} />
          <Axis a={[CORE[0], 22]} b={[CORE[0], 70]} />
          <Axis a={[CORE[0], 240]} b={[CORE[0], 292]} />
          {/* the request: one ray in */}
          <path className={s.hair} d={seg([22, 151], [104, 151])} />
          <path className={s.ink} d="M106 151l-6-2.6v5.2z" />
          <path className={s.fine} d={Array.from({ length: 9 }, (_, i) => `M${30 + i * 8} 151v${i % 4 === 0 ? 5 : 3}`).join("")} />
          {/* the block's width, dimensioned between its continued edges, and its centre line out to the dial */}
          <path className={s.hair} d="M109 66H311M106 69l6-6M308 69l6-6" />
          <Axis a={[311, 151]} b={[352, 151]} />
          <Cross c={CORE} r={4} arm={10} />
          {/* the seal: the green jewel's mark, a leader out to the proof */}
          <Cross c={[293, 126]} r={8.5} arm={6} cls={s.gHair} />
          <path className={s.gLine} d={`M299.5 120L${seal[0] - 7} ${seal[1] + 6}`} />
          <circle className={s.gHair} cx={seal[0]} cy={seal[1]} r="7.5" />
          <circle className={s.gFill} cx={seal[0]} cy={seal[1]} r="2.6" />
          <path className={s.gHair} d={ticks({ cx: seal[0], cy: seal[1], rx: 1, ry: 1 }, 0, 345, 15, 9.5, 11.5)} />
          <path className={s.gLine} d={`M${seal[0] + 11.5} ${seal[1]}H404`} />
          <text className={s.gLabel} x="404" y={seal[1] - 15} textAnchor="end">Signed proof</text>
        </>
      }
    />
  );
}

// ── Identity: a sapphire bezel carrying a green anodised ring (the new keys). The old ring is lifted off the same
// axes as a hairline ghost, turned an eighth; the rotation is an arc on it. The name is engraved round the bezel
const BEZEL: Ell = { cx: 207, cy: 146, rx: 128, ry: 66 };
const KEY: Ell = { cx: 210, cy: 146, rx: 102.5, ry: 54 };
const KEY_IN: Ell = { cx: 210, cy: 146, rx: 89, ry: 46 };
const LIFT = 64;
function Identity() {
  const id = useId();
  const ghost: Ell = { ...KEY, cy: KEY.cy - LIFT }, ghostIn: Ell = { ...KEY_IN, cy: KEY_IN.cy - LIFT };
  const screws = [0, 90, 180, 270].map((t) => pt(KEY, t, 0.935));
  const turned = [45, 135, 225, 315].map((t) => pt(ghost, t, 0.935));
  const name: Ell = { cx: 208, cy: 146, rx: 122, ry: 63.5 };
  return (
    <Frame
      src="identity"
      back={
        <>
          <path className={s.faint} d={ring(BEZEL, 1.16)} />
          {screws.map((c, i) => <Axis key={i} a={c} b={[c[0], c[1] + 40]} />)}
          {/* the bezel's underside, a hidden edge seen through the crystal */}
          <path className={s.hidden} d={ring({ ...BEZEL, cy: BEZEL.cy + 18 }, 0.995)} />
        </>
      }
      front={
        <>
          <defs><path id={`${id}n`} d={`M${name.cx - name.rx} ${name.cy}A${name.rx} ${name.ry} 0 0 0 ${name.cx + name.rx} ${name.cy}`} /></defs>
          <path className={s.fine} d={ticks(BEZEL, 0, 358, 2, 1.06, 1.09, 5, 1.12)} />
          {/* a rehaut track round the inner flange; the name engraved round the bezel's near side */}
          <path className={s.fine} d={ticks(KEY_IN, 200, 340, 4, 0.9, 0.95, 5, 0.98)} />
          <text className={s.name}>
            <textPath href={`#${id}n`} startOffset="50%" textAnchor="middle">your-name<tspan className={s.near}>.near</tspan></textPath>
          </text>
          {/* the old ring, lifted on its axes and turned an eighth */}
          <path className={s.ghost} d={ring(ghost) + ring(ghostIn)} />
          {screws.map((c, i) => <Axis key={i} a={c} b={add(c, [0, -LIFT])} />)}
          {turned.map((c, i) => <circle key={i} className={s.fine} cx={c[0]} cy={c[1]} r="2.4" />)}
          {/* the single rotation: an arc on the ghost from an old screw to a new one */}
          <path className={s.fine} d={seg(pt(ghost, 225, 0.935), pt(ghost, 225, 1.2)) + seg(pt(ghost, 270, 0.935), pt(ghost, 270, 1.2))} />
          <path className={s.fine} d={ticks(ghost, 225, 270, 5, 1.1, 1.135)} />
          <path className={s.gLine} d={arc(ghost, 225, 267, 1.16)} />
          <path className={s.gFill} d={`M${pt(ghost, 270, 1.16)[0] + 1} ${pt(ghost, 270, 1.16)[1]}l-6.2-2.6v5.2z`} />
          {/* index lines from the screws out across the bezel's track, and an outer graduated arc on the near side */}
          <path className={s.fine} d={[0, 90, 180, 270].map((t) => seg(pt(KEY, t, 1.03), pt(BEZEL, t, 1.13))).join("")} />
          <path className={s.dash} d={arc(BEZEL, 20, 160, 1.22)} />
          <path className={s.fine} d={ticks(BEZEL, 30, 150, 10, 1.22, 1.25, 3, 1.28)} />
        </>
      }
    />
  );
}

function Art({ which }: { which: OwnKey }) {
  if (which === "data") return <Data />;
  if (which === "assets") return <Assets />;
  if (which === "intelligence") return <Intelligence />;
  return <Identity />;
}

export const style: StyleDef = {
  key: "sapphire",
  name: "Sapphire",
  refs: "Tendril for Hublot (Big Bang Full Sapphire tourbillon); Swiss watch-movement exploded drawings",
  summary:
    "Each station is one clear sapphire part, faceted and chamfered with crisp internal reflections, set with polished steel and a single green jewel or anodised part. Around it runs a watchmaker’s drawing in the render’s own perspective: concentric construction circles, radial micro ticks, jewel-bearing crosshairs, dash-dot exploded axes, dimension lines and the crystal’s hidden edges carried on past it, with one small tag per station.",
  motion:
    "The hairlines draw on from each part’s centre outward, ticks first, and the crystal turns a few degrees on its axle so its facets catch the light, then settles.",
  Art,
};
