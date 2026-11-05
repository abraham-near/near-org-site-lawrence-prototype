import { useId, type ReactNode } from "react";
import type { OwnKey } from "@/components/home/chapter-one/OwnArt";
import type { StyleDef } from "../types";
import s from "./window.module.css";

// "Window" (D53, after Arc'teryx, Simple Done Well and Synais): each object's main surface is a window of desaturated,
// graded photography (mist, rock, ridge, slate) clipped into its shape, with hairline outlines and viewfinder corners on
// top. Objects are flat vector (paper, ink); photography stays on the grey surfaces, and the only colour is the flat
// green "yours" element. Drawn on 240 × 180.

// Photos: site images and the stills generated for this style (assets/generated/2026-11-04_own-styles-window/)
const IMG = {
  mist: { href: "/lab/own-styles/own-window-mistforest-v1.webp", ar: 672 / 900 },
  granite: { href: "/lab/own-styles/own-window-granite-v1.webp", ar: 1 },
  slate: { href: "/lab/own-styles/own-window-basalt-v1.webp", ar: 1 },
  ridges: { href: "/images/home/home-hero-ridges-v2.webp", ar: 1080 / 1920 },
} as const;
type Img = keyof typeof IMG;

// A photo window: `shape` is the clip (any SVG shapes); the image is placed at x, y, w (its own aspect) and graded
function Photo({ id, shape, img, x, y, w }: { id: string; shape: ReactNode; img: Img; x: number; y: number; w: number }) {
  const { href, ar } = IMG[img];
  return (
    <>
      <clipPath id={id}>{shape}</clipPath>
      <g className={s.photo} clipPath={`url(#${id})`}>
        <image className={s.img} href={href} x={x} y={y} width={w} height={w * ar} preserveAspectRatio="xMidYMid slice" />
        <rect className={s.cool} x="0" y="0" width="240" height="180" />
      </g>
    </>
  );
}

// Viewfinder corners around a box, `o` outside it, arms `l` long
const Finder = ({ x, y, w, h, o = 6, l = 7 }: { x: number; y: number; w: number; h: number; o?: number; l?: number }) => {
  const x0 = x - o, y0 = y - o, x1 = x + w + o, y1 = y + h + o;
  return <path className={s.vf} d={`M${x0} ${y0 + l}V${y0}H${x0 + l}M${x1 - l} ${y0}H${x1}V${y0 + l}M${x1} ${y1 - l}V${y1}H${x1 - l}M${x0 + l} ${y1}H${x0}V${y1 - l}`} />;
};
// A small crosshair node
const Node = ({ x, y }: { x: number; y: number }) => <path className={s.hair} d={`M${x - 3} ${y}h6M${x} ${y - 3}v6`} />;
// Tags: paper labels in mono capitals with a green marker
const Tag = ({ x, y, w, text, mark = true }: { x: number; y: number; w: number; text: string; mark?: boolean }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect className={s.paper} width={w} height="18" />
    {mark && <rect className={s.g} x="7" y="6.5" width="5" height="5" />}
    <text className={s.label} x={mark ? 17 : w / 2} y="12.6" textAnchor={mark ? "start" : "middle"}>{text}</text>
  </g>
);

// Data: the note is a window onto forest in mist; its lines have become dots in the trees. "Private" tag.
const ROWS = [10, 11, 8, 10, 6];
function Data({ id }: { id: string }) {
  const doc = "M60 26h92l26 26v104H60z";
  return (
    <>
      <Photo id={`${id}d`} img="mist" x={34} y={4} w={210} shape={<path d={doc} />} />
      <path className={s.paper} d="M152 26v26h26z" />
      <path className={s.frame} d={doc} />
      <text className={s.micro} x="68" y="44">Prompts</text>
      <path className={s.faint} d="M68 50h76" />
      {ROWS.map((n, i) => Array.from({ length: n }, (_, j) => <circle key={`${i}-${j}`} className={s.dot} cx={72 + j * 8} cy={90 + i * 12} r="2" />))}
      <Finder x={60} y={26} w={118} h={130} />
      <Node x={44} y={91} />
      <Tag x={126} y={144} w={68} text="Private" />
    </>
  );
}

// Assets: one account. The front card is a window onto the ridges; the cards behind it are flat paper outlines. Two
// coins: a granite window, and the destination in flat green. A swap arc between them. "Swap" tag.
function Assets({ id }: { id: string }) {
  return (
    <>
      <rect className={s.paper} x="56" y="14" width="128" height="92" rx="5" />
      <rect className={s.paper} x="47" y="30" width="146" height="100" rx="5" />
      <Photo id={`${id}c1`} img="ridges" x={8} y={30} w={230} shape={<rect x="38" y="48" width="164" height="104" rx="6" />} />
      <rect className={s.frame} x="38" y="48" width="164" height="104" rx="6" />
      <rect x="48" y="58" width="20" height="15" rx="2.5" className={s.paper} />
      <path className={s.faint} d="M48 65.5h20M54.5 58v15M61.5 58v15" />
      <path className={s.halo} d="M94 140A34 34 0 0 1 146 140" />
      <path className={s.dash} d="M94 140A34 34 0 0 1 146 140" />
      <path className={s.halo} d="M142.6 134l3.4 6 4.2-4.6" />
      <path className={s.hair} d="M142.6 134l3.4 6 4.2-4.6" />
      <Photo id={`${id}a`} img="granite" x={58} y={136} w={44} shape={<circle cx="80" cy="154" r="14" />} />
      <circle className={s.frame} cx="80" cy="154" r="14" />
      <circle className={s.g} cx="160" cy="154" r="14" />
      <circle className={s.frame} cx="160" cy="154" r="14" />
      <circle className={s.hair} cx="160" cy="154" r="9" style={{ stroke: "var(--color-forest)", strokeOpacity: 0.6 }} />
      <Finder x={38} y={48} w={164} h={104} />
      <Tag x={100} y={98} w={40} text="Swap" mark={false} />
    </>
  );
}

// Intelligence: the enclave is a flat chip package (pins on every side) with a small window onto slate at its core,
// the sealed part. A message drops into its slot; a paper receipt comes out under it with a green seal. "Signed proof".
function Intelligence({ id }: { id: string }) {
  const pins = [76, 88, 100, 112, 124].map((y) => `M78 ${y}h-6M162 ${y}h6`).join("") + [92, 104, 116, 128, 140, 152].map((x) => `M${x} 136v6`).join("");
  return (
    <>
      <path className={s.paper} d="M100 126V166l5-3.5 5 3.5 5-3.5 5 3.5 5-3.5 5 3.5 5-3.5 5 3.5V126z" />
      <path className={s.soft} d="M107 146h22M107 154h14" />
      <circle className={s.g} cx="135" cy="152" r="6" />
      <circle className={s.hair} cx="135" cy="152" r="6" style={{ stroke: "var(--color-forest)" }} />
      <path className={s.check} d="M132.4 152.2l1.8 1.8 3.4-3.6" />
      <rect className={s.paper} x="78" y="62" width="84" height="74" rx="3" />
      <path className={s.hair} d={pins} />
      <Photo id={`${id}e`} img="slate" x={80} y={60} w={80} shape={<rect x="100" y="76" width="40" height="38" rx="1.5" />} />
      <rect className={s.frame} x="100" y="76" width="40" height="38" rx="1.5" />
      <Finder x={100} y={76} w={40} h={38} o={5} l={5} />
      <rect className={s.paper} x="108" y="58.5" width="24" height="3.5" rx="1" />
      <text className={s.micro} x="120" y="131" textAnchor="middle">Inference</text>
      <path className={s.paper} d="M104 10h32a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-10l-6 6-6-6h-10a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8z" />
      <circle className={s.ink} cx="111" cy="22" r="1.8" /><circle className={s.ink} cx="120" cy="22" r="1.8" /><circle className={s.ink} cx="129" cy="22" r="1.8" />
      <path className={s.dash} d="M120 44v10" />
      <Node x={46} y={40} /><Node x={194} y={40} />
      <Tag x={140} y={156} w={98} text="Signed proof" />
    </>
  );
}

// Identity: the badge's upper half is a window onto granite in mist (its "photo"), the name sits on paper below. On the
// key ring the old key turns away, dashed; the new key is flat green. "35+ chains" tag.
function Identity({ id }: { id: string }) {
  const top = "M78 50h84a8 8 0 0 1 8 8v46H70V58a8 8 0 0 1 8-8z";
  return (
    <>
      <rect className={s.paper} x="70" y="50" width="100" height="100" rx="8" />
      <Photo id={`${id}p`} img="granite" x={56} y={30} w={120} shape={<path d={top} />} />
      <path className={s.frame} d={top} />
      <rect className={s.frame} x="70" y="50" width="100" height="100" rx="8" />
      <rect className={s.paper} x="108" y="57" width="24" height="5" rx="2.5" />
      <text className={s.name} x="120" y="124" textAnchor="middle">your-name</text>
      <text className={`${s.name} ${s.muted}`} x="120" y="138" textAnchor="middle">.near</text>
      <circle className={s.hair} cx="120" cy="26" r="11" />
      <path className={s.hair} d="M120 37v13" />
      <g className={s.old} transform="rotate(-16 120 26)">
        <circle cx="147" cy="27" r="9" /><circle cx="147" cy="27" r="3" />
        <path d="M156 27h40M185 27v7M192 27v5" />
      </g>
      <ellipse className={s.hair} cx="136.5" cy="27" rx="6" ry="3" />
      <g className={s.g}>
        <circle cx="151" cy="27" r="9" /><rect x="158" y="25" width="42" height="4" />
        <rect x="188" y="28" width="3.5" height="8" /><rect x="195" y="28" width="3.5" height="6" />
      </g>
      <circle className={s.paper} cx="151" cy="27" r="3" />
      <text className={s.micro} x="158" y="44">post-quantum</text>
      <Finder x={70} y={50} w={100} h={56} o={4} l={6} />
      <Tag x={128} y={142} w={78} text="35+ chains" mark={false} />
    </>
  );
}

const ART = { data: Data, assets: Assets, intelligence: Intelligence, identity: Identity };

function WindowArt({ which }: { which: OwnKey }) {
  const id = useId().replace(/:/g, "");
  const Art = ART[which];
  return (
    <div className={s.art} aria-hidden="true">
      <svg viewBox="0 0 240 180" focusable="false"><Art id={`w${id}`} /></svg>
    </div>
  );
}

export const style: StyleDef = {
  key: "window",
  name: "Window",
  refs: "Arc'teryx, Simple Done Well, Synais",
  summary: "Flat paper-and-ink objects with windows cut into desaturated, cool-graded photography of mist, rock, ridge and slate, each framed by hairlines and viewfinder corners. The only colour is what's yours, in flat NEAR green: the coin, the seal, the new key.",
  motion: "The viewfinder corners close in and lock, the photo fades up inside its hairline frame, then the one change plays: the text dots appear, the green coin fills in at the end of the arc, the receipt slides out, the green key fades in as the old one turns away.",
  Art: WindowArt,
};
