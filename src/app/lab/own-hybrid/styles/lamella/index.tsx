import type { ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../../../own-styles/styles/types";
import s from "./lamella.module.css";
import { Cross, Frame, Label, Micro, flutes, r2, refract, seg, ticks } from "./parts";
import type { P } from "./parts";
import { FlatIdentity } from "../lamella-flat";

// "Lamella" (D54, after ManvsMachine's Microsoft Pixel R&D). Each station is one rendered object in fluted glass and
// neutral metal with a single green part (Higgsfield stills, assets/generated/2026-11-04_own-hybrid/lamella/), set in
// a field of hairlines registered to it. Lines that pass behind the glass are drawn the way fluted glass shows them:
// each flute is a small cylindrical lens that mirrors and stretches what sits behind it about its own centre, so a
// sloped line comes out broken into a rhythm of offset segments. Lines in front continue the glass's edges in its
// perspective and carry micro tick scales. Coordinates are measured off the renders on the 420 × 315 box.


// ── Data: a tall fluted pane with a frosted pane behind it. A field of fine lines in perspective comes in from the left
// carrying packets, passes behind the flutes and is broken into their rhythm, blurs into dots behind the frosted pane
// and leaves on the right as a quiet dot matrix: private.
const D_FLUTES = [130, 136.5, 143.5, 150, 157, 163.5, 171, 178, 184.5, 191.5, 199, 206.5, 210.5];
const D_VP: P = [600, 158];
const D_ROWS = Array.from({ length: 15 }, (_, i) => 70 + i * 12);
const D_PACKETS = [s.p1, "", s.p2, s.p3, "", s.p1, s.p3, "", s.p2, "", s.p1, s.p3, "", s.p2, s.p1];
const yAt = (y0: number, x: number) => D_VP[1] + (y0 - D_VP[1]) * ((D_VP[0] - x) / (D_VP[0] - 22));
function Data() {
  const top = (x: number) => 35 + (x - 125) * 0.1685, bot = (x: number) => 256 + (x - 125) * 0.2935;
  return (
    <Frame
      src="lamella-data"
      under={
        <>
          {/* behind the frosted pane the lines are only a blur, inside its silhouette */}
          <defs>
            <clipPath id="lamella-art-frost"><path d="M218 41L248 48V271L218 264Z" /></clipPath>
            <filter id="lamella-art-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.3" /></filter>
          </defs>
          {D_ROWS.map((y0, i) => {
            const a: P = [22, y0];
            return (
              <g key={i}>
                <path className={`${s.field} ${D_PACKETS[i]}`} d={seg(a, D_VP, 22 + (i % 3) * 4, 124)} />
                <path className={s.field} d={refract(a, D_VP, D_FLUTES)} />
                <path className={s.field} d={seg(a, D_VP, 214, 252)} clipPath="url(#lamella-art-frost)" filter="url(#lamella-art-blur)" />
              </g>
            );
          })}
        </>
      }
      over={
        <>
          {/* the dot matrix the lines leave as: columns on a fixed pitch, thinning out */}
          {D_ROWS.map((y0, i) => (
            <g key={i}>
              {Array.from({ length: 15 }, (_, j) => <circle key={j} className={s.dot} cx={256 + j * 6} cy={r2(yAt(y0, 256 + j * 6))} r="0.8" fillOpacity={r2(1 - j / 16)} />)}
            </g>
          ))}
          {/* the panes' edges continued in their perspective */}
          <path className={s.edge} d={`M60 ${r2(top(60))}L123 ${r2(top(123))}M60 ${r2(bot(60))}L123 ${r2(bot(123))}M250 48.5L330 ${r2(48.5 + 80 * 0.229)}`} />
          {/* a tick at every flute along the foot of the pane, and a fine scale up its near edge */}
          <path className={s.faint} d={`M125 ${r2(bot(125) + 6)}L217 ${r2(bot(217) + 6)}`} />
          <path className={s.tick} d={[125, ...D_FLUTES, 217].map((x, i) => `M${x} ${r2(bot(x) + 6)}v${i % 4 === 0 ? 4 : 2.2}`).join("")} />
          <path className={s.faint} d="M117 40V250" />
          <path className={s.tick} d={ticks([117, 40], [117, 250], 21, 2, 5, 4)} />
          <Micro x={12} y={58}>Transactions</Micro>
          <path className={s.faint} d="M256 92h90M256 92v3M346 92v3" />
          <Label x={256} y={80} text="Private" w={50} />
          <Cross x={398} y={20} /><Cross x={398} y={292} />
        </>
      }
    />
  );
}

// ── Assets: one account as a fluted glass tray holding two discs on edge, silver and green. The swap is an arc from
// one to the other. A hairline field runs along the tray in its perspective, passes behind its fluted front and comes
// through in the flutes' rhythm; a fine scale runs under its foot.
const A_FLUTES = flutes(52, 386, 62);
const A_TOP = (x: number) => 212 - (x - 80) * 0.105, A_BOT = (x: number) => 282 - (x - 80) * 0.187;
function Assets() {
  const rows = [0.16, 0.3, 0.44, 0.58, 0.72, 0.86];
  return (
    <Frame
      src="lamella-assets"
      under={
        <>
          {rows.map((f, i) => {
            const at = (x: number): P => [x, A_TOP(x) + f * (A_BOT(x) - A_TOP(x))];
            const a = at(100), b = at(300);
            return (
              <g key={i}>
                <path className={`${s.field} ${i % 2 ? s.p2 : s.p1}`} d={seg(a, b, 4 + (i % 3) * 5, 44)} />
                <path className={s.field} d={refract(a, b, A_FLUTES, -2.4, 0.35)} />
                <path className={s.field} d={seg(a, b, 394, 416)} />
              </g>
            );
          })}
        </>
      }
      over={
        <>
          {/* the swap: from the silver disc to the green one */}
          <path className={s.hair} d="M158 98C170 40 256 30 268 84" />
          <path className={s.hair} d="M263.6 79.6l4.4 4.4 1.4-6" />
          <circle className={s.inkFill} cx="158" cy="98" r="1.6" />
          {/* the tray's top and foot continued in perspective, and a fine scale under the foot */}
          <path className={s.edge} d={`M4 ${r2(A_TOP(4))}L30 ${r2(A_TOP(30))}M392 ${r2(A_TOP(392))}L416 ${r2(A_TOP(416))}`} />
          <path className={s.faint} d={`M120 ${r2(A_BOT(120) + 11)}L370 ${r2(A_BOT(370) + 11)}`} />
          <path className={s.tick} d={ticks([120, A_BOT(120) + 11], [370, A_BOT(370) + 11], 25, -2.2, 5, -4.2)} />
          <Micro x={22} y={300}>one account</Micro>
          <Label x={186} y={40} text="Swap" w={36} />
          <Cross x={20} y={24} /><Cross x={402} y={292} />
        </>
      }
    />
  );
}

// ── Intelligence: a sealed fluted glass cube with a machined core. The request comes in as one ray, broken by the
// flutes on its way to the core; what leaves is a signed trace in green, into the green glass seal.
const I_LEFT = flutes(81, 163, 13), I_RIGHT = flutes(163, 305, 17);
function Intelligence() {
  const a: P = [8, 150], b: P = [305, 196];
  return (
    <Frame
      src="lamella-intelligence"
      under={
        <>
          <path className={s.field} d={seg(a, b, 8, 80)} />
          <path className={s.field} d={refract(a, b, I_LEFT, -1.8)} />
          <path className={s.field} d={refract(a, b, I_RIGHT, -1.8)} />
          {[-6, 6].map((o) => <path key={o} className={s.faint} d={seg([8, 150 + o], [305, 196 + o * 0.4], 30, 80)} />)}
        </>
      }
      over={
        <>
          <circle className={s.inkFill} cx="8" cy="150" r="1.6" />
          {/* the signed trace out of the cube into the seal */}
          <path className={s.green} d="M305 196L322 198.6" />
          {/* the cube's foot continued toward its vanishing points, with a tick at every flute */}
          <path className={s.edge} d="M81 222L36 190.2M305 240L404 212.1" />
          <path className={s.tick} d={I_RIGHT.map((x) => { const y = 280 + (x - 163) * -0.282; return `M${r2(x)} ${r2(y + 5)}l0 2.5`; }).join("")} />
          <path className={s.faint} d={`M163 285L305 ${r2(245)}`} />
          {/* the core's centre */}
          <circle className={s.hair} cx="211" cy="164" r="5" />
          <Cross x={211} y={164} r={9} />
          <Micro x={8} y={138}>request</Micro>
          <path className={s.faint} d="M346 168V178" />
          <Label x={300} y={158} text="Signed proof" w={84} />
          <Cross x={404} y={24} />
        </>
      }
    />
  );
}

// ── Identity (D55): flat to camera, shared with "Lamella, front-on": a fluted glass badge hanging from the green ring
// seen face-on, the name on the badge, the old ring as a ghost beside it and the single rotation as an arc between.
const Identity = FlatIdentity;

const ART: Record<OwnKey, () => ReactNode> = { data: Data, assets: Assets, intelligence: Intelligence, identity: Identity };
function Art({ which }: { which: OwnKey }) {
  const Station = ART[which];
  return <Station />;
}

export const style: StyleDef = {
  key: "lamella",
  name: "Lamella",
  refs: "ManvsMachine, Microsoft Pixel R&D",
  summary:
    "Fluted glass lamellae as the one material: panes, a tray, a cube and a disc of ribbed glass whose edges split the light into thin prismatic fringes, over silver and white with a single green part. Fine hairline fields pass behind the glass and come out broken into the flutes’ rhythm, the way reeded glass really bends a line; the glass’s edges carry on as perspective lines with micro tick scales.",
  motion:
    "The hairline fields draw on from the left and break into rhythm as they reach the glass, while the render turns a few degrees so the prismatic fringes slide across the flutes.",
  Art,
};
