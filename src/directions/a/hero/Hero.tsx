import type React from "react";
import Image from "next/image";
import { HeroVideo } from "@/components/home/chapter-one/HeroVideo";
import { HeroInView } from "@/components/home/chapter-one/HeroInView";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { GoArrow } from "@/components/GoArrow";
import { ZMOVE } from "@/app/lab/hero/options";
import { HeroMotion } from "./HeroMotion";
import s from "../graphics/survey.module.css";
import h from "./Hero.module.css";

// Direction A, the hero (research/dir-a.md §5.1). Lawrence's latest baseline underneath: the gentle pull-back (take j)
// scrubbed by the scroll, with HeroLayer's "1 + Dust" graphics (reused as-is, D49–D51). Over it, an instrument frame in
// the margins, clear of the headline: a time tape along the top whose ticks are the move's 241 frames (one per 8 px,
// a longer tick each second, no numerals) sliding under a fixed green caret, the move's time read out quietly in the
// frame's lower right margin, and registration marks at the frame's corners. As the move ends, four surface bars close in from the edges (transform only) until the picture is a
// plate inside the frame, and the plate scrolls away onto the sheet. Hooks (data-ch) are the ones HeroVideo and
// HeroLayer look for.
export const FRAMES = 241;
export const TICK = 8; // px per frame on the tape

export function Hero() {
  return (
    <section id="hero" className={`${h.hero} ${s.sheet}`} data-ch="root" aria-labelledby="hero-title">
      <div className={h.stage} data-ch="stage" aria-hidden="true">
        <div className={h.media} data-ch="media">
          <Image src={ZMOVE.j.poster} alt="" fill sizes="100vw" quality={75} preload fetchPriority="high" className={h.img} />
          <video className={h.video} data-ch="video" muted playsInline preload="none" tabIndex={-1} />
          <HeroVideo src={ZMOVE.j.video} />
          <HeroLayer look="plexusDust" data="zj1" />
        </div>

        {/* The close-in: four surface bars meet the frame's edges */}
        <span className={`${h.bar} ${h.barT}`} />
        <span className={`${h.bar} ${h.barB}`} />
        <span className={`${h.bar} ${h.barL}`} />
        <span className={`${h.bar} ${h.barR}`} />
        <span className={h.frameLine} />

        {/* The instrument frame */}
        <div className={h.tape} data-a="tape">
          <svg className={h.tapeStrip} data-a="strip" width={(FRAMES - 1) * TICK + 2} height="40" viewBox={`-1 0 ${(FRAMES - 1) * TICK + 2} 40`}>
            {Array.from({ length: FRAMES }, (_, f) => {
              const sec = f % 24 === 0, half = f % 12 === 0;
              return <line key={f} className={s.hair} x1={f * TICK} x2={f * TICK} y1={0} y2={sec ? 12 : half ? 7 : 4} />;
            })}
          </svg>
          <span className={h.caret} />
        </div>
        {/* The move's time, in seconds, in the frame's lower right margin */}
        <p className={h.readout}>
          <span className={s.num} data-a="frame">0.0</span>
          <span className={`${s.num} ${h.readOf}`}>/ {((FRAMES - 1) / 24).toFixed(1)} s</span>
        </p>
        <span className={h.regs}>
          {[0, 1, 2, 3].map((k) => (
            <svg key={k} viewBox="-12 -12 24 24" className={h.reg} style={{ "--k": k } as React.CSSProperties}>
              <circle r="5" className={s.hair} /><path d="M-11 0H11M0-11V11" className={s.hair} />
            </svg>
          ))}
        </span>
      </div>

      <div className={h.claim} data-beat="claim">
        <div className={h.copy} data-ch="copy">
          <h1 id="hero-title" className="t-display">Own your <span className="accent">world.</span></h1>
          <p className={`t-lede ${h.lede}`}>AI is starting to act for you. NEAR keeps your money, your data and your AI in your&nbsp;hands.</p>
          <a className={`btn btn-primary ${h.cta}`} href="https://near.com">Get started<GoArrow /></a>
        </div>
      </div>
      <HeroMotion frames={FRAMES} tick={TICK} />
      <HeroInView />
    </section>
  );
}
