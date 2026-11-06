import * as gimbal from "./gimbal";
import * as bezel from "./bezel";
import * as seal from "./seal";
import * as refined from "./refined";

// Static options for the identity station (D80, lab): each in the style of the three animated stations (real-time 3D,
// frosted glass, chrome, one green part, Orbit's vector layer), at rest, to choose from before it is animated. Each file
// exports `name`, `note` and `Art`. Shown on /lab/identity beside today's Orbit drawing. The fifth option built, one
// axis through many layers (`axis.*`), is off the page: the critic read it as a CD spindle or database icon.
export const IDENTITY_OPTIONS = [
  { key: "a", ...gimbal },
  { key: "b", ...bezel },
  { key: "c", ...seal },
  { key: "d", ...refined },
] as const;
