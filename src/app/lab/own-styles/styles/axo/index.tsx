import type { ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../types";
import { ELL, makeIso, plane, prism, rrect, type Iso, type Solid, type V3 } from "./iso";
import s from "./axo.module.css";

// Axonometric (D53): each object in true 30° isometric, exploded into its layers like an engineered assembly drawing.
// Flat tonal faces (white top, paper left, surface-2 right) carry the volume; ink hairlines on every true edge; dashed
// projection lines between the exploded layers and down to a dashed plan on the ground; one green face on the piece you
// own. Geometry comes from ./iso, so every edge is computed, not drawn by eye. Drawn at 240 × 180.

const XY = (z: number) => plane([0, 0, z], [1, 0, 0], [0, 1, 0]);
const rect = (x: number, y: number, w: number, h: number): [number, number][] => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const UP: V3 = [0, 0, 1];

// One solid: side faces by tone, the silhouette and sharp edges in hairline, then the cap (its tone, or `cap` to override)
function Body({ b, cap, children }: { b: Solid; cap?: string; children?: ReactNode }) {
  return (
    <g>
      {b.sides.map((f, i) => <path key={i} className={s[`s${f.tone}`]} d={f.d} />)}
      <path className={s.edge} d={b.outline} />
      {b.edges && <path className={s.edge} d={b.edges} />}
      <path className={`${s.cap} ${cap ?? s[`c${b.cap.tone}`]}`} d={b.cap.d} />
      {children}
    </g>
  );
}

// Dashed projection lines between two heights at the given plan points
const proj = (iso: Iso, pts: [number, number][], z0: number, z1: number) =>
  pts.map(([x, y]) => iso.d([[x, y, z0], [x, y, z1]], false)).join("");

// The plan on the ground: the footprint dashed, its two front edges run on as extension lines
function Ground({ iso, pts, z, from, ext }: { iso: Iso; pts: [number, number][]; z: number; from: [number, number][]; ext: [V3, V3][] }) {
  return (
    <g>
      <path className={s.ext} d={ext.map(([a, b]) => iso.d([a, b], false)).join("")} />
      <path className={s.plan} d={iso.d(XY(z)(pts))} />
      <path className={s.proj} d={proj(iso, from, z, 0)} />
    </g>
  );
}

// A callout: a node on the object, a hairline leader, a square-cornered ink tag in mono
const tagW = (t: string) => Math.round(t.length * 6.6 + 14);
function Tag({ at, x, y, text, side = "left" }: { at: [number, number]; x: number; y: number; text: string; side?: "left" | "right" | "top" }) {
  const w = tagW(text);
  const [lx, ly] = side === "top" ? [x + 16, y] : [side === "left" ? x : x + w, y + 9];
  return (
    <g>
      <path className={s.leader} d={`M${at[0]} ${at[1]}L${lx} ${ly}`} />
      <circle className={s.node} cx={at[0]} cy={at[1]} r="1.8" />
      <g className={s.tag} transform={`translate(${x} ${y})`}>
        <rect width={w} height="18" rx="2" />
        <text x={w / 2} y="12.4" textAnchor="middle">{text}</text>
      </g>
    </g>
  );
}

// Data: the note lifted apart into three sheets. The bottom sheet holds the text lines, the middle breaks them into
// dashes, the top carries them as private dots (green, yours).
const ROWS = [40, 44, 30, 40, 24];
const NOTE: [number, number][] = [[0, 0], [46, 0], [60, 14], [60, 78], [0, 78]];
const FOLD = "M46 0V14H60Z";
function Data() {
  const iso = makeIso(128, 77);
  const T = 3;
  const Z = [0, 26, 52];
  const sheets = Z.map((z) => prism(iso, XY(z)(NOTE), [0, 0, T]));
  const front: [number, number][] = [[0, 78], [60, 78], [60, 14]];
  const face = (z: number) => iso.m([0, 0, z + T], [1, 0, 0], [0, 1, 0]);
  const rows = ROWS.map((l, i) => `M9 ${26 + i * 11}h${l}`).join("");
  return (
    <>
      <Ground iso={iso} pts={NOTE} z={-12} from={front}
        ext={[[[60, 78, -12], [60, 94, -12]], [[60, 78, -12], [76, 78, -12]], [[0, 78, -12], [0, 94, -12]], [[60, 14, -12], [76, 14, -12]]]} />
      <Body b={sheets[0]} cap={s.ct}>
        <g transform={face(Z[0])}>
          <path className={s.fold} d={FOLD} />
          <path className={s.text} d={rows} />
          <path className={s.head} d="M9 12h22" />
        </g>
      </Body>
      <path className={s.proj} d={proj(iso, front, Z[0] + T, Z[1])} />
      <Body b={sheets[1]} cap={s.frost}>
        <g transform={face(Z[1])}>
          <path className={s.fold} d={FOLD} />
          <path className={s.dashes} d={rows} />
        </g>
      </Body>
      <path className={s.proj} d={proj(iso, front, Z[1] + T, Z[2])} />
      <Body b={sheets[2]} cap={s.ct}>
        <g transform={face(Z[2])}>
          <path className={s.fold} d={FOLD} />
          <g className={s.dots}>
            {ROWS.map((l, i) => Array.from({ length: Math.floor(l / 7) + 1 }, (_, j) => <circle key={`${i}-${j}`} cx={10 + j * 7} cy={26 + i * 11} r="2.3" />))}
          </g>
        </g>
      </Body>
      <Tag at={iso.p([52, 40, Z[2] + T])} x={172} y={64} text="Private" />
    </>
  );
}

// A coin: a short cylinder, its side reeded with hairlines, a ring on its face
function Coin({ iso, at, r, h, green = false }: { iso: Iso; at: V3; r: number; h: number; green?: boolean }) {
  const [X, Yb] = iso.p(at);
  const Yt = Yb - h;
  const rx = r * ELL.rx, ry = r * ELL.ry;
  const reeds = Array.from({ length: 11 }, (_, i) => {
    const t = (Math.PI * (i + 1)) / 12;
    const x = X - rx * Math.cos(t), dy = ry * Math.sin(t);
    return `M${x.toFixed(2)} ${(Yt + dy).toFixed(2)}V${(Yb + dy).toFixed(2)}`;
  }).join("");
  return (
    <g>
      <path className={`${s.sr} ${s.edge}`} d={`M${X - rx} ${Yt}V${Yb}A${rx} ${ry} 0 0 0 ${X + rx} ${Yb}V${Yt}A${rx} ${ry} 0 0 1 ${X - rx} ${Yt}Z`} />
      <path className={s.reed} d={reeds} />
      <ellipse className={`${s.cap} ${green ? s.cg : s.ct}`} cx={X} cy={Yt} rx={rx} ry={ry} />
      <ellipse className={green ? s.ringG : s.ring} cx={X} cy={Yt} rx={rx * 0.68} ry={ry * 0.68} />
    </g>
  );
}

// Assets: one account, its cards exploded in depth; two coins stand on the top card and the swap arcs from one to the
// other, which is yours (green)
function Assets() {
  const iso = makeIso(102, 58);
  const T = 3;
  const Z = [0, 16, 32];
  const CARD = rrect(0, 0, 112, 70, 8);
  const cards = Z.map((z) => prism(iso, XY(z)(CARD), [0, 0, T]));
  // The silhouette points of the rounded corners (their 45° points), where projection lines read as true
  const k = 8 - 8 * Math.SQRT1_2;
  const front: [number, number][] = [[k, 70 - k], [112 - k, 70 - k], [112 - k, k]];
  const top = Z[2] + T;
  const A: V3 = [28, 34, top], B: V3 = [84, 34, top];
  const H = 6, LIFT = 30;
  const arc = Array.from({ length: 33 }, (_, i) => {
    const t = i / 32;
    return [A[0] + (B[0] - A[0]) * t, A[1], top + H + LIFT * Math.sin(Math.PI * t)] as V3;
  });
  const end = iso.p(arc[arc.length - 1]);
  const pre = iso.p(arc[arc.length - 4]);
  const ang = Math.atan2(end[1] - pre[1], end[0] - pre[0]);
  const head = (da: number) => `${(end[0] - 5 * Math.cos(ang + da)).toFixed(2)} ${(end[1] - 5 * Math.sin(ang + da)).toFixed(2)}`;
  return (
    <>
      <Ground iso={iso} pts={CARD} z={-12} from={front}
        ext={[[[112, 70, -12], [112, 86, -12]], [[112, 70, -12], [128, 70, -12]], [[0, 70, -12], [0, 86, -12]], [[112, 0, -12], [128, 0, -12]]]} />
      <Body b={cards[0]} cap={s.ct} />
      <path className={s.proj} d={proj(iso, front, Z[0] + T, Z[1])} />
      <Body b={cards[1]} cap={s.ct} />
      <path className={s.proj} d={proj(iso, front, Z[1] + T, Z[2])} />
      <Body b={cards[2]} cap={s.ct}>
        <g transform={iso.m([0, 0, top], [1, 0, 0], [0, 1, 0])}>
          <path className={s.head} d="M10 61h24" />
          <path className={s.text} d="M40 61h14" />
        </g>
      </Body>
      <Coin iso={iso} at={A} r={13} h={H} />
      <Coin iso={iso} at={B} r={13} h={H} green />
      <path className={s.arc} d={iso.d(arc, false)} />
      <path className={s.arrow} d={`M${head(0.5)}L${end[0]} ${end[1]}L${head(-0.5)}`} />
      <Tag at={iso.p(arc[16])} x={150} y={6} text="Swap" />
    </>
  );
}

// Intelligence: the enclave as a box with its lid lifted off; a message hangs over the lid's slot on its way in, and the
// signed receipt (yours, green) slides out of a slot in the side
function Intelligence() {
  const iso = makeIso(108, 84);
  const W = 60, HB = 30, ZL = 47, TL = 5, ZM = 70;
  const box = prism(iso, XY(0)(rect(0, 0, W, W)), [0, 0, HB]);
  const lid = prism(iso, XY(ZL)(rect(0, 0, W, W)), [0, 0, TL]);
  const msg = prism(iso, XY(ZM)(rrect(14, 19, 32, 22, 5)), [0, 0, 3]);
  // The receipt: from the side face out to a torn (zigzag) end
  const teeth: [number, number][] = [];
  for (let i = 0; i <= 6; i++) teeth.push([i % 2 ? 94 : 98, 18 + i * 4]);
  const RECEIPT: [number, number][] = [[W, 18], ...teeth, [W, 42]];
  const ZR = 11;
  const receipt = prism(iso, XY(ZR)(RECEIPT), [0, 0, 1.5], false);
  const front: [number, number][] = [[0, W], [W, W], [W, 0]];
  const grille = Array.from({ length: 9 }, (_, i) => `M${6 + i * 6} -9V-3`).join("");
  return (
    <>
      <Ground iso={iso} pts={rect(0, 0, W, W)} z={-12} from={front}
        ext={[[[W, W, -12], [W, W + 16, -12]], [[W, W, -12], [W + 16, W, -12]], [[0, W, -12], [0, W + 16, -12]], [[W, 0, -12], [W + 16, 0, -12]]]} />
      <Body b={box} cap={s.ct}>
        <g transform={iso.m([0, W, 0], [1, 0, 0], [0, 0, -1])}><path className={s.text} d={grille} /></g>
        <g transform={iso.m([W, 0, 0], [0, 1, 0], [0, 0, -1])}>
          <rect className={s.slot} x="16" y={-(ZR + 4)} width="28" height="5" />
        </g>
      </Body>
      <Body b={receipt} cap={s.cg}>
        <g transform={iso.m([W, 0, ZR + 1.5], [1, 0, 0], [0, 1, 0])}>
          <path className={s.ink2} d="M8 23h16M8 29h10" />
          <path className={s.tick} d="M27 22l2.5 3 5-6" />
        </g>
      </Body>
      <path className={s.proj} d={proj(iso, front, HB, ZL)} />
      <Body b={lid} cap={s.ct}>
        <g transform={iso.m([0, 0, ZL + TL], [1, 0, 0], [0, 1, 0])}>
          <rect className={s.slot} x="20" y="27" width="20" height="6" />
        </g>
      </Body>
      <path className={s.proj} d={iso.d([[30, 30, ZL + TL], [30, 30, ZM]], false)} />
      <Body b={msg} cap={s.ct}>
        <g className={s.ink} transform={iso.m([0, 0, ZM + 3], [1, 0, 0], [0, 1, 0])}>
          {[22, 30, 38].map((x) => <circle key={x} cx={x} cy="30" r="1.8" />)}
        </g>
      </Body>
      <Tag at={iso.p([66, 37, ZR + 1.5])} x={114} y={154} text="Signed proof" side="top" />
    </>
  );
}

// A key in its own plane: bow with a hole, a shaft, two bits. Drawn twice, a hair apart, so it has a thickness.
const KEY = "M7.75 -2H44V8H40V2H37V6H33V2H7.75A8 8 0 1 1 7.75 -2ZM3 0A3 3 0 1 0 -3 0A3 3 0 1 0 3 0Z";

// Identity: the ID badge stands upright; its key ring is lifted above it. The old key turns away (dashed), the new
// key (yours, green) hangs in its place.
function Identity() {
  const iso = makeIso(90, 122);
  const BW = 74, BH = 86, T = 5;
  const badge = prism(iso, plane([0, T, 0], [1, 0, 0], UP)(rrect(0, 0, BW, BH, 8)), [0, -T, 0]);
  const face = iso.m([0, T, BH], [1, 0, 0], [0, 0, -1]);
  const ringPlane = (y: number) => iso.m([0, y, BH], [1, 0, 0], [0, 0, -1]);
  const R: [number, number] = [37, -24]; // ring centre on the face plane (u, v)
  const circ = (r: number) => `M${R[0] + r} ${R[1]}A${r} ${r} 0 1 0 ${R[0] - r} ${R[1]}A${r} ${r} 0 1 0 ${R[0] + r} ${R[1]}Z`;
  const ring = circ(11) + circ(8.5);
  const keyAt = (deg: number) => `translate(${R[0]} ${R[1]}) rotate(${deg}) translate(11 0) scale(1.2)`;
  const NEW = 16, OLD = -50;
  return (
    <>
      {/* The badge meets the ground along its straight bottom edge, between the corner radii */}
      <Ground iso={iso} pts={rect(8, 0, BW - 16, T)} z={-12} from={[[8, T], [BW - 8, T], [BW - 8, 0]]}
        ext={[[[BW - 8, T, -12], [BW - 8, T + 16, -12]], [[BW - 8, T, -12], [BW + 8, T, -12]], [[8, T, -12], [8, T + 16, -12]], [[BW - 8, 0, -12], [BW + 8, 0, -12]]]} />
      <Body b={badge} cap={s.ct}>
        <g transform={face}>
          <rect className={s.slotSoft} x="27" y="7" width="20" height="5" rx="2.5" />
          <circle className={s.avatar} cx="37" cy="28" r="9" />
          <path className={s.line} d="M28 43a9 6.5 0 0 1 18 0" />
          <text className={s.name} x="37" y="63" textAnchor="middle">your-name</text>
          <text className={`${s.name} ${s.muted}`} x="37" y="78" textAnchor="middle">.near</text>
        </g>
      </Body>
      <g transform={ringPlane(2.5)}>
        <path className={s.proj} d={`M${R[0]} 9.5V${R[1] + 11}`} />
      </g>
      <g transform={ringPlane(0.5)}><path className={`${s.sr} ${s.edge}`} d={ring} fillRule="evenodd" /></g>
      <g transform={ringPlane(2.5)}><path className={`${s.ct} ${s.edge}`} d={ring} fillRule="evenodd" /></g>
      {/* The old key, turning away: an outline in front of the ring so it reads whole */}
      <g transform={ringPlane(4)}><path className={s.oldKey} d={KEY} transform={keyAt(OLD)} fillRule="evenodd" /></g>
      <g transform={ringPlane(3)}><path className={`${s.sr} ${s.edge}`} d={KEY} transform={keyAt(NEW)} fillRule="evenodd" /></g>
      <g transform={ringPlane(5.5)}><path className={`${s.cg} ${s.cap}`} d={KEY} transform={keyAt(NEW)} fillRule="evenodd" /></g>
      <Tag at={iso.p([6, T, BH - 59])} x={0} y={140} text="35+ chains" side="right" />
    </>
  );
}

const ART = { data: Data, assets: Assets, intelligence: Intelligence, identity: Identity };

function AxoArt({ which }: { which: OwnKey }) {
  const Art = ART[which];
  return (
    <div className={s.art} aria-hidden="true">
      <svg viewBox="0 0 240 180" focusable="false"><Art /></svg>
    </div>
  );
}

export const style: StyleDef = {
  key: "axo",
  name: "Axonometric",
  refs: "Fractalized (engineered renders), Monad",
  summary:
    "Each object drawn in true 30° isometric and exploded into its layers, like an assembly drawing: flat white, paper and grey faces for volume, hairline edges, dashed projection lines down to a plan on the ground. The piece you own is the one green element.",
  motion:
    "The layers start closed and lift apart along their projection lines (the dashed lines drawing on as they go), then the green face fades in last.",
  Art: AxoArt,
};
