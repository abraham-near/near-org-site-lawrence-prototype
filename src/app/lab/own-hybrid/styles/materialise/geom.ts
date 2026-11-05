// Materialise (D54): the technical drawing of each render, registered to it. Every coordinate here is in the render's
// own pixels (the trimmed PNG, `w` × `h`), measured on the render at full size; the Art places the drawing and the
// render with the same transform, so the drawn edges land on the real ones.
// lines: visible edges · hidden: edges behind (dashed) · axis: centre lines (dash-dot) · hatch: section hatching ·
// fine: micro detail (flutes, ribs, engraving)

export type Drawing = { w: number; h: number; lines: string; hidden: string; axis: string; hatch: string; fine: string };

const n = (v: number) => Math.round(v * 10) / 10;
// An ellipse as a path (two arcs), optionally rotated (degrees) about its centre
export const ell = (cx: number, cy: number, rx: number, ry: number, rot = 0) => {
  const a = (rot * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const x0 = cx - rx * c, y0 = cy - rx * s, x1 = cx + rx * c, y1 = cy + rx * s;
  return `M${n(x0)} ${n(y0)}A${rx} ${ry} ${rot} 1 0 ${n(x1)} ${n(y1)}A${rx} ${ry} ${rot} 1 0 ${n(x0)} ${n(y0)}`;
};
// Half an ellipse: the lower (front) half or the upper (back) half, unrotated
export const half = (cx: number, cy: number, rx: number, ry: number, lower: boolean) =>
  `M${n(cx - rx)} ${n(cy)}A${rx} ${ry} 0 0 ${lower ? 0 : 1} ${n(cx + rx)} ${n(cy)}`;
const seg = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${n(x)} ${n(y)}`).join("");

// ── Data: an upright satin-frosted reeded pane with a steel top strip, in a green rail (962 × 1307) ──
const top = (x: number) => 7 + 0.2739 * (x - 40); // the pane's back top edge
const front = (x: number) => 22 + 0.2738 * (x - 15); // the front edge of the steel top strip
const slot = (x: number) => 874 + 0.378 * (x - 15); // where the glass enters the rail
const FLUTES = [32, 74, 114, 153, 193, 234, 275, 318, 361, 403, 448, 492, 537, 582, 629, 675, 723, 771, 819, 869];
export const DATA: Drawing = {
  w: 962,
  h: 1307,
  lines:
    seg([[15, 876], [15, 16], [22, top(22)], [933, top(933)], [933, 1200]]) +
    seg([[15, front(15)], [906, front(906)], [933, top(933) + 2]]) +
    seg([[906, front(906)], [906, slot(906)]]) +
    seg([[8, 880], [900, 1222], [950, 1203], [952, 1265], [900, 1292], [10, 945], [8, 880]]) +
    seg([[900, 1222], [900, 1292]]) +
    seg([[8, 880], [24, 872]]),
  hidden: seg([[24, 872], [24, 932], [952, 1265]]) + seg([[15, 910], [906, slot(906) + 34]]),
  axis: "",
  hatch: Array.from({ length: 34 }, (_, i) => {
    const x = 20 + i * 14;
    return seg([[x, front(x) - 1], [x + 12, top(x + 12) + 1]]);
  }).join(""),
  fine: FLUTES.map((x) => `M${x} ${n(front(x) + 2)}V${n(slot(x))}`).join(""),
};

// ── Assets: a clear glass tray holding two coins (1855 × 989) ──
const A = [25, 352], B = [388, 14], C = [1812, 386], D = [1446, 768];
const dn = 160; // the tray's height
const COIN_S = { cx: 573, cy: 331, rx: 259, ry: 142, t: 55 };
const COIN_G = { cx: 1189, cy: 487, rx: 259, ry: 146, t: 57 };
const coin = (c: typeof COIN_S) =>
  ell(c.cx, c.cy, c.rx, c.ry) + half(c.cx, c.cy + c.t, c.rx, c.ry, true) + `M${c.cx - c.rx} ${c.cy}v${c.t}M${c.cx + c.rx} ${c.cy}v${c.t}`;
const coinAxis = (c: typeof COIN_S) => `M${c.cx - c.rx - 40} ${c.cy}H${c.cx + c.rx + 40}M${c.cx} ${c.cy - c.ry - 30}V${c.cy + c.ry + c.t + 20}`;
export const ASSETS: Drawing = {
  w: 1855,
  h: 989,
  lines:
    seg([[A[0], A[1]], [B[0], B[1]], [C[0], C[1]], [D[0], D[1]], [A[0], A[1]]]) +
    seg([[A[0], A[1]], [A[0], A[1] + dn], [D[0] + 4, D[1] + dn + 9], [C[0] - 2, C[1] + dn], [C[0], C[1]]]) +
    seg([[D[0], D[1]], [D[0] + 4, D[1] + dn + 9]]) +
    seg([[75, 366], [398, 62], [1760, 398], [1440, 722], [75, 366]]) +
    coin(COIN_S) + coin(COIN_G),
  hidden: seg([[A[0], A[1] + dn], [B[0], B[1] + dn], [C[0] - 2, C[1] + dn]]) + seg([[B[0], B[1]], [B[0], B[1] + dn]]),
  axis: coinAxis(COIN_S) + coinAxis(COIN_G),
  hatch: Array.from({ length: 16 }, (_, i) => {
    const y = A[1] + 10 + i * 9;
    return seg([[A[0] + 2, y], [A[0] + 46, y - 30]]);
  }).join(""),
  fine: [40, 80, 120, 160, 200, 240].map((r) => ell(COIN_S.cx, COIN_S.cy, r, (r * COIN_S.ry) / COIN_S.rx)).join(""),
};
export const COINS = { s: COIN_S, g: COIN_G };

// ── Intelligence: a crystal cube sealing a ribbed steel core with a green cap (1095 × 1337) ──
const CB = [562, 30], CL = [30, 260], CR = [1048, 290], CF = [515, 525];
const ch = 700; // the cube's height on its left edge
const CORE = { cx: 538, top: 295, rx: 207, ry: 105, body: 228, bottom: 1080 };
export const INTEL: Drawing = {
  w: 1095,
  h: 1337,
  lines:
    seg([[CB[0], CB[1]], [CR[0], CR[1]], [CF[0], CF[1]], [CL[0], CL[1]], [CB[0], CB[1]]]) +
    seg([[CL[0], CL[1]], [CL[0] + 5, CL[1] + ch], [518, 1258], [CR[0], CR[1] + ch]]) +
    seg([[CR[0], CR[1]], [CR[0], CR[1] + ch]]) +
    seg([[CF[0], CF[1]], [518, 1258]]) +
    ell(CORE.cx, CORE.top, CORE.rx, CORE.ry) +
    `M${CORE.cx - CORE.body} ${CORE.top + 120}V${CORE.bottom - 60}M${CORE.cx + CORE.body} ${CORE.top + 120}V${CORE.bottom - 60}` +
    half(CORE.cx, CORE.bottom - 60, CORE.body, 110, true),
  hidden: seg([[CL[0] + 5, CL[1] + ch], [560, 740], [CR[0], CR[1] + ch]]) + seg([[CB[0], CB[1]], [560, 740]]),
  axis: `M${CORE.cx} ${CORE.top - 160}V${CORE.bottom + 140}`,
  // surface shading on the cube's left face: verticals that close up towards the edge
  hatch: [40, 47, 56, 67, 81, 99, 122].map((x) => `M${x} ${n(260 + 0.546 * (x - 30) + 6)}V${n(960 + 0.617 * (x - 35) - 6)}`).join(""),
  fine: Array.from({ length: 40 }, (_, i) => half(CORE.cx, 432 + i * 13.6, CORE.body, 100, true)).join(""),
};
export { CORE };

// ── Identity: a thick flat ring with chamfered edges (1608 × 1173) ──
export const RING = { cx: 807, cy: 438, rx: 585, ry: 360, t: 146, crx: 568, cry: 338, ccy: 434, irx: 383, iry: 236, icy: 416 };
const R = RING;
const boreBack = (() => {
  const pts: string[] = [];
  let on = false;
  for (let i = 0; i <= 120; i++) {
    const a = Math.PI + (i / 120) * Math.PI; // the back (upper) half, left to right
    const x = R.cx + R.irx * Math.cos(a), y = R.icy + R.t + R.iry * Math.sin(a);
    const inside = ((x - R.cx) / R.irx) ** 2 + ((y - R.icy) / R.iry) ** 2 < 1;
    if (inside) { pts.push(`${on ? "L" : "M"}${n(x)} ${n(y)}`); on = true; } else on = false;
  }
  return pts.join("");
})();
export const IDENT: Drawing = {
  w: 1608,
  h: 1173,
  lines:
    ell(R.cx, R.cy, R.rx, R.ry) + ell(R.cx, R.ccy, R.crx, R.cry) + ell(R.cx, R.icy, R.irx, R.iry) +
    half(R.cx, R.cy + R.t, R.rx, R.ry, true) + `M${R.cx - R.rx} ${R.cy}v${R.t}M${R.cx + R.rx} ${R.cy}v${R.t}` + boreBack,
  hidden: half(R.cx, R.icy + R.t, R.irx, R.iry, true) + half(R.cx, R.cy + R.t, R.rx, R.ry, false),
  axis: `M${R.cx - R.rx - 70} ${R.cy}H${R.cx + R.rx + 70}M${R.cx} ${R.cy - R.ry - 60}V${R.cy + R.ry + R.t + 60}`,
  hatch: "",
  fine: "",
};
