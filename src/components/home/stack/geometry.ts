// Isometric geometry for the Stack drawing (concept 2C, D7). Pure functions, run on the server, so the drawing
// ships as plain SVG: unit boxes on a grid, three visible faces each, painted back to front.

export type Layer = "protocol" | "intents" | "ai" | "com";
export type Face = { kind: "t" | "l" | "r"; points: string };
export type Cube = { key: string; layer: Layer; faces: Face[] };

const C = Math.cos(Math.PI / 6);
export const S = 20; // cell size
export const PILLAR_TOP = 6;

const proj = (x: number, y: number, z: number) => [(x - y) * C * S, (x + y) * 0.5 * S - z * S] as const;
const fmt = (pts: readonly (readonly [number, number])[]) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

type Box = { i: number; j: number; z: number; layer: Layer };

// The Protocol core is K×K cells (3×3 gives the official N room to read), centred on (CC, CC).
const K = 3, CC = (K - 1) / 2;

// Square ring around the core: cells at Chebyshev distance D from the centre, minus gap cells ("i,j").
function ring(D: number, z: number, layer: Layer, gaps: string[]): Box[] {
  const out: Box[] = [];
  for (let i = Math.floor(CC - D); i <= Math.ceil(CC + D); i++) for (let j = Math.floor(CC - D); j <= Math.ceil(CC + D); j++) {
    if (Math.max(Math.abs(i - CC), Math.abs(j - CC)) !== D || gaps.includes(`${i},${j}`)) continue;
    out.push({ i, j, z, layer });
  }
  return out;
}

function boxes(): Box[] {
  const pillar: Box[] = [];
  for (let z = -2; z < PILLAR_TOP; z++) for (let i = 0; i < K; i++) for (let j = 0; j < K; j++) pillar.push({ i, j, z, layer: "protocol" });
  return [
    ...pillar,                                    // Protocol: a 3×3 pillar, rooted below the rings
    ...ring(3, 2, "intents", ["4,1", "4,2"]),     // rings step down outwards, one cell apart, each with one opening
    ...ring(5, 1, "ai", ["0,6", "1,6", "2,6"]),
    ...ring(7, 0, "com", ["8,-2", "8,-1", "8,0"]),
  ];
}

export function buildStack(extraTop = 56) {
  const sorted = boxes().sort((a, b) => a.i + a.j - (b.i + b.j) || a.z - b.z); // unit-grid painter's order
  const all: number[][] = [];
  const cubes: Cube[] = sorted.map((b) => {
    const x0 = b.i - 0.5, x1 = b.i + 0.5, y0 = b.j - 0.5, y1 = b.j + 0.5, z0 = b.z, z1 = b.z + 1;
    const faces: Record<Face["kind"], (readonly [number, number])[]> = {
      l: [proj(x0, y1, z0), proj(x1, y1, z0), proj(x1, y1, z1), proj(x0, y1, z1)],
      r: [proj(x1, y0, z0), proj(x1, y1, z0), proj(x1, y1, z1), proj(x1, y0, z1)],
      t: [proj(x0, y0, z1), proj(x1, y0, z1), proj(x1, y1, z1), proj(x0, y1, z1)],
    };
    Object.values(faces).forEach((f) => all.push(...f.map((p) => [...p])));
    return { key: `${b.layer}-${b.i}-${b.j}-${b.z}`, layer: b.layer, faces: (["l", "r", "t"] as const).map((k) => ({ kind: k, points: fmt(faces[k]) })) };
  });
  const pad = 12;
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad - extraTop;
  const width = Math.max(...xs) - minX + pad, height = Math.max(...ys) - minY + pad;

  // The official N mark lies flat on the pillar top (an affine map of the unit square onto the top face).
  const inset = 0.08, size = K;
  const o = proj(CC - size / 2 + inset, CC - size / 2 + inset, PILLAR_TOP);
  const ex = proj(size - 2 * inset, 0, 0), ey = proj(0, size - 2 * inset, 0);
  const markTransform = `matrix(${ex[0].toFixed(3)},${ex[1].toFixed(3)},${ey[0].toFixed(3)},${ey[1].toFixed(3)},${o[0].toFixed(2)},${o[1].toFixed(2)})`;

  // The Chapter 1 thread lands on the pillar top's back tip (same x as its centre), leaving the N mark clear.
  const [tx, ty] = proj(CC - K / 2, CC - K / 2, PILLAR_TOP);

  return { cubes, viewBox: `${minX.toFixed(1)} ${minY.toFixed(1)} ${width.toFixed(1)} ${height.toFixed(1)}`, minY, height, markTransform, thread: { x: tx, y1: minY, y2: ty } };
}
