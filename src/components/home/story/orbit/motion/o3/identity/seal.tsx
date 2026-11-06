"use client";

import { useId, type HTMLAttributes } from "react";
import s from "../../../orbit.module.css";
import { circlePath, SQUARE } from "../geo";
import { Stage } from "../index";
import { SEAL_GAP, SEAL_HORIZON, sealPose, sealVectors, type SealPose } from "./seal.scene";

// Identity option "seal" (D80, lab): the seal and its impression. Static: the pose ignores slide and time.
export const name = "The seal";
export const note =
  "A polished chrome seal, lathe-turned with a fine bevel and grip grooves, hovers tipped over a thin frosted glass disc, and in the glass beneath it lies its impression: the same engine-turned rosette and irregular ring of notches, mirrored and inlaid in green metal. It says your account is one exact mark that only you can make, and it reads the same wherever it is pressed.";

const REST = sealVectors();
const load = () => import("./seal.gl").then((g) => g.sealView);

// the ticked horizon, left out where it passes behind the glass
const ECLIPTIC = (() => {
  const y = SEAL_HORIZON.toFixed(2), [g0, g1] = SEAL_GAP;
  let d = `M8 ${y}H${g0.toFixed(2)}M${g1.toFixed(2)} ${y}H412`;
  for (let x = 8, i = 0; x <= 412; x += 6, i++) if (x < g0 || x > g1) d += `M${x} ${y}v${i % 5 === 0 ? -4.5 : -2}`;
  return d;
})();

export function Art(props: HTMLAttributes<HTMLDivElement>) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const axis = `sealAxis${id}`;
  return (
    <Stage<SealPose>
      which="identity" rest={REST} still="identity-seal" props={props} pose={sealPose} vectors={sealVectors} load={load}
      under={(k) => (
        <>
          <path className={s.faint} d={ECLIPTIC} />
          <path {...k("orbitBack", s.orbit)} />
        </>
      )}
      over={(k) => (
        <>
          <defs>
            {/* the registration axis joins the seal to its mark: strongest at both ends */}
            <linearGradient id={axis} gradientUnits="userSpaceOnUse" {...k("axisGrad", "")}>
              <stop offset="0" stopColor="var(--color-ink)" stopOpacity="0.85" />
              <stop offset="0.5" stopColor="var(--color-ink)" stopOpacity="0.25" />
              <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path {...k("orbitFront", s.orbit)} />
          <path {...k("rimArc", s.faint)} />
          <path {...k("rimTicks", s.fine)} />
          <path {...k("marks", s.hair)} />
          <path {...k("axis", s.dash)} style={{ stroke: `url(#${axis})` }} />
          <g {...k("axisTop", "")}><path className={s.inkFill} d={circlePath(1.4)} /></g>
          <g {...k("m0", "")}><path className={s.marker} d={circlePath(2.2)} /></g>
          <g {...k("m1", "")}><path className={s.marker} d={SQUARE} /></g>
        </>
      )}
      labels={null}
    />
  );
}
