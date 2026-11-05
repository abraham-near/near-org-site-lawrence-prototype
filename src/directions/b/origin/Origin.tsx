import type React from "react";
import { InView } from "../InView";
import s from "./Origin.module.css";

// Direction B, Origin (spec/pages/home.md §5; copy verbatim, F18). The figure is attention itself, drawn: sixteen tokens
// along a line, every one weighing in on one point by a hairline; from that point a single green line runs on. A strip
// of reeded glass stands across the converging lines and bends them where they pass behind it (real refraction in
// Chromium, frost elsewhere), the page's material meeting its vector. The hairlines fade on once, in from the edges.
const TOKENS = Array.from({ length: 16 }, (_, i) => i);
const X = (i: number) => 28 + i * 22.9;
const P = { x: 200, y: 392 };

export function Origin() {
  return (
    <section id="origin" className={s.origin} aria-labelledby="b-origin-title" data-inview>
      <div className={s.inner}>
        <figure className={s.figure} aria-hidden="true">
          <svg className={s.diagram} viewBox="0 0 400 500" preserveAspectRatio="xMidYMid meet" focusable="false">
            {/* a fine scale under the tokens */}
            <path className={s.scale} d={`M20 76H380${TOKENS.map((i) => `M${X(i).toFixed(1)} 76v${i % 4 === 0 ? 7 : 4}`).join("")}`} />
            {TOKENS.map((i) => (
              <g key={i} style={{ "--d": `${Math.abs(i - 7.5) * 45}ms` } as React.CSSProperties} className={s.tok}>
                <rect x={X(i) - 4} y="52" width="8" height="8" className={i === 11 ? s.tokOn : undefined} />
                <line x1={X(i)} y1="64" x2={P.x} y2={P.y} />
              </g>
            ))}
            <circle cx={P.x} cy={P.y} r="14" className={s.ring} />
            <circle cx={P.x} cy={P.y} r="5" className={s.point} />
            <line x1={P.x} y1={P.y + 5} x2={P.x} y2="500" className={s.beam} />
          </svg>
          <span className={s.strip} />
        </figure>
        <div className={s.body}>
          <h2 id="b-origin-title" className={`t-h2 ${s.title}`}>
            Built by people who helped <span className="accent">invent modern AI</span>
          </h2>
          <p className={`t-lede ${s.lede}`}>
            NEAR began in 2017 as an AI lab. <span className={s.nowrap}>Co-founder</span> <span className={s.nowrap}>Illia Polosukhin</span> <span className={s.nowrap}>co-authored</span> &ldquo;Attention Is All You
            Need&rdquo;, the paper that introduced the Transformer behind today&rsquo;s AI models. NEAR exists so the next era of AI is owned&nbsp;by&nbsp;its&nbsp;users.
          </p>
          <p className={s.cta}><a className="btn btn-secondary" href="/about">Our story</a></p>
        </div>
      </div>
      <InView />
    </section>
  );
}
