// Direction A, the Stack's colours (research/dir-a.md §3). Local to the Stack drawing, as the brief allows; every value
// is mixed from the brand tokens (tokens.css) at build time, so the derivation is explicit:
//   SURFACE #F5F4F1, MUTED #5F6669, GREEN #00DC8D, FOREST #0A2018 (spec/DESIGN.md §1)
// Two ramps, each as vertical gradients (light at the drawing's top, deep at its foot, like the ridges fading into mist):
//   sage:  the rings at rest, a desaturated model (surface/muted/forest with a little green)
//   green: the selected layer, the one saturated object on the plate (green into surface on top, into forest on the sides)
const SURFACE = "#f5f4f1", MUTED = "#5f6669", GREEN = "#00dc8d", FOREST = "#0a2018";

function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

export type Ramp = Record<"t" | "l" | "r", [top: string, foot: string]>;

export const RAMPS: Record<"sage" | "green", Ramp> = {
  sage: {
    // tops: surface with 14% green, falling to muted-sage at the foot
    t: [mix(SURFACE, GREEN, 0.14), mix(mix(SURFACE, MUTED, 0.45), GREEN, 0.1)],
    // left faces: muted with 18% green, into forest
    l: [mix(mix(SURFACE, MUTED, 0.7), GREEN, 0.16), mix(MUTED, FOREST, 0.55)],
    // right faces (in shade): muted-forest, into near-forest
    r: [mix(mix(MUTED, FOREST, 0.35), GREEN, 0.12), mix(MUTED, FOREST, 0.82)],
  },
  green: {
    t: [mix(GREEN, SURFACE, 0.42), mix(GREEN, SURFACE, 0.12)],
    l: [GREEN, mix(GREEN, FOREST, 0.42)],
    r: [mix(GREEN, FOREST, 0.28), mix(GREEN, FOREST, 0.68)],
  },
};

// Hairline seams between the beams: forest at 55% over the faces
export const SEAM = "rgb(10 32 24 / 0.55)";
