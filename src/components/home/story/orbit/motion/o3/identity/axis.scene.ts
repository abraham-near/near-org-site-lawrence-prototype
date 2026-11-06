import { add, CAM_POS, curve, px, rad, rotX, seg2, xf, type Attrs, type P2, type V3 } from "../geo";

// Identity option "axis" (D80, lab): one axis through many layers, one account across chains. A stack of thin frosted
// glass plates, evenly spaced on one vertical axis and seen a little from above, and one polished green pin through
// the centre of every plate. Plain numbers here (no three.js), shared by the WebGL scene and the vector layer, so the
// lines land on the plates to the pixel. Static: the pose ignores slide and time.

export const AXIS = {
  n: 9, R: 0.8, gap: 0.215, thick: 0.014, // the plates: how many, their radius, the space between them, their thickness
  tilt: rad(-3), // the stack's frame tipped a little away from the camera: seen 9° from above, each plate a thin ellipse
  x: -0.12, y: 0, // the stack's centre: a little left, so the stack and its scale sit centred together
  pin: 0.032, over: { top: 0.2, bottom: 0.28 }, // the pin's radius, and how far it runs past the top and bottom plates
  scale: 0.3, // the graduated scale, this far outside the rim on the right
  dash: { top: 0.17, bottom: 0.15, gap: 0.05 }, // the axis carried on past the pin as a dashed line
};
export const plateY = (k: number) => (k - (AXIS.n - 1) / 2) * AXIS.gap;
export const TOP = plateY(AXIS.n - 1), BOTTOM = plateY(0);
export const PIN = { top: TOP + AXIS.over.top, bottom: BOTTOM - AXIS.over.bottom };

// The stack's frame → world (three: a group tipped about x, then moved)
export const axisW = (p: V3): V3 => add(rotX(p, AXIS.tilt), [AXIS.x, AXIS.y, 0]);

// World → the stack's frame
export const toFrame = (p: V3): V3 => rotX(add(p, [-AXIS.x, -AXIS.y, 0]), -AXIS.tilt);

// Behind a plate from the camera's eye: the ray from the lens to the point crosses a plate's top face first, inside its
// rim (with a hair of margin, so a line stops just short of the glass's outline)
const CAM_F = rotX(add(CAM_POS, [-AXIS.x, -AXIS.y, 0]), -AXIS.tilt);
export function underGlass(pf: V3, margin = 0.035) {
  for (let k = 0; k < AXIS.n; k++) {
    const yk = plateY(k) + AXIS.thick / 2;
    if (pf[1] >= yk - AXIS.thick) continue;
    const s = (yk - CAM_F[1]) / (pf[1] - CAM_F[1]);
    if (!(s > 0 && s < 1)) continue;
    const x = CAM_F[0] + s * (pf[0] - CAM_F[0]), z = CAM_F[2] + s * (pf[2] - CAM_F[2]);
    if (Math.hypot(x, z) < AXIS.R + margin) return true;
  }
  return false;
}

// The ticked ecliptic: a horizon in the middle plate's plane, left out across the plate (it meets the rim's two ends)
const MID = plateY((AXIS.n - 1) / 2);
export const ECLIPTIC_Y = Math.round(px(axisW([0, MID, 0]))[1] * 10) / 10;
export const ECLIPTIC_GAP = [px(axisW([-AXIS.R, MID, 0]))[0] - 2.5, px(axisW([AXIS.R, MID, 0]))[0] + 2.5] as const;

export type AxisPose = { t: number };
export const axisPose = (): AxisPose => ({ t: 0 });


export function axisVectors(): Record<string, Attrs> {
  const { R, n, scale, dash } = AXIS;
  const xs = R + scale; // the scale's line, in the plates' frame
  const at = (x: number, y: number, z = 0): P2 => px(axisW([x, y, z]));

  // the scale: one leader from each plate's rim out to a vertical line, fine ticks between the plates, the line carried
  // a little past the top and bottom plates
  let leaders = "", ticks = "";
  for (let k = 0; k < n; k++) {
    const y = plateY(k);
    leaders += seg2(at(R + 0.05, y), at(xs + 0.075, y));
    if (k < n - 1) for (let j = 1; j < 5; j++) {
      const yy = y + (AXIS.gap * j) / 5;
      ticks += seg2(at(xs, yy), at(xs + 0.035, yy));
    }
  }
  const line = seg2(at(xs, BOTTOM - AXIS.gap * 0.6), at(xs, TOP + AXIS.gap * 0.6));

  // the axis carried on above and below the pin as a dashed line, never behind the glass
  const up = curve((u) => axisW([0, PIN.top + dash.gap + u * dash.top, 0]), 30);
  const down = curve((u) => axisW([0, PIN.bottom - dash.gap - u * dash.bottom, 0]), 30, (p) => !underGlass(toFrame(p)));
  const upEnd = at(0, PIN.top + dash.gap + dash.top), downEnd = at(0, PIN.bottom - dash.gap - dash.bottom);

  return {
    leaders: { d: leaders },
    ticks: { d: ticks },
    scaleLine: { d: line },
    scaleTop: { transform: xf(at(xs, TOP + AXIS.gap * 0.6)) },
    scaleBottom: { transform: xf(at(xs, BOTTOM - AXIS.gap * 0.6)) },
    axisUp: { d: up },
    axisDown: { d: down },
    axisTop: { transform: xf(upEnd) },
    axisBottom: { transform: xf(downEnd) },
  };
}
export const AXIS_REST = axisVectors();
