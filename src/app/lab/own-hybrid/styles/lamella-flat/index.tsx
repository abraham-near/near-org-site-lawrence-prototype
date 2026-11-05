import type { ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../../../own-styles/styles/types";
import s from "../lamella/lamella.module.css";
import { Cross, Frame, Label, Micro, flutes, r2, refract, seg, ticks } from "../lamella/parts";
import type { P } from "../lamella/parts";

// "Lamella, front-on" (D55): the Lamella language (fluted glass, a faint prismatic fringe, lines that break flute by
// flute, micro ticks) turned flat to camera, the way the original drawings (OwnArt) face you: front elevations with only
// an edge's thickness for depth. Renders in assets/generated/2026-11-04_own-hybrid/lamella-flat/. Lines behind the
// glass are given a slight slope (a fan or a fall) so the flutes break them; coordinates are measured off the renders
// on the 420 × 315 box.

// A point at `deg` (screen degrees, 0 = right, clockwise) on a circle
const onC = (c: P, r: number, deg: number): P => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] + r * Math.sin((deg * Math.PI) / 180)];

// ── Data: a frosted note with a fluted pane over its right half, green along its edge. The note's lines come in from
// the left, cross the note, break flute by flute behind the pane and leave on the right only as dots: private.
const D_FLUTES = flutes(183, 274, 12);
const D_VP: P = [900, 168];
const D_ROWS = Array.from({ length: 9 }, (_, i) => 94 + i * 18);
const dy = (y0: number, x: number) => D_VP[1] + (y0 - D_VP[1]) * ((D_VP[0] - x) / (D_VP[0] - 20));
function Data() {
  return (
    <Frame
      src="lamella-flat-data"
      under={
        <>
          {D_ROWS.map((y0, i) => <path key={i} className={s.field} d={refract([20, y0], D_VP, D_FLUTES, -2.6, 0.4)} />)}
        </>
      }
      over={
        <>
          {D_ROWS.map((y0, i) => (
            <g key={i}>
              <path className={`${s.field} ${[s.p1, "", s.p2, s.p3][i % 4]}`} d={seg([20, y0], D_VP, 20 + (i % 3) * 6, 181)} />
              {Array.from({ length: 16 }, (_, j) => <circle key={j} className={s.dot} cx={288 + j * 6} cy={r2(dy(y0, 288 + j * 6))} r="0.8" fillOpacity={r2(1 - j / 17)} />)}
            </g>
          ))}
          {/* a tick at every flute under the pane, and a fine scale down the note's edge */}
          <path className={s.faint} d="M183 291H279" />
          <path className={s.tick} d={[...D_FLUTES, 279].map((x, i) => `M${r2(x)} 291v${i % 4 === 0 ? 4 : 2.2}`).join("")} />
          <path className={s.faint} d="M113 30V282" />
          <path className={s.tick} d={ticks([113, 30], [113, 282], 28, 2, 4, 4)} />
          <Micro x={20} y={80}>Transactions</Micro>
          <path className={s.faint} d="M288 96h96M288 96v3M384 96v3" />
          <Label x={288} y={84} text="Private" w={50} />
          <Cross x={400} y={22} /><Cross x={400} y={292} />
        </>
      }
    />
  );
}

// ── Assets: one account as a deck of glass cards, the front one fluted; two discs on it, silver and green, and the swap
// as an arc from one to the other. A few fine lines run through the deck and break in the front card's flutes.
const A_FLUTES = flutes(83, 376, 34);
function Assets() {
  const rows = [92, 100, 108, 116];
  return (
    <Frame
      src="lamella-flat-assets"
      under={
        <>
          {rows.map((y, i) => {
            const a: P = [0, y], b: P = [420, y - 14];
            return (
              <g key={i}>
                <path className={s.field} d={seg(a, b, 6 + i * 4, 83)} />
                <path className={s.field} d={refract(a, b, A_FLUTES, -2.6, 0.35)} />
                <path className={s.field} d={seg(a, b, 377, 414 - i * 4)} />
              </g>
            );
          })}
        </>
      }
      over={
        <>
          <path className={s.hair} d="M161 165C168 120 269 120 276 165" />
          <path className={s.hair} d="M272.2 159.8l3.8 5.2 2.2-6" />
          <circle className={s.inkFill} cx="161" cy="165" r="1.6" />
          <path className={s.faint} d="M218.5 32V131" />
          <path className={s.faint} d="M83 285H376" />
          <path className={s.tick} d={A_FLUTES.map((x, i) => `M${r2(x)} 285v${i % 5 === 0 ? 4 : 2.2}`).join("")} />
          <Micro x={83} y={303}>one account</Micro>
          <Label x={198} y={26} text="Swap" w={36} />
          <Cross x={20} y={24} /><Cross x={400} y={300} />
        </>
      }
    />
  );
}

// ── Intelligence: a fluted glass block with a machined core seen end-on. The request falls in as a ray, broken by the
// flutes on its way to the core; under the block the signed proof slides out as a green glass tile.
const I_FLUTES = flutes(100, 300, 18);
function Intelligence() {
  const a: P = [8, 52], b: P = [200, 131.5];
  return (
    <Frame
      src="lamella-flat-intelligence"
      under={
        <>
          <path className={s.field} d={seg(a, b, 8, 100)} />
          <path className={s.field} d={refract(a, b, I_FLUTES.filter((x) => x <= 212), -2.2)} />
          {[-7, 7].map((o) => <path key={o} className={s.faint} d={seg([8, 52 + o], [200, 131.5 + o], 30, 100)} />)}
          {/* the signed trace from the core down into the tile */}
          <path className={s.green} d="M200 197V236" />
        </>
      }
      over={
        <>
          <circle className={s.inkFill} cx="8" cy="52" r="1.6" />
          <circle className={s.hair} cx="200" cy="131.5" r="5" />
          <Cross x={200} y={131.5} r={9} />
          <path className={s.faint} d="M100 236H300" />
          <path className={s.tick} d={I_FLUTES.map((x, i) => `M${r2(x)} 236v${i % 3 === 0 ? 4 : 2.2}`).join("")} />
          <path className={s.faint} d="M93 30V229" />
          <path className={s.tick} d={ticks([93, 30], [93, 229], 20, 2, 5, 4)} />
          <Micro x={8} y={40}>request</Micro>
          <path className={s.faint} d="M238 252h10" />
          <Label x={252} y={256} text="Signed proof" w={84} />
          <Cross x={402} y={24} /><Cross x={20} y={292} />
        </>
      }
    />
  );
}

// ── Identity: a fluted glass badge hanging from the green ring, both face-on, the name on the badge. The old ring stands
// as a dashed ghost beside the new one on a shared axis, and a graduated arc round the green ring is the single
// rotation. A few fine lines pass behind the badge and break flute by flute.
const ID_FLUTES = flutes(136, 244, 12);
const ID_RING: P = [185, 57.5], ID_GHOST: P = [262, 57.5];
export function FlatIdentity() {
  const grad = Array.from({ length: 9 }, (_, i) => -100 + i * 10).map((d, i) => {
    const p = onC(ID_RING, 40, d), q = onC(ID_RING, i % 3 === 0 ? 44 : 42.4, d);
    return `M${p.map(r2).join(" ")}L${q.map(r2).join(" ")}`;
  }).join("");
  const [a0, a1] = [onC(ID_RING, 40, -18), onC(ID_RING, 40, -96)];
  return (
    <Frame
      src="lamella-flat-identity"
      under={
        <>
          {[232, 240, 248, 256, 264].map((y, i) => {
            const a: P = [112, y], b: P = [268, y + 9];
            return (
              <g key={i}>
                <path className={s.field} d={seg(a, b, 112 + i * 3, 135)} />
                <path className={s.field} d={refract(a, b, ID_FLUTES, -2.4, 0.35)} />
                <path className={s.field} d={seg(a, b, 245, 268 - i * 3)} />
              </g>
            );
          })}
        </>
      }
      over={
        <>
          {/* the old ring, ghosted beside the new one on a shared axis */}
          <circle className={s.ghost} cx={ID_GHOST[0]} cy={ID_GHOST[1]} r="32.5" />
          <circle className={s.ghost} cx={ID_GHOST[0]} cy={ID_GHOST[1]} r="26" />
          <path className={s.edge} d={`M${ID_RING[0]} ${ID_RING[1]}H${ID_GHOST[0] + 40}`} />
          {/* the single rotation: a graduated arc round the green ring */}
          <path className={s.hair} d={`M${a0.map(r2).join(" ")}A40 40 0 0 0 ${a1.map(r2).join(" ")}`} />
          <path className={s.tick} d={grad} />
          <path className={s.hair} d={`M${r2(a1[0] + 4.6)} ${r2(a1[1] - 2.2)}L${a1.map(r2).join(" ")}L${r2(a1[0] + 4.2)} ${r2(a1[1] + 2.8)}`} />
          {/* the name, on the badge */}
          <text className={s.name} x="190" y="186" textAnchor="middle">your-name</text>
          <text className={`${s.name} ${s.near}`} x="190" y="203" textAnchor="middle">.near</text>
          <path className={s.faint} d="M129 108V282" />
          <path className={s.tick} d={ticks([129, 108], [129, 282], 29, 2, 5, 4)} />
          <Micro x={268} y={116}>single rotation</Micro>
          <Cross x={24} y={24} /><Cross x={398} y={292} />
        </>
      }
    />
  );
}

const ART: Record<OwnKey, () => ReactNode> = { data: Data, assets: Assets, intelligence: Intelligence, identity: FlatIdentity };
function Art({ which }: { which: OwnKey }) {
  const Station = ART[which];
  return <Station />;
}

export const style: StyleDef = {
  key: "lamella-flat",
  name: "Lamella, front-on",
  refs: "ManvsMachine, Microsoft Pixel R&D; the original Own-your drawings",
  summary:
    "Lamella turned flat to camera: each station is a front elevation in fluted glass and neutral metal with one green part, laid out like the original drawings: a note under a fluted pane, a deck of glass cards with two discs, a fluted block over a machined core, a fluted badge hanging from a green ring. Fine lines break flute by flute as they pass behind the glass, with micro tick scales along the edges.",
  motion:
    "The lines draw on from the left and break into the flutes' rhythm as they cross the glass, and the green part makes its one small move: the tile slides out, the arc lands on the green disc, the ring turns into place.",
  Art,
};
