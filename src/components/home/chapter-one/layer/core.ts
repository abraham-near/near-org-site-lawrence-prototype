import TRACKS from "./tracks.json";

// Shared by the hero layer's looks (HeroLayer.tsx, dust.ts, signal.ts): the tracking data's shape, where a track sits
// at a frame, and the batched, token-coloured ink they draw with.

export const FPS = 24, VW = 1920, VH = 1080;
// fg: a point from the reverse track of the near trees (D63)
export type Track = { from: number; pts: number[]; lum?: number[]; fg?: number };
export type Data = { frames: number; step: number };
export type Pt = { x: number; y: number; a: number };
// f: the video frame on screen (the scroll's); t: seconds of ambient time for the plexus looks (D43), 0 when ambient
// motion is off (reduced motion)
// rest: 0-1, how far A4s has eased to its settled state (every line whole, every dot full size); 0 otherwise
// copy: the headline block's box in the layer's coordinates (x, y, w, h), for the looks that keep clear of it
// themselves (D49) rather than fading out across the left of the picture; thread: the green thread's x, where it shows
export type Ctx = {
  host: HTMLElement; W: number; H: number; f: number; t: number; rest: number;
  map: (nx: number, ny: number) => [number, number]; copy: [number, number, number, number] | null; thread: number | null;
};
export type Look = { draw: (c: Ctx) => void; resize?: (c: Ctx) => void };
// sky: the upper scene's displacement through the move (every `step` frames, x 10000); air: untracked points in the
// sky and mist, at their frame-0 place (x, y x 10000; l: ground brightness 0-99); links: index pairs into points
export type Plex = Data & {
  points: Track[]; chains: { len0: number[]; tracks: Track[] }[]; keys: Track[];
  sky: number[]; air: { x: number; y: number; l: number; lum: number[] }[]; links: number[][];
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };
// A stable pseudo-random 0-1 per (id, k)
export const rand = (i: number, k: number) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };

// A track's video-normalised position at frame f, interpolated between samples; null outside its span
export function sample(t: Track, f: number, step = TRACKS.step): [number, number] | null {
  const k = (f - t.from) / step, n = t.pts.length / 2;
  if (k < 0 || k > n - 1) return null;
  const i = Math.min(Math.floor(k), n - 2), u = k - i;
  const p = t.pts;
  return [(p[2 * i] + (p[2 * i + 2] - p[2 * i]) * u) / 1e4, (p[2 * i + 1] + (p[2 * i + 3] - p[2 * i + 1]) * u) / 1e4];
}

// The ground's brightness (0-1) under a track at frame f, where the data carries it (plexus.json, measured offline)
export function groundAt(t: Track, f: number, step: number) {
  if (!t.lum) return 0.5;
  const k = clamp((f - t.from) / step, 0, t.lum.length - 1), i = Math.min(Math.floor(k), t.lum.length - 2);
  return i < 0 ? t.lum[0] / 99 : (t.lum[i] + (t.lum[i + 1] - t.lum[i]) * (k - i)) / 99;
}

// On screen, faded near the ends of its span and the frame's edges
export function point(t: Track, c: Ctx, data: Data = TRACKS): Pt | null {
  const s = sample(t, c.f, data.step);
  if (!s) return null;
  const [x, y] = c.map(s[0], s[1]);
  const n = t.pts.length / 2, end = t.from + (n - 1) * data.step;
  // A track that starts on the first frame (or ends on the last) is simply there: no fade at that end
  const fin = t.from === 0 ? 1 : clamp((c.f - t.from) / 6), fout = end >= data.frames - 1 - data.step ? 1 : clamp((end - c.f) / 6);
  const a = Math.min(fin, fout, clamp(y / 40), clamp((c.H - y) / 40), clamp((c.W - x) / 40));
  return a > 0 ? { x, y, a } : null;
}

// How clear of the headline block a point is (D49): 0 inside it (grown by `pad`), rising to 1 over `soft` px beyond
export function clearOfCopy(c: Ctx, x: number, y: number, pad = 28, soft = 90) {
  if (!c.copy) return 1;
  const [cx, cy, cw, ch] = c.copy;
  const dx = Math.max(cx - pad - x, 0, x - (cx + cw + pad)), dy = Math.max(cy - pad - y, 0, y - (cy + ch + pad));
  return smooth(Math.hypot(dx, dy) / soft);
}

// Composition (D50): how much the layer should carry at a point on screen, 0-1. After the phi grid (power lines at
// 38% and 62% of the frame) and the golden spiral (the eye's path ends at its tight curl): the headline is the heavy
// mass on the left, balanced by open space beside it and one focus of detail on the right: your node, which sits by
// the right-hand phi line as the ridges lead up to it, held within the phi region (55-75% across, 30-50% down), so
// the focus stays in the picture as the node rises out of it with the camera (the right-hand upper phi point, 62%,
// 38%, where the node is not known). The layer is nearly gone left of 30% (8%), builds to full by 70%, and is strongest
// around the focus (a soft ellipse), about a third as strong far from it. D51: the spiral's wide arc sweeps through
// the bottom left before it curls in to the focus, so the bottom left (below the headline) carries a secondary band of
// detail, a little under half the focus's strength ("30% stronger towards the bottom left").
// D58 ("the graphic effect overall can be stronger"; "more visible details in the bottom left"; "closer to that level in
// some other isolated areas"): the left keeps a fifth of the layer (not 8%), the field away from the focus half (not a
// third), the bottom-left band three quarters, and `pockets` (points on screen, from the plexus) add small isolated
// clusters at full strength, each a soft disc about 6% of the frame's width across. D59 ("remove about 20% of the new
// elements"): the left keeps 16% and the field away from the focus 44%.
export const PHI = 0.618;
// a pocket may carry a third value, its strength (0-1; D61's foreground clusters fade in as the trees enter)
export function composition(c: Ctx, x: number, y: number, focus: [number, number] | null = null, pockets: number[][] = []) {
  const u = x / c.W, v = y / c.H;
  const [fu, fv] = focus ? [clamp(focus[0] / c.W, 0.55, 0.75), clamp(focus[1] / c.H, 0.3, 0.5)] : [PHI, 1 - PHI];
  const left = 0.16 + 0.84 * smooth((u - 0.28) / 0.4);
  const near = Math.exp(-(((u - fu) / 0.2) ** 2 + ((v - fv) / 0.22) ** 2) / 2);
  const sweep = 0.75 * smooth((v - 0.5) / 0.2) * smooth((0.75 - u) / 0.22);
  let pocket = 0;
  const sd = 0.06 * c.W;
  for (const [px, py, pw = 1] of pockets) pocket = Math.max(pocket, pw * Math.exp(-((x - px) ** 2 + (y - py) ** 2) / (2 * sd * sd)));
  return Math.max(left * (0.44 + 0.56 * near), sweep, pocket);
}

// The bottom left (D59: "should not be so opaque… mixed into the background progressively as we move to the left and
// up in that area"): a strength factor, 1 everywhere else; inside the area (left of about 45%, below about 55%) it falls
// from three quarters at the area's lower right to a fifth at its left and upper edges
export function cornerFade(c: Ctx, x: number, y: number) {
  const u = x / c.W, v = y / c.H;
  // only while the picture is wide (the hero): once it narrows into the column at the end of the move (D62) its lower
  // left is no longer the screen's bottom-left corner, and the trees there should carry their detail
  const wide = smooth((c.W / c.H - 1) / 0.4);
  const inside = wide * smooth((0.5 - u) / 0.12) * smooth((v - 0.52) / 0.1);
  const fade = 0.2 + 0.55 * smooth(u / 0.42) * smooth((v - 0.58) / 0.34);
  return 1 - inside * (1 - fade);
}

// Batched, token-coloured ink: every stroke or fill goes into a path per shade, alpha step and width, so a frame is a
// few dozen draw calls instead of hundreds. The shade follows the ground's brightness under a mark (measured offline,
// so nothing is read back from the video): `pale` over pale mist, `mid` over the mid-tones, `dark` over the dark
// forest, pre-mixed into 13 steps from the three colour tokens (deep green, NEAR green, white).
export type Batch = Map<string, Path2D>;
export type Palette = { pale: [number, number]; mid: [number, number]; dark: [number, number] };
// Each stop as [NEAR green's share mixed into deep green, then white's share]
export const A4_PALETTE: Palette = { pale: [0, 0], mid: [0.35, 0], dark: [0.35, 1] };
export function makeInk(g: CanvasRenderingContext2D, palette: Palette = A4_PALETTE) {
  const css = getComputedStyle(document.documentElement);
  const tok = (n: string) => css.getPropertyValue(n).trim();
  const GREEN = tok("--color-green");
  const rgb = (v: string) => {
    if (v.startsWith("#")) { const h = v.length === 4 ? v.replace(/(\w)/g, "$1$1").slice(1) : v.slice(1); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
    return (v.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number);
  };
  const mixc = (a: number[], b: number[], u: number) => a.map((v, i) => v + (b[i] - v) * u);
  const deep = rgb(tok("--color-green-text")), green = rgb(GREEN), white = rgb(tok("--color-on-dark"));
  const stop = ([gs, ws]: [number, number]) => mixc(mixc(deep, green, gs), white, ws);
  const [p0, p1, p2] = [stop(palette.pale), stop(palette.mid), stop(palette.dark)];
  const SHADES = Array.from({ length: 13 }, (_, n) => {
    const pos = n / 12, c = pos < 0.5 ? mixc(p0, p1, pos * 2) : mixc(p1, p2, (pos - 0.5) * 2);
    return `rgb(${c.map((v) => Math.round(v)).join(",")})`;
  });
  // Alpha steps: 1/32 up to 0.7, so a fading line fades rather than steps; 1/8 above
  const quant = (a: number) => (a < 0.7 ? Math.round(a * 32) / 32 : Math.round(clamp(a) * 8) / 8);
  const add = (b: Batch, colour: string, a: number, width: number) => {
    const s = quant(a);
    if (s === 0) return null;
    const id = `${colour}|${s}|${width}`;
    let p = b.get(id);
    if (!p) { p = new Path2D(); b.set(id, p); }
    return p;
  };
  // 0 over pale ground, 0.5 over the mid-tones, 1 over dark
  const shadeOf = (ground: number) => 0.5 * smooth((0.6 - ground) / 0.18) + 0.5 * smooth((0.42 - ground) / 0.16);
  const inked = (b: Batch, ground: number, a: number, width: number) => add(b, SHADES[Math.round(shadeOf(ground) * 12)], a, width);
  const flush = (b: Batch, fill = false) => {
    for (const [id, p] of b) {
      const [colour, s, width] = id.split("|");
      g.globalAlpha = Number(s);
      if (fill) { g.fillStyle = colour; g.fill(p); } else { g.strokeStyle = colour; g.lineWidth = Number(width); g.stroke(p); }
    }
    g.globalAlpha = 1;
  };
  return { GREEN, SHADES, add, inked, flush };
}
