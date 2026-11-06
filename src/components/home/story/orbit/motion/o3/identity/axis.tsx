"use client";

import type { HTMLAttributes } from "react";
import s from "../../../orbit.module.css";
import { circlePath, SQUARE } from "../geo";
import { Stage, type K } from "../index";
import { AXIS_REST, axisPose, axisVectors, ECLIPTIC_GAP, ECLIPTIC_Y, type AxisPose } from "./axis.scene";

// Identity option "axis" (D80, lab): one axis through many layers. Static: the pose ignores slide and time.
export const name = "One axis";
export const note =
  "A stack of thin frosted glass plates, each with a fine chrome bevel, threaded on one polished green pin that runs straight through all of them, soft behind the glass and sharp where it comes out. One account, the same axis through every chain it works on, with a fine graduated scale marking each layer.";

const load = () => import("./axis.gl").then((g) => g.axisView);

// the ticked horizon, left out where it passes behind the stack
function ecliptic(y: number, gap?: readonly [number, number]) {
  const yy = y.toFixed(2);
  let d = gap ? `M8 ${yy}H${gap[0].toFixed(2)}M${gap[1].toFixed(2)} ${yy}H412` : `M8 ${yy}H412`;
  for (let x = 8, i = 0; x <= 412; x += 6, i++) if (!gap || x < gap[0] || x > gap[1]) d += `M${x} ${yy}v${i % 5 === 0 ? -4.5 : -2}`;
  return d;
}
const ECLIPTIC = ecliptic(ECLIPTIC_Y, ECLIPTIC_GAP);

export function Art(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <Stage<AxisPose>
      which="identity" rest={AXIS_REST} still="identity-axis" props={props} pose={axisPose} vectors={axisVectors} load={load}
      under={() => <path className={s.faint} d={ECLIPTIC} />}
      over={(k: K) => (
        <>
          <path {...k("scaleLine", s.fine)} />
          <path {...k("ticks", s.faint)} />
          <path {...k("leaders", s.fine)} />
          <g {...k("scaleTop", "")}><path className={s.marker} d={circlePath(1.8)} /></g>
          <g {...k("scaleBottom", "")}><path className={s.inkFill} d={circlePath(1.4)} /></g>
          <path {...k("axisUp", s.dash)} />
          <path {...k("axisDown", s.dash)} />
          <g {...k("axisTop", "")}><path className={s.marker} d={circlePath(2.2)} /></g>
          <g {...k("axisBottom", "")}><path className={s.marker} d={SQUARE} /></g>
        </>
      )}
      labels={null}
    />
  );
}
