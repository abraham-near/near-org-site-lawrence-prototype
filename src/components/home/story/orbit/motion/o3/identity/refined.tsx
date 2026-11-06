"use client";

import type { HTMLAttributes } from "react";
import s from "../../../orbit.module.css";
import { circlePath, HEAD, SQUARE, STAR } from "../geo";
import { Stage, type K } from "../index";
import { REFINED_HORIZON, refinedPose, refinedVectors, type RefinedPose } from "./refined.scene";

// Identity option E, "refined" (D80, lab): today's idea rebuilt in the shared studio. The slim machined green ring (the
// new keys) floats over the frosted disc; its ghost at the old tilt and a graduated protractor measure the one
// rotation between them; the account's wide orbit runs round both. Static: the pose ignores slide and time.
export const name = "One rotation";
export const note =
  "A machined green ring, knurled with one index notch, floats over a frosted glass disc, with a hairline ghost of the same ring at its old, steeper tilt and a graduated protractor measuring the turn between them, inside the account’s wide orbit. The account stays one object while its keys move to a new plane in a single, measured rotation.";

const REST = refinedVectors(refinedPose());
const load = () => import("./refined.gl").then((g) => g.refinedView);
const pose = () => refinedPose();

// the ticked horizon at the disc's centre, left out where it passes behind the glass
const HORIZON = (() => {
  const { y, gap } = REFINED_HORIZON, yy = y.toFixed(2);
  let d = `M8 ${yy}H${gap[0].toFixed(2)}M${gap[1].toFixed(2)} ${yy}H412`;
  for (let x = 8, i = 0; x <= 412; x += 6, i++) if (x < gap[0] || x > gap[1]) d += `M${x} ${yy}v${i % 5 === 0 ? -4.5 : -2}`;
  return d;
})();

// the account's points on its wide orbit: ink dots, and a cross and a square among them
const MARK = [
  [s.inkFill, circlePath(1.4)], [s.inkFill, circlePath(1.4)], [s.hair, STAR],
  [s.inkFill, circlePath(1.4)], [s.marker, SQUARE], [s.inkFill, circlePath(1.4)],
] as const;
const dots = (k: K) => MARK.map(([cls, d], i) => <g key={i} {...k(`dot${i}`, "")}><path className={cls} d={d} /></g>);

export function Art(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <Stage<RefinedPose>
      which="identity" rest={REST} still="identity-refined" props={props} pose={pose} vectors={refinedVectors} load={load}
      under={(k) => (
        <>
          <path className={s.faint} d={HORIZON} />
          <path {...k("wideBack", s.orbit)} />
        </>
      )}
      over={(k) => (
        <>
          <path {...k("wideFront", s.orbit)} />
          <path {...k("wideTicks", s.fine)} />
          {dots(k)}
          <path {...k("rim", s.fine)} />
          <path {...k("rimArc", s.faint)} />
          <path {...k("ghost", s.ghost)} />
          <path {...k("rays", s.dash)} />
          <path {...k("protArc", s.faint)} />
          <path {...k("protTicks", s.fine)} />
          <path {...k("sweep", s.hair)} />
          <g {...k("head", "")}><path className={s.inkFill} d={HEAD} /></g>
          <g {...k("oldTop", "")}><path className={s.marker} d={circlePath(1.8)} /></g>
        </>
      )}
      labels={null}
    />
  );
}
