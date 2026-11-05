import type React from "react";
import Image from "next/image";
import { contours } from "../graphics/contours";
import { CloseForm } from "./CloseForm";
import s from "../graphics/survey.module.css";
import c from "./Close.module.css";

// Direction A, Close (research/dir-a.md §5.9): "NEAR belongs to *you*" as the survey's last sheet. A few contours
// (procedural, contours.ts; every fourth an index contour) and the sheet's graticule crosses, kept clear of the copy by a
// mask; the page's traverse arrives along the foot of the sheet with its chainage ticks and climbs to one green "you are
// here" node on the summit, inside a ticked bearing ring. Everything draws on once. Then the N tile, the line and the newsletter pill
// (D22; behaviour as components/home/close/NewsletterForm.tsx). Copy verbatim (v4).
const W = 1312, H = 620;
const SUMMIT: [number, number] = [W * 0.82, H * 0.3];
const LINES = contours({
  w: W, h: H, cell: 12, scale: 340, levels: 8, seed: 7,
  // a summit at the node, so the rings close around "you"
  bias: (x, y) => 0.55 * Math.exp(-((x - SUMMIT[0]) ** 2 + (y - SUMMIT[1]) ** 2) / (2 * 150 ** 2)),
});

// The traverse: in from the left along the foot of the sheet, then up to the summit; ticks every 24 units
const FOOT = H * 0.93;
const LEG = { x0: 0, x1: SUMMIT[0], y0: FOOT, y1: SUMMIT[1] + 52 };
const TICKS = [
  ...Array.from({ length: Math.floor(LEG.x1 / 24) }, (_, k) => `M${k * 24} ${FOOT}v${k % 5 === 0 ? 9 : 5}`),
  ...Array.from({ length: Math.floor((FOOT - LEG.y1) / 24) }, (_, k) => `M${LEG.x1} ${FOOT - (k + 1) * 24}h${k % 5 === 4 ? -9 : -5}`),
];
// The graticule: a cross every 96 units
const CROSSES = Array.from({ length: Math.ceil(W / 96) * Math.ceil(H / 96) }, (_, k) => [48 + (k % Math.ceil(W / 96)) * 96, 48 + Math.floor(k / Math.ceil(W / 96)) * 96]);

export function Close() {
  return (
    <section id="close" className={c.close} aria-labelledby="a-close-title">
      <div className={c.inner}>
        <div className={c.panel} data-a-watch="0.3">
          <svg className={c.terrain} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
            <g className={c.lines}>
              {LINES.map((l) => (
                <path key={l.level} d={l.d} className={`${l.level % 4 === 0 ? s.hair : s.faint} ${s.draw}`} pathLength={1}
                  style={{ "--d": `${l.level * 160}ms`, "--a-dur": "2.6s" } as React.CSSProperties} />
              ))}
              <path className={`${s.hair} ${s.fade}`} d={CROSSES.map(([x, y]) => `M${x - 4} ${y}h8M${x} ${y - 4}v8`).join("")} style={{ "--d": "300ms" } as React.CSSProperties} />
            </g>
            <path className={`${s.ink} ${s.draw}`} d={`M${LEG.x0} ${FOOT}H${LEG.x1}V${LEG.y1}`} pathLength={1} style={{ "--d": "600ms", "--a-dur": "2.2s" } as React.CSSProperties} />
            <path className={`${s.hair} ${s.fade}`} d={TICKS.join("")} style={{ "--d": "1400ms" } as React.CSSProperties} />
            <g transform={`translate(${SUMMIT[0]} ${SUMMIT[1]})`}>
              <circle r="46" className={`${s.hair} ${s.draw}`} pathLength={1} style={{ "--d": "1500ms" } as React.CSSProperties} />
              {Array.from({ length: 72 }, (_, k) => {
                const a = (k / 72) * Math.PI * 2, r2 = k % 18 === 0 ? 36 : k % 6 === 0 ? 40 : 43;
                return <line key={k} className={`${s.hair} ${s.fade}`} x1={Math.cos(a) * 46} y1={Math.sin(a) * 46} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} style={{ "--d": `${1700 + k * 12}ms` } as React.CSSProperties} />;
              })}
              <g className={s.pop} style={{ "--d": "2400ms" } as React.CSSProperties}>
                <path className={s.green} d="M-12 0H-4M4 0H12M0-12V-4M0 4V12" />
                <circle r="3" className={s.greenFill} />
              </g>
              <circle r="12" className={`${s.green} ${s.pulse}`} style={{ "--d": "2600ms" } as React.CSSProperties} />
            </g>
          </svg>
          <div className={c.copy}>
            <Image src="/brand/icon_tile.svg" alt="" width={56} height={56} className={c.mark} unoptimized />
            <h2 id="a-close-title" className={`t-h2 ${c.title}`}>NEAR belongs to <span className="accent">you</span></h2>
            <p className={`t-lede ${c.lede}`}>Get the latest product launches, protocol milestones, and ecosystem updates straight to your&nbsp;inbox.</p>
            <CloseForm />
          </div>
        </div>
      </div>
    </section>
  );
}
