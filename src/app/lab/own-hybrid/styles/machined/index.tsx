import type { ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../../../own-styles/styles/types";
import s from "./machined.module.css";

// "Machined" (D54, after FutureDeluxe for Nothing and Teenage Engineering exploded drawings). Each station is a small
// object in bead-blasted aluminium with clear glass and one anodised green part, rendered as an exploded assembly
// (Higgsfield stills, assets/generated/2026-11-04_own-hybrid/machined/), and drawn over as an engineering sheet: dashed
// assembly axes that run behind the parts in the render's perspective, leader callouts to the copy's own words, the
// outlines of parts that aren't rendered (ghosted), dimension marks. Coordinates are measured off the renders on the
// 420 × 315 box.

type P = [number, number];
const r2 = (n: number) => Math.round(n * 100) / 100;
const pt = (p: P) => `${r2(p[0])} ${r2(p[1])}`;

// A point on an axis-aligned ellipse at angle t (degrees, 0 = right, 90 = toward the viewer)
const onE = (c: P, rx: number, ry: number, t: number): P => [c[0] + rx * Math.cos((t * Math.PI) / 180), c[1] + ry * Math.sin((t * Math.PI) / 180)];
const ellipse = (c: P, rx: number, ry: number) => `M${pt(onE(c, rx, ry, 180))}A${rx} ${ry} 0 1 1 ${pt(onE(c, rx, ry, 0))}A${rx} ${ry} 0 1 1 ${pt(onE(c, rx, ry, 180))}`;
// An arc of the same ellipse from t0 to t1 (increasing = clockwise on screen)
const arc = (c: P, rx: number, ry: number, t0: number, t1: number) => `M${pt(onE(c, rx, ry, t0))}A${rx} ${ry} 0 ${Math.abs(t1 - t0) > 180 ? 1 : 0} ${t1 > t0 ? 1 : 0} ${pt(onE(c, rx, ry, t1))}`;
// An open arrowhead at `tip`, pointing along the direction (dx, dy)
function head(tip: P, dx: number, dy: number, size = 3.2) {
  const L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const b = (k: number): P => [tip[0] - ux * size + nx * size * 0.55 * k, tip[1] - uy * size + ny * size * 0.55 * k];
  return `M${pt(b(1))}L${pt(tip)}L${pt(b(-1))}`;
}
const poly = (pts: P[]) => `M${pts.map(pt).join("L")}Z`;

// A leader: a node on the part, a hairline to the elbow, a short shoulder, then the copy's words (one or two lines)
function Callout({ at, elbow, side, lines }: { at: P; elbow: P; side: "l" | "r"; lines: string[] }) {
  const k = side === "l" ? -1 : 1, end = elbow[0] + 9 * k, tx = end + 3 * k;
  return (
    <g>
      <path className={s.leader} d={`M${pt(at)}L${pt(elbow)}H${r2(end)}`} />
      <circle className={s.node} cx={at[0]} cy={at[1]} r="1.5" />
      {lines.map((l, i) => (
        <text key={l} className={s.micro} x={r2(tx)} y={r2(elbow[1] + 4.5 + (i - (lines.length - 1) / 2) * 14)} textAnchor={side === "l" ? "end" : "start"}>{l}</text>
      ))}
    </g>
  );
}
// The fact: an ink pill with a green dot
const Pill = ({ x, y, text, w }: { x: number; y: number; text: string; w: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect className={s.pill} x="0" y="0" width={w + 27} height="21" rx="10.5" />
    <circle className={s.gDot} cx="11" cy="10.5" r="3" />
    <text className={s.pillText} x="19.5" y="15">{text}</text>
  </g>
);
// A dimension line: vertical at x through the given levels, with end ticks, and dotted projection lines to the parts
function Dimension({ x, levels }: { x: number; levels: { y: number; from: number }[] }) {
  const ys = levels.map((l) => l.y);
  return (
    <g>
      <path className={s.faint} d={levels.map((l) => `M${r2(l.from)} ${r2(l.y)}H${r2(x)}`).join("")} />
      <path className={s.hair} d={`M${x} ${Math.min(...ys)}V${Math.max(...ys)}`} />
      <path className={s.tick} d={ys.map((y) => `M${x - 3} ${y + 3}l6 -6`).join("")} />
    </g>
  );
}
const Cross = ({ x, y, r = 4 }: { x: number; y: number; r?: number }) => (
  <path className={s.hair} d={`M${x - r} ${y}h${r - 1.2}M${x + 1.2} ${y}h${r - 1.2}M${x} ${y - r}v${r - 1.2}M${x} ${y + 1.2}v${r - 1.2}`} />
);

function Frame({ which, under, over }: { which: OwnKey; under: ReactNode; over: ReactNode }) {
  return (
    <div className={s.art} aria-hidden="true">
      <svg viewBox="0 0 420 315" focusable="false">{under}</svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.render} src={`/lab/own-hybrid/machined-${which}.webp`} alt="" draggable={false} />
      <svg viewBox="0 0 420 315" focusable="false">{over}</svg>
    </div>
  );
}

// ── Data: a sealed device exploded along its axis: perforated plate, frosted glass, the green gasket, the housing.
// Fine lines come down from the ghosted sheet above onto the plate; under the frosted glass they go on only as dots,
// seen dimly through it: what passes the glass is private. The gasket is the seal.
// The plate's and the glass's top faces as parallelograms (corner L, then the edges toward the back and the front)
const D_PLATE = { L: [103.3, 66.4] as P, T: [190, 28.3] as P, B: [190, 104.4] as P };
const D_GLASS = { L: [103.3, 113] as P, T: [190, 74.5] as P, B: [190, 152] as P };
const onFace = (f: { L: P; T: P; B: P }, u: number, v: number): P => [f.L[0] + u * (f.T[0] - f.L[0]) + v * (f.B[0] - f.L[0]), f.L[1] + u * (f.T[1] - f.L[1]) + v * (f.B[1] - f.L[1])];
const D_UV = [0.18, 0.34, 0.5, 0.66, 0.82].flatMap((u) => [0.18, 0.34, 0.5, 0.66, 0.82].map((v) => [u, v] as P));
function Data() {
  return (
    <Frame
      which="data"
      under={
        <>
          <path className={s.axis} d="M188.6 2V304M112 44V222M265 44V222" />
          {/* the ghosted sheet above the plate: the transactions, before the glass */}
          <path className={s.ghost} d={poly([[103, 42], [190, 4], [276, 41], [190, 80]])} />
          {/* under the frosted glass: only dots, dropping toward the gasket */}
          {D_UV.map(([u, v], i) => {
            const p = onFace(D_GLASS, u, v);
            return <g key={i}>{[7, 13, 19, 25, 31].map((dy, j) => <circle key={j} className={s.ink} cx={r2(p[0])} cy={r2(p[1] + dy)} r="0.65" fillOpacity={r2(0.9 - j * 0.15)} />)}</g>;
          })}
        </>
      }
      over={
        <>
          {/* the data: fine lines from the sheet down onto the plate */}
          <path className={s.hair} d={D_UV.map(([u, v], i) => { const p = onFace(D_PLATE, u, v); return `M${pt([p[0], p[1] - 24 + (i % 3) * 3])}L${pt(p)}`; }).join("")} />
          {D_UV.map(([u, v], i) => { const p = onFace(D_PLATE, u, v); return <circle key={i} className={s.ink} cx={r2(p[0])} cy={r2(p[1])} r="0.7" />; })}
          <Callout at={[250, 29.8]} elbow={[292, 22]} side="r" lines={["Transactions"]} />
          <Callout at={[250, 123.7]} elbow={[292, 128]} side="r" lines={["confidential"]} />
          <path className={s.leader} d="M250 164L292 176H298" />
          <circle className={s.node} cx="250" cy="164" r="1.5" />
          <Pill x={298} y={165.5} text="Private" w={47} />
          <Dimension x={58} levels={[{ y: 66, from: 100 }, { y: 111, from: 100 }, { y: 153, from: 104 }, { y: 214, from: 100 }]} />
          <Cross x={404} y={294} /><Cross x={22} y={294} />
        </>
      }
    />
  );
}

// ── Assets: one account as a machined tray with two pockets; two coins exploded above it, silver and green, and the
// glass lid above them. The swap is an orbit round both coins in their plane: out along the front to green, back along
// the far side to silver; the coins' seats are ghosted in the pockets.
const ORB: P = [202, 165];
function Assets() {
  return (
    <Frame
      which="assets"
      under={
        <>
          <path className={s.axis} d="M90.5 54V106M126.7 94V142M314 64V114M267 28V72M150.3 128V232M254.4 124V222" />
          <path className={s.ghost} d={arc(ORB, 128, 26, 180, 360)} />
        </>
      }
      over={
        <>
          <path className={s.ghost} d={ellipse([153, 221.4], 43, 14.5)} />
          <path className={s.ghost} d={ellipse([255.8, 211.7], 41.7, 14)} />
          <path className={s.hair} d={arc(ORB, 128, 26, 180, 0)} />
          <path className={s.hair} d={head(onE(ORB, 128, 26, 20), 128 * Math.sin(Math.PI / 9), -26 * Math.cos(Math.PI / 9))} />
          <path className={s.hair} d={head(onE(ORB, 128, 26, 200), -128 * Math.sin(Math.PI / 9), 26 * Math.cos(Math.PI / 9))} />
          <Callout at={[110, 172]} elbow={[62, 186]} side="l" lines={["Hold"]} />
          <Callout at={[297, 160]} elbow={[340, 146]} side="r" lines={["move"]} />
          <Callout at={[118, 262]} elbow={[84, 280]} side="l" lines={["one", "account"]} />
          <path className={s.leader} d={`M${pt(onE(ORB, 128, 26, 62))}L330 207H336`} />
          <circle className={s.node} cx={r2(onE(ORB, 128, 26, 62)[0])} cy={r2(onE(ORB, 128, 26, 62)[1])} r="1.5" />
          <Pill x={336} y={196.5} text="Swap" w={36} />
          <Cross x={22} y={22} /><Cross x={402} y={296} />
        </>
      }
    />
  );
}

// ── Intelligence: a sealed enclosure exploded: screws, a glass window, its frame, the core (a plain machined cube),
// the housing. The request comes down the assembly axis through the glass; the cube's seat in the housing is ghosted;
// out of a slot in the side, on its own axis, the proof leaves as a green anodised tag.
const I_AXIS = { a: [210.6, 236.5] as P, b: [268, 250] as P };
function Intelligence() {
  const m = (I_AXIS.b[1] - I_AXIS.a[1]) / (I_AXIS.b[0] - I_AXIS.a[0]);
  return (
    <Frame
      which="intelligence"
      under={
        <>
          <path className={s.axis} d="M164 14V304M114.1 54L112 222M213.5 55L216 222M160 34L163 206M170.9 76V96" />
          <path className={s.axis} d={`M${pt(I_AXIS.a)}L314 ${r2(I_AXIS.a[1] + m * (314 - I_AXIS.a[0]))}`} />
        </>
      }
      over={
        <>
          <path className={s.hair} d={head([164, 44], 0, 1, 3.6)} />
          <text className={s.micro} x="170" y="22">request</text>
          {/* the core's seat in the housing, ghosted */}
          <path className={s.ghost} d={poly([[131, 225], [164, 209], [197, 225], [164, 241]])} />
          <Callout at={[132, 186]} elbow={[96, 200]} side="l" lines={["hardware", "enclaves"]} />
          <path className={s.leader} d={`M${pt([301, I_AXIS.a[1] + m * (301 - I_AXIS.a[0])])}L312 280`} />
          <circle className={s.node} cx="301" cy={r2(I_AXIS.a[1] + m * (301 - I_AXIS.a[0]))} r="1.5" />
          <Pill x={306} y={278} text="Signed proof" w={80} />
          <Dimension x={244} levels={[{ y: 80.6, from: 230 }, { y: 118.8, from: 229 }, { y: 155.6, from: 202 }]} />
          <Cross x={30} y={24} /><Cross x={402} y={24} />
        </>
      }
    />
  );
}

// ── Identity: a rotary assembly on one axis: glass disc, knurled ring, the green ring (the new key), the base, with
// the name engraved round its side. The old ring stands ghosted beside it on an exploded axis, and the single rotation
// is a graduated arc round the green ring.
const ROT: P = [190, 156];
function Identity() {
  const name = arc([190.5, 251.5], 80, 26.5, 160, 20);
  const grad = Array.from({ length: 16 }, (_, i) => -10 + i * 5).map((t) => {
    const a = onE(ROT, 86, 29, t), r = (t * Math.PI) / 180, nx = 29 * Math.cos(r), ny = 86 * Math.sin(r), L = Math.hypot(nx, ny);
    const k = t % 15 === 0 ? 3.6 : 2;
    return `M${pt(a)}l${r2((nx / L) * k)} ${r2((ny / L) * k)}`;
  }).join("");
  return (
    <Frame
      which="identity"
      under={
        <path className={s.axis} d="M189.7 8V306M130.9 206V222M252.9 206V222M190 156H338" />
      }
      over={
        <>
          {/* the old ring, ghosted, out on its own axis */}
          <path className={s.ghost} d={ellipse([338, 156], 79, 24)} />
          <path className={s.ghost} d={ellipse([338, 156], 71.5, 19.5)} />
          {/* the single rotation: a graduated arc round the green ring, in its plane */}
          <path className={s.hair} d={arc(ROT, 86, 29, -12, 78)} />
          <path className={s.tick} d={grad} />
          <path className={s.hair} d={head(onE(ROT, 86, 29, 78), -86 * Math.sin((78 * Math.PI) / 180), 29 * Math.cos((78 * Math.PI) / 180))} />
          {/* the name, engraved round the base */}
          <path id="machined-art-name-path" d={name} fill="none" />
          <text className={s.nameLip} dy="0.6"><textPath href="#machined-art-name-path" startOffset="50%" textAnchor="middle">your-name.near</textPath></text>
          <text className={s.name}><textPath href="#machined-art-name-path" startOffset="50%" textAnchor="middle">your-name<tspan className={s.near}>.near</tspan></textPath></text>
          <Callout at={[112, 160]} elbow={[90, 140]} side="l" lines={["post-", "quantum", "keys"]} />
          <Callout at={onE(ROT, 86, 29, 40)} elbow={[300, 214]} side="r" lines={["single", "rotation"]} />
          <path className={s.leader} d="M270 262L292 280H296" />
          <circle className={s.node} cx="270" cy="262" r="1.5" />
          <Pill x={296} y={269.5} text="35+ chains" w={68} />
          <Cross x={24} y={22} /><Cross x={400} y={22} />
        </>
      }
    />
  );
}

const ART: Record<OwnKey, () => ReactNode> = { data: Data, assets: Assets, intelligence: Intelligence, identity: Identity };
function Art({ which }: { which: OwnKey }) {
  const Station = ART[which];
  return <Station />;
}

export const style: StyleDef = {
  key: "machined",
  name: "Machined",
  refs: "FutureDeluxe for Nothing; Teenage Engineering-style exploded drawings",
  summary:
    "Each idea is a small, precisely engineered object in bead-blasted aluminium with clear glass, micro screws and fine grilles, one part anodised green, rendered as an exploded assembly in white studio light. Over it runs the engineering sheet: dashed assembly axes in the render's perspective, leader callouts to the copy's own words in tiny mono, ghosted outlines of parts that aren't rendered, and dimension marks.",
  motion:
    "The parts slide together along their axes as the axes draw on, then part again slightly, and each callout's leader draws out to its word once its part has settled.",
  Art,
};
