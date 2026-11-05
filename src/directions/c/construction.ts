// Direction C, "Field": the shape system, measured from the N's construction (public/brand/icon.svg, viewBox 639).
// The mark itself is never redrawn: these are its angles and proportions, used as abstract geometry (a diagonal band,
// a vertical stem, a hatched plane, a crop). Never assemble two stems and a diagonal into an N.
//
//   The diagonal: the stroke from the top of the left stem to the foot of the right one, `l218.28,261.37`
//                 → 50.13° from the horizontal, so it runs 0.8351 across for every 1 down.
//   The hooks:    the short counter-strokes at the top right and bottom left, `l-73.37,108.93` → 56.04°.
//   The stems:    about 75 of the 351-unit square (0.214 of the side).
export const N_ANGLE = 50.13;
export const N_RUN = 0.8351; // horizontal run per unit of drop along the diagonal (1 / tan 50.13°)
export const N_SKEW = 90 - N_ANGLE; // skewX that turns a rectangle's sides into the diagonal (39.87°)
export const HOOK_ANGLE = 56.04;
export const STEM = 0.214;

const RAD = (N_ANGLE * Math.PI) / 180;
// A displacement of `d` along the diagonal (down and to the right for positive d)
export const along = (d: number) => ({ x: d * Math.cos(RAD), y: d * Math.sin(RAD) });

// A deterministic pseudo-random sequence (drawings must render the same on the server and the client)
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
