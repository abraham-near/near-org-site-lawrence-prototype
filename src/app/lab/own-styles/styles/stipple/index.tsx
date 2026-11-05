import type { ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../types";
import { camera, clamp, compose, paths, plane, poly, rng, solid, surface, type Cam, type Dot, type Here, type Pt, type Solid, type Surface, type V3 } from "./dots";
import styles from "./stipple.module.css";

// Stipple (D53), after Tempo's dotted globe and Arc'teryx's particles: each object is a volume made of dots, seen at an
// angle. Dots sit evenly on its surfaces, so they crowd where a surface turns away; how a face meets the light sets their
// size and strength, so lit faces fade cleanly to nothing and turned faces fill in. The yours element is solid green,
// the strongest note; a few things stay crisp (type, the receipt, the tags). Drawn at 240 × 180; static end states.

type Layers = { solids: Solid[]; fill?: boolean[]; under?: ReactNode; over?: ReactNode; green?: Pt[][] };

// Tone from the light: nothing where a face meets it square on, filling in as it turns away, thicker at edges
const lightTone = ({ k = 0.8, g = 1.6, base = 0, e = 0.45, soft = 2.4 } = {}) => (h: Here) => {
  const away = 1 - h.lit;
  return base + k * away ** g + e * Math.exp(-h.edge / soft) * (0.35 + 0.65 * away);
};

// A box's faces (top and four sides; the camera culls the ones facing away), each with its own tone
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, top: Surface["tone"], side: Surface["tone"], r = 0): Surface[] {
  const w = x1 - x0, d = z1 - z0, h = y1 - y0;
  const corner = (u: number, v: number) => {
    if (!r) return true;
    const cu = Math.min(u, w - u), cv = Math.min(v, d - v);
    return cu >= r || cv >= r || Math.hypot(r - cu, r - cv) <= r;
  };
  return [
    { P: (u, v) => [x0 + u, y1, z1 - v], u: [0, w], v: [0, d], tone: top, mask: corner },
    { P: (u, v) => [x0 + u, y0 + v, z1], u: [0, w], v: [0, h], tone: side, step: 1.9 },
    { P: (u, v) => [x1, y0 + v, z1 - u], u: [0, d], v: [0, h], tone: side, step: 1.9 },
    { P: (u, v) => [x0, y0 + v, z0 + u], u: [0, d], v: [0, h], tone: side, step: 1.9 },
    { P: (u, v) => [x1 - u, y0 + v, z0], u: [0, w], v: [0, h], tone: side, step: 1.9 },
  ];
}

const Tag = ({ x, y, w, text, dot = false }: { x: number; y: number; w: number; text: string; dot?: boolean }) => (
  <g className={styles.tag} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
    <rect width={w} height="20" rx="3" />
    {dot && <circle className={styles.green} cx="10" cy="10" r="3" />}
    <text x={dot ? 18 : 9} y="13.5">{text}</text>
  </g>
);

// Data: a sheet bowed towards you, its lines of text printed as fine dots; towards its right edge the sheet comes apart
// and its lines lift off as a drifting field of private dots
function data(): Layers {
  const cam = camera(-30, 12, 96, 88);
  const W = 92, H = 118, GO = 0.56; // the sheet comes apart past half its width
  const P = (u: number, v: number): V3 => [u - W / 2, v - H / 2, 18 * Math.sin((Math.PI * u) / W) + 6 * Math.sin((Math.PI * v) / H)];
  const rand = rng(7);
  const drift = (k: number, far: number, lift: number): Pt => [far * k ** 1.5 * (0.45 + rand()), -lift * k ** 1.5 * (rand() - 0.2)];
  const sheet = surface(cam, {
    P, u: [0, W], v: [0, H], twoSided: true,
    tone: (h) => lightTone({ k: 1.1, g: 1.5, e: 0.6, soft: 2.6 })(h) + (h.back ? 0.3 : 0),
    move: (x, y, u) => {
      const k = clamp((u / W - GO) / (1 - GO));
      if (!k) return [x, y];
      if (rand() < 0.92 * k ** 0.6) return null;
      const [dx, dy] = drift(k, 44, 18);
      return [x + dx, y + dy];
    },
  });
  // The lines: fine printed dots up to where the sheet comes apart, then private dots lifting away from it
  const ROWS = [66, 74, 54, 70, 46], text: Dot[] = [], priv: Dot[] = [];
  ROWS.forEach((len, i) => {
    const v = H - 26 - i * 13;
    for (let u = 12; u <= 12 + len; u += 1.45) {
      if (u / W > GO - 0.03) break;
      const [x, y] = cam.proj(P(u, v));
      text.push([x, y, 0.5, 0.95]);
    }
    for (let u = W * GO + 2; u <= 12 + len + 14; u += 7.5) {
      const [x, y] = cam.proj(P(u, v)), k = clamp((u / W - GO) / (1 - GO) + 0.12);
      const [dx, dy] = drift(k, 22, 5);
      priv.push([x + dx, y + dy, 1.6, 1]);
    }
  });
  const s: Solid = { dots: { ink: [...sheet.dots, ...text, ...priv] }, cover: [] };
  const [tx, ty] = cam.proj(P(W * 0.9, 2));
  return {
    solids: [s],
    over: <Tag x={tx + 6} y={ty - 6} w={66} text="Private" dot />,
  };
}

// A coin lying flat: a slightly domed face and its milled edge
function coin(cam: Cam, cx: number, y: number, cz: number, R: number, H: number, tone: Surface["tone"], side: Surface["tone"]): Surface[] {
  return [
    {
      P: (u, v) => [cx + u, y + H + 2.2 * (1 - (u * u + v * v) / (R * R)), cz - v], u: [-R, R], v: [-R, R],
      mask: (u, v) => u * u + v * v < R * R, edge: (u, v) => R - Math.hypot(u, v), tone, step: 2.1,
    },
    { P: (u, v) => [cx + R * Math.cos(-u / R), y + v, cz + R * Math.sin(-u / R)], u: [0, 2 * Math.PI * R], v: [0, H], tone: side, step: 1.7 },
  ];
}

// Assets: the account as a soft slab of cards seen from above, two coins lying on it and the swap arcing between them;
// the coin it arrives at is solid green
function assets(): Layers {
  const cam = camera(30, 46, 120, 102);
  const top = lightTone({ k: 0.55, g: 2, e: 0.5, soft: 2.6 }), side = lightTone({ k: 0.9, g: 1.2, base: 0.2, e: 0 });
  const cards = [0, 1, 2].map((i) => solid(cam, box(-60 - 4 * (2 - i), 60 - 4 * (2 - i), i * 7, i * 7 + 4.5, -36 - 8 * (2 - i), 36 - 8 * (2 - i), top, side, 7)));
  const Y = 18.5, A: V3 = [-30, Y, 10], B: V3 = [32, Y, 10], R = 15;
  const coinA = solid(cam, coin(cam, A[0], Y, A[2], R, 5, lightTone({ k: 0.9, g: 1.4, e: 0.6, soft: 2 }), lightTone({ k: 1, g: 1, base: 0.35, e: 0 })));
  const coinB = solid(cam, coin(cam, B[0], Y, B[2], R, 5, lightTone({ k: 0.9, g: 1.6, e: 0.7, soft: 1.6 }), lightTone({ k: 1, g: 1, base: 0.45, e: 0 })), "deep");
  // The swap: a parabola of dots from one coin to the other, growing as it goes
  const arc: Dot[] = [];
  for (let t = 0.16; t <= 0.86; t += 0.045) {
    const p: V3 = [A[0] + (B[0] - A[0]) * t, Y + 7 + 40 * 4 * t * (1 - t), A[2]];
    const [x, y] = cam.proj(p);
    arc.push([x, y, 0.55 + 0.75 * t, 1]);
  }
  const apex = cam.proj([(A[0] + B[0]) / 2, Y + 7 + 40, A[2]]);
  const solids = compose([...cards, coinA, coinB]);
  return {
    solids: [...solids, { dots: { ink: arc }, cover: [] }],
    fill: [true, true, true, true, false],
    green: [coinB.cover],
    over: <Tag x={apex[0] - 22} y={apex[1] - 27} w={44} text="Swap" />,
  };
}

// Intelligence: the enclave as a dense dotted cube, a message dropping into the slot on top and a crisp signed receipt
// coming out of the slit in front, sealed in green
function intelligence(): Layers {
  const cam = camera(36, 24, 110, 84);
  const S = 31;
  const face = lightTone({ k: 1.15, g: 1.5, base: 0.04, e: 0.5, soft: 2.2 });
  const cube = box(-S, S, -S, S, -S, S, (h) => (h.u > 16 && h.u < 46 && h.v > 28 && h.v < 34 ? 1 : face(h)), face);
  cube.forEach((f) => (f.step = 2.1));
  const block = solid(cam, cube);
  // The message: a small sheet half into the slot
  const msg = solid(cam, [{ P: (u, v) => [-17 + u, S + 1 + v, 0], u: [0, 34], v: [0, 26], tone: lightTone({ k: 0.3, g: 2, e: 0.6, soft: 1.6 }), step: 2 }]);
  const dots = [-7, 0, 7].map((x) => { const [px, py] = cam.proj([x, S + 15, 0.1]); return [px, py, 1.3, 1] as Dot; });
  msg.dots.ink!.push(...dots);
  const [solidBlock, solidMsg] = compose([block, msg]);
  // The receipt hangs from the slit on the front face, in that face's plane
  const onFace = plane(cam, [-13, -10, S + 0.4], [1, 0, 0], [0, -1, 0]);
  const [sx, sy] = cam.proj([S, -40, S]);
  return {
    solids: [solidBlock, solidMsg],
    fill: [true, true],
    over: <>
      <g transform={onFace}>
        <path className={styles.hair} d="M-4 0h34" />
        <path className={styles.receipt} d="M0 0.6h26v46l-4.33 4-4.34-4-4.33 4-4.33-4-4.34 4-4.33-4z" />
        <path className={styles.hair} d="M5 9h14M5 15h9" />
        <circle className={styles.green} cx="17" cy="34" r="6" />
        <path className={styles.tick} d="M14 34l2.2 2.2 4.2-4.2" />
      </g>
      <Tag x={sx - 6} y={sy + 4} w={74} text="Signed proof" />
    </>,
  };
}

// Identity: the badge as a dotted card turned a little away, its portrait cut clean out of a dense dotted disc; on the key
// ring, the old key has turned away (an arc of dots traces the turn) and the new key hangs in solid green
function identity(): Layers {
  const cam = camera(-24, 10, 118, 104);
  const W = 92, H = 112, r = 8;
  const corner = (u: number, v: number) => { const cu = Math.min(u, W - u), cv = Math.min(v, H - v); return cu >= r || cv >= r || Math.hypot(r - cu, r - cv) <= r; };
  // Card-local coordinates (x right, y down from the top-left corner); the face is an even fine screen, clear under the
  // type, dense in the portrait disc except for the head and shoulders, which are left clean
  const L = (u: number, v: number): Pt => [u, H - v];
  const portrait = (x: number, y: number) => {
    const d = Math.hypot(x - W / 2, y - 36);
    if (d > 16) return -1;
    const head = Math.hypot(x - W / 2, y - 32) < 6.2, body = Math.hypot((x - W / 2) / 11, (y - 52) / 10) < 1;
    return head || body ? 0 : 0.6 + 0.4 * clamp((d - 8) / 8);
  };
  const front: Surface = {
    P: (u, v) => [u - W / 2, v - H / 2, 0], u: [0, W], v: [0, H], mask: corner,
    edge: (u, v) => { const cu = Math.min(u, W - u), cv = Math.min(v, H - v); return cu < r && cv < r ? r - Math.hypot(r - cu, r - cv) : Math.min(cu, cv); },
    tone: (h) => {
      const [x, y] = L(h.u, h.v), p = portrait(x, y);
      if (p >= 0) return p;
      if (x > 6 && x < W - 6 && y > 6 && y < 13) return x > 34 && x < 58 && y > 8 && y < 12 ? 1 : 0.05; // the clip slot
      const clear = clamp((Math.abs(y - 75) - 13) / 6) || (x < 12 || x > W - 12 ? 1 : 0);
      return 0.1 * clear + 0.6 * Math.exp(-h.edge / 2.6);
    },
  };
  const edge: Surface = { P: (u, v) => [W / 2, v - H / 2, -u], u: [0, 3], v: [r, H - r], tone: () => 0.85, step: 1.6 };
  const badge = solid(cam, [front, edge]);
  // The ring: a torus of dots
  const RC: V3 = [0, H / 2 + 16, 0], RR = 11, rr = 2.4;
  const ring = solid(cam, [{
    P: (u, v) => { const t = u / RR, p = v / rr; return [RC[0] + (RR + rr * Math.cos(p)) * Math.cos(t), RC[1] + (RR + rr * Math.cos(p)) * Math.sin(t), rr * Math.sin(p)]; },
    u: [0, 2 * Math.PI * RR], v: [0, 2 * Math.PI * rr], tone: lightTone({ k: 0.85, g: 1.6, base: 0.02, e: 0 }), step: 1.6,
    edge: () => 9,
  }]);
  const [cx, cy] = cam.proj(RC);
  // Keys in screen space around the ring: one at an angle, its length and two teeth
  const keyAt = (deg: number) => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const at = (d: number, off = 0): Pt => [cx + c * d - s * off, cy + s * d + c * off];
    return { at, bow: at(RR + 12) };
  };
  const was = keyAt(158); // the new key (at 6°) is drawn solid, below
  const oldKey: Dot[] = [];
  for (let k = 0; k < 24; k++) { const t = (k / 24) * 2 * Math.PI; oldKey.push([was.bow[0] + 8 * Math.cos(t), was.bow[1] + 8 * Math.sin(t), 0.5, 0.8]); }
  for (let d = RR + 21; d <= RR + 62; d += 1.8) { const [x, y] = was.at(d); oldKey.push([x, y, 0.55, 0.8]); }
  for (const [d, l] of [[RR + 53, 7], [RR + 61, 5]]) for (let o = 1.8; o <= l; o += 1.8) { const [x, y] = was.at(d, o); oldKey.push([x, y, 0.55, 0.8]); }
  // The turn: an arc of dots over the top of the ring, from where the old key's bow was to the new key's, growing
  const turn: Dot[] = [];
  for (let deg = 166; deg <= 352; deg += 7) {
    const a = (deg * Math.PI) / 180, u = (deg - 166) / 186;
    turn.push([cx + (RR + 12) * Math.cos(a), cy + (RR + 12) * Math.sin(a), 0.4 + 0.5 * u, 0.5 + 0.5 * u]);
  }
  const strap: Dot[] = [];
  const [bx, by] = cam.proj([0, H / 2 - 4, 0]);
  for (let t = 0.12; t < 1; t += 0.12) strap.push([cx + (bx - cx) * t, cy + RR + (by - cy - RR) * t, 0.55, 1]);
  const card = plane(cam, [-W / 2, H / 2, 0.2], [1, 0, 0], [0, -1, 0]);
  const [kx, ky] = cam.proj([W / 2, -H / 2, 0]);
  const deg = 6;
  return {
    solids: compose([badge, ring]).concat([{ dots: { faint: oldKey, ink: [...turn, ...strap] }, cover: [] }]),
    fill: [true, false],
    over: <>
      <g transform={card}>
        <text className={styles.name} x={W / 2} y="72" textAnchor="middle">your-name</text>
        <text className={`${styles.name} ${styles.muted}`} x={W / 2} y="86" textAnchor="middle">.near</text>
      </g>
      {/* The new key, solid green */}
      <g transform={`translate(${cx.toFixed(2)} ${cy.toFixed(2)}) rotate(${deg})`}>
        <circle className={styles.greenRing} cx={RR + 12} cy="0" r="7" />
        <path className={styles.greenFill} d={`M${RR + 19} -1.6h43v3.2h-43zM${RR + 52} 1h3v7h-3zM${RR + 59.5} 1h2.5v5h-2.5z`} />
      </g>
      <Tag x={kx - 40} y={ky - 8} w={74} text="35+ chains" />
    </>,
  };
}

const DRAW: Record<OwnKey, () => Layers> = { data, assets, intelligence, identity };
const cache = new Map<OwnKey, Layers>();
const layers = (which: OwnKey) => {
  if (!cache.has(which)) cache.set(which, DRAW[which]());
  return cache.get(which)!;
};

const CLASS = { ink: styles.ink, green: styles.green, deep: styles.deep, faint: styles.faint };

function StippleArt({ which }: { which: OwnKey }) {
  const L = layers(which);
  return (
    <div className={styles.art} data-art={which} aria-hidden="true">
      <svg viewBox="0 0 240 180" focusable="false">
        {L.solids.map((s, i) => L.fill?.[i] && s.cover.length > 2 && <path key={`f${i}`} className={styles.paper} d={poly(s.cover)} />)}
        {L.green?.map((c, i) => <path key={`g${i}`} className={styles.green} d={poly(c)} />)}
        {L.under}
        {L.solids.flatMap((s, i) => (Object.keys(s.dots) as (keyof typeof CLASS)[]).flatMap((k) =>
          paths(s.dots[k]!).map((p) => <path key={`${i}${k}${p.o}`} className={CLASS[k]} opacity={p.o} d={p.d} />)))}
        {L.over}
      </svg>
    </div>
  );
}

export const style: StyleDef = {
  key: "stipple",
  name: "Stipple",
  refs: "Tempo (the dotted globe), Arc'teryx (particles)",
  summary:
    "Each object is a volume made of fine dots, seen at an angle: lit faces fade cleanly away and turned faces fill in, as on Tempo's globe, while the data sheet comes apart into a drifting field of dots. What's yours is solid green; type, the receipt and the tags stay crisp.",
  motion:
    "As its station arrives, each object's dots gather out of a loose drift and settle onto its surfaces (the data sheet does the reverse, lifting away), then the green element fills in last.",
  Art: StippleArt,
};
