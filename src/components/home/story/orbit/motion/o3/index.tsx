"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from "react";
import s from "../../orbit.module.css";
import { REDUCED, useSlide } from "../slide";
import { circlePath, HEAD, SQUARE, STAR, type Attrs } from "./geo";
import type { Tokens, View } from "./gl";
import {
  assetsHorizon, assetsPose, assetsVectors, dataPose, dataVectors, LABEL_DATA, SWAP_TAG,
  type AssetsPose, type DataPose,
} from "./scenes";
import m from "./o3.module.css";

// Option 3, real-time 3D (D72): three.js renders the glass and metal live (one shared WebGL renderer, loaded only on
// the client when a drawing is on the rail or in a demo), and Orbit's vector layer is projected from the same scene
// every frame, so the lines sit exactly on the objects. The rest state (reduced motion, phones, no JS, no WebGL) is a
// still rendered from this scene at t = 0 with its vectors drawn from the same pose on the server.
export const name = "Real-time 3D";
export const note =
  "Rendered live in the browser with three.js: real frosted glass (transmission with roughness) that genuinely blurs the green ball behind it, polished metal and chrome in a neutral studio light. The disc turns flat to camera as it reaches the centre and the balls loop on their own time; Orbit’s lines are projected from the 3D scene every frame.";

const W = 420, H = 315;
const SRC = "/images/home/own/motion/o3";

// Lines, markers and tags, keyed so each frame can rewrite them in place (no React render per frame). Their numbers are
// computed on the server and again in the browser, where the last decimal can differ, so hydration doesn't check them.
type K = (k: string, cls: string) => { "data-k": string; className: string; suppressHydrationWarning: true; [attr: string]: string | boolean };

function Stage<P>({ which, rest, under, over, labels, pose, vectors, load, still, props }: {
  which: "data" | "assets";
  rest: Record<string, Attrs>;
  under: (k: K) => ReactNode;
  over: (k: K) => ReactNode;
  labels: ReactNode;
  pose: (slide: number, t: number) => P;
  vectors: (p: P) => Record<string, Attrs>;
  load: () => Promise<(t: Tokens) => View<P>>;
  still: string;
  props: HTMLAttributes<HTMLDivElement>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const gate = useRef<HTMLDivElement>(null); // set only when this drawing moves (on the rail or in a demo)
  const live = useRef<{ view: View<P>; ctx: CanvasRenderingContext2D; els: Map<string, Element>; w: number; h: number; t0: number } | null>(null);
  const k: K = (key, cls) => ({ "data-k": key, className: cls, suppressHydrationWarning: true, ...rest[key] });

  useEffect(() => {
    const el = root.current, cv = canvas.current;
    if (!el || !cv || matchMedia(REDUCED).matches || !el.closest("[data-own-stage], [data-slide-frame]")) return;
    gate.current = el;
    let gone = false, view: View<P> | null = null;
    const ctx = cv.getContext("2d");
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(el.clientWidth * dpr), h = Math.round(el.clientHeight * dpr);
      if (w && h && (cv.width !== w || cv.height !== h)) { cv.width = w; cv.height = h; }
      if (live.current) { live.current.w = w; live.current.h = h; }
    };
    const ro = new ResizeObserver(size);
    ro.observe(el);
    load().then((make) => {
      if (gone || !ctx) return;
      const css = getComputedStyle(el);
      const tok = (n: string) => css.getPropertyValue(`--color-${n}`).trim();
      const tokens = { green: tok("green"), surface: tok("surface"), surface2: tok("surface-2"), onDark: tok("on-dark"), ink: tok("ink") };
      try { view = make(tokens); } catch { return; } // no WebGL: the still stays
      const els = new Map<string, Element>();
      el.querySelectorAll("[data-k]").forEach((n) => els.set(n.getAttribute("data-k")!, n));
      live.current = { view, ctx, els, w: cv.width, h: cv.height, t0: -1 };
    }).catch(() => {});
    return () => { gone = true; ro.disconnect(); view?.dispose(); live.current = null; el.removeAttribute("data-live"); };
  }, [load]);

  const frame = useCallback((slide: number, t: number) => {
    const L = live.current;
    if (!L || !L.w || !L.h) return;
    // the loops start from the rest pose on the first live frame, so the still hands over without a jump
    if (L.t0 < 0) L.t0 = t;
    const p = pose(slide, t - L.t0);
    const v = vectors(p);
    for (const key in v) {
      const n = L.els.get(key);
      if (n) for (const a in v[key]) n.setAttribute(a, v[key][a]);
    }
    L.view.update(p);
    L.view.draw(L.ctx, L.w, L.h);
    if (!root.current?.hasAttribute("data-live")) root.current?.setAttribute("data-live", "");
  }, [pose, vectors]);
  useSlide(gate, frame);

  return (
    <div {...props} ref={root} className={`${s.art} ${m.root} ${props.className ?? ""}`} data-art={which} aria-hidden="true">
      <div className={s.layer}>
        <svg className={`${s.svg} ${s.lines}`} viewBox={`0 0 ${W} ${H}`}>{under(k)}</svg>
        <Image className={`${s.img} ${m.still}`} src={`${SRC}/${still}.webp`} alt="" fill unoptimized />
        <canvas ref={canvas} className={m.canvas} />
        <svg className={`${s.svg} ${s.lines}`} viewBox={`0 0 ${W} ${H}`}>{over(k)}</svg>
      </div>
      <div className={s.layer}>
        <svg className={s.svg} viewBox={`0 0 ${W} ${H}`}>{labels}</svg>
      </div>
    </div>
  );
}

// ── Data
const DATA_REST = dataVectors(dataPose(0, 0));
const loadData = () => import("./gl").then((g) => g.dataView);
const dataParts = {
  under: (k: K) => (
    <>
      <path {...k("innerBack", s.faint)} />
      <path {...k("orbitBack", s.orbit)} />
      <path {...k("ticksBack", s.fine)} />
      <path {...k("track", s.dots)} />
    </>
  ),
  over: (k: K) => (
    <>
      <path {...k("innerFront", s.faint)} />
      <path {...k("orbitFront", s.orbit)} />
      <path {...k("ticksFront", s.fine)} />
      <path {...k("rim", s.fine)} />
      <path {...k("rimArc", s.faint)} />
      <path {...k("trackLeft", s.hair)} />
      <path {...k("trackScale", s.fine)} />
      <g {...k("trackEnd", "")}><path className={s.inkFill} d={circlePath(1.5)} /></g>
      <g {...k("p150", "")}><path className={s.inkFill} d={circlePath(1.8)} /></g>
      <g {...k("p30", "")}><path className={s.marker} d={circlePath(2.2)} /></g>
      <g {...k("p232", "")}><path className={s.hair} d={STAR} /></g>
      <g {...k("p120", "")}><path className={s.marker} d={SQUARE} /></g>
      <path {...k("leader", s.fine)} />
      <g {...k("leadDot", "")}><path className={s.inkFill} d={circlePath(1.6)} /></g>
    </>
  ),
};
export function DataArt(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <Stage<DataPose>
      which="data" rest={DATA_REST} still="data" props={props} pose={dataPose} vectors={dataVectors} load={loadData}
      under={dataParts.under} over={dataParts.over}
      labels={<text className={s.label} x={LABEL_DATA[0]} y={LABEL_DATA[1]} textAnchor="end">Private</text>}
    />
  );
}

// ── Assets
const ASSETS_REST = assetsVectors(assetsPose(0, 0));
const loadAssets = () => import("./gl").then((g) => g.assetsView);
function ecliptic() {
  const y = assetsHorizon();
  let d = `M8 ${y.toFixed(2)}H412`;
  for (let x = 8, i = 0; x <= 412; x += 6, i++) d += `M${x} ${y.toFixed(2)}v${i % 5 === 0 ? -4.5 : -2}`;
  return d;
}
const ECLIPTIC = ecliptic();

export function AssetsArt(props: HTMLAttributes<HTMLDivElement>) {
  const gid = `o3swap${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <Stage<AssetsPose>
      which="assets" rest={ASSETS_REST} still="assets" props={props} pose={assetsPose} vectors={assetsVectors} load={loadAssets}
      under={(k) => (
        <>
          <path className={s.faint} d={ECLIPTIC} />
          <path {...k("constructBack", s.faint)} />
          <path {...k("pathBack", s.orbit)} />
          <path {...k("ticks", s.fine)} />
        </>
      )}
      over={(k) => (
        <>
          <defs>
            {/* the swap is strongest at its two balls */}
            <linearGradient id={gid} gradientUnits="userSpaceOnUse" {...k("archGrad", "")}>
              <stop offset="0" stopColor="var(--color-green-text)" />
              <stop offset="0.5" stopColor="var(--color-green-text)" stopOpacity="0.3" />
              <stop offset="1" stopColor="var(--color-green-text)" />
            </linearGradient>
          </defs>
          <path {...k("constructFront", s.faint)} />
          <path {...k("pathFront", s.orbit)} />
          <path {...k("arch", s.gLine)} style={{ stroke: `url(#${gid})` }} />
          <g {...k("archFrom", "")}><path className={s.gFill} d={circlePath(1.8)} /></g>
          <g {...k("archHead", "")}><path className={s.gFill} d={HEAD} /></g>
          <g {...k("m206", "")}><path className={s.marker} d={circlePath(2.2)} /></g>
          <g {...k("m328", "")}><path className={s.hair} d={STAR} /></g>
          <g {...k("m140", "")}><path className={s.marker} d={SQUARE} /></g>
          <path {...k("apexLeader", s.fine)} />
          <g {...k("apexDot", "")}><path className={s.inkFill} d={circlePath(1.6)} /></g>
        </>
      )}
      labels={<text className={s.label} x={SWAP_TAG[0]} y={SWAP_TAG[1]} textAnchor="middle">Swap</text>}
    />
  );
}
