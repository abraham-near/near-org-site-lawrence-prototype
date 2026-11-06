"use client";

import { useId, type HTMLAttributes } from "react";
import s from "../../../orbit.module.css";
import { circlePath, SQUARE, STAR } from "../geo";
import { Stage } from "../index";
import { bezelEcliptic, bezelPose, bezelVectors, type BezelPose } from "./bezel.scene";

// Identity option "bezel" (D80, lab): a watchmaker's piece turned exactly one click. Static: the pose ignores slide
// and time. The scene is in bezel.gl.ts (loaded on the client only), its numbers and vectors in bezel.scene.ts.
export const name = "The bezel";
export const note =
  "A machined piece in a gentle three-quarter: a thin frosted glass bezel with fine chrome graduations and a fluted polished edge, blurring the chrome rings behind it, round a turned chrome hub set with a small green jewel, the account. The bezel sits exactly one click past the fixed index on its case: the same account, after a single rotation to new keys.";

const REST = bezelVectors(bezelPose());
const ECLIPTIC = bezelEcliptic();
const load = () => import("./bezel.gl").then((g) => g.bezelView);

export function Art(props: HTMLAttributes<HTMLDivElement>) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const step = `idBezelStep${id}`, read = `idBezelRead${id}`;
  return (
    <Stage<BezelPose>
      which="identity" rest={REST} still="identity-bezel" props={props} pose={bezelPose} vectors={bezelVectors} load={load}
      under={() => <path className={s.faint} d={ECLIPTIC} />}
      over={(k) => (
        <>
          <defs>
            {/* the step joins the index to the zero: strongest at both */}
            <linearGradient id={step} gradientUnits="userSpaceOnUse" {...k("stepGrad", "")}>
              <stop offset="0" stopColor="var(--color-ink)" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="var(--color-ink)" stopOpacity="0.35" />
              <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0.9" />
            </linearGradient>
            {/* the index's reading: faint at the case, strongest at its dot */}
            <linearGradient id={read} gradientUnits="userSpaceOnUse" {...k("idxGrad", "")}>
              <stop offset="0" stopColor="var(--color-ink)" stopOpacity="0.25" />
              <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path {...k("ring", s.faint)} />
          <path {...k("scaleArc", s.faint)} />
          <path {...k("scale", s.fine)} />
          <path {...k("stepTicks", s.fine)} />
          <path {...k("stepArc", s.hair)} style={{ stroke: `url(#${step})` }} />
          <g {...k("zeroDot", "")}><path className={s.inkFill} d={circlePath(1.4)} /></g>
          <path {...k("zeroLine", s.dash)} />
          <path {...k("idxLine", s.hair)} style={{ stroke: `url(#${read})` }} />
          <g {...k("idxDot", "")}><path className={s.inkFill} d={circlePath(1.6)} /></g>
          <g {...k("mk0", "")}><path className={s.marker} d={circlePath(2.2)} /></g>
          <g {...k("mk1", "")}><path className={s.hair} d={STAR} /></g>
          <g {...k("mk2", "")}><path className={s.marker} d={SQUARE} /></g>
        </>
      )}
      labels={null}
    />
  );
}
