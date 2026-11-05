import type React from "react";
import { RulerX } from "../graphics/Ruler";
import { Node } from "../graphics/Marks";
import s from "../graphics/survey.module.css";
import o from "./Origin.module.css";

// Direction A, Origin (research/dir-a.md §5.6). Copy verbatim from components/home/origin/Origin.tsx (F18). In place of
// the photograph, a drawn figure of attention, the idea the paper named: two rows of tokens, each in the lower row
// joined to the tokens it attends to by hairlines whose strength is their weight; one token's attention is picked out
// in green. It draws on when it comes into view. Under it, a ruler from 2017 (the AI lab, F18) through 2020 (mainnet,
// F8) to today, its end marked. Decorative: the account carries the meaning.

const N = 14, W = 600, X0 = 20, GAP = (W - 2 * X0) / (N - 1), TOP = 24, BOT = 196;
const rnd = (i: number, j: number) => { const v = Math.sin(i * 91.7 + j * 37.3) * 43758.5453; return v - Math.floor(v); };
const PICK = 9; // the token whose attention is shown in green
const links: { i: number; j: number; w: number }[] = [];
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
  const near = Math.exp(-((i - j) ** 2) / 6), far = i === PICK && (j === 2 || j === 4) ? 0.9 : 0;
  const w = Math.max(near * (0.35 + 0.65 * rnd(i, j)), far);
  if (w > 0.28) links.push({ i, j, w });
}

export function Origin() {
  return (
    <section id="origin" className={`${o.origin} ${s.sheet}`} aria-labelledby="a-origin-title">
      <div className={o.inner}>
        <h2 id="a-origin-title" className={`t-h2 ${o.title}`}>
          Built by people who helped <span className="accent">invent modern AI</span>
        </h2>

        <figure className={o.figure} aria-hidden="true" data-a-watch="0.35">
          <svg viewBox={`0 0 ${W} 300`} className={o.svg} focusable="false">
            {links.map(({ i, j, w }, k) => {
              const green = i === PICK;
              return (
                <path key={k} className={`${green ? s.green : s.ink} ${s.draw}`} pathLength={1}
                  d={`M${X0 + i * GAP} ${BOT}C${X0 + i * GAP} ${(TOP + BOT) / 2} ${X0 + j * GAP} ${(TOP + BOT) / 2} ${X0 + j * GAP} ${TOP}`}
                  style={{ strokeOpacity: green ? 1 : (w * 0.5).toFixed(2), strokeWidth: green ? 1.25 : 1, "--d": `${(green ? 1300 : 200) + i * 50}ms`, "--a-dur": "1.6s" } as React.CSSProperties} />
              );
            })}
            {Array.from({ length: N }, (_, k) => (
              <g key={k}>
                <Node x={X0 + k * GAP} y={TOP} size={6} delay={k * 30} />
                <Node x={X0 + k * GAP} y={BOT} size={6} delay={k * 30} green={k === PICK} pulse={k === PICK} />
              </g>
            ))}
            {/* 2017 to now: a tick per quarter, a long one per year */}
            <RulerX count={40} gap={(W - 2 * X0) / 39} major={4} minor={0} majorH={10} x={X0} y={256} step={10} delay={600} green={[0, 12, 39]} />
            {/* the ruler's end: today */}
            <Node x={W - X0} y={256} size={6} green delay={1100} />
          </svg>
          <div className={o.years}>
            <p style={{ "--at": 0 } as React.CSSProperties}><span className={s.num}>2017</span> An AI lab</p>
            <p style={{ "--at": 12 / 39 } as React.CSSProperties}><span className={s.num}>2020</span> Mainnet</p>
            <p className={o.end} style={{ "--at": 1 } as React.CSSProperties}><span>Today</span></p>
          </div>
        </figure>

        <div className={o.body}>
          <p className="t-lede">
            NEAR began in 2017 as an AI lab. <span className={o.nowrap}>Co-founder</span> <span className={o.nowrap}>Illia Polosukhin</span> <span className={o.nowrap}>co-authored</span> &ldquo;Attention Is All You
            Need&rdquo;, the paper that introduced the Transformer behind today&rsquo;s AI models. NEAR exists so the next era of AI is owned&nbsp;by&nbsp;its&nbsp;users.
          </p>
          <p className={o.cta}><a className="btn btn-secondary" href="/about">Our story</a></p>
        </div>
      </div>
    </section>
  );
}
