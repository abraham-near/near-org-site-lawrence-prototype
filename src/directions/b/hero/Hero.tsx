import Image from "next/image";
import { HeroVideo } from "@/components/home/chapter-one/HeroVideo";
import { HeroLayer } from "@/components/home/chapter-one/layer/HeroLayer";
import { GoArrow } from "@/components/GoArrow";
import { ZMOVE } from "@/app/lab/hero/options";
import { HeroMotion } from "./HeroMotion";
import { FluteFilter } from "../FluteFilter";
import glass from "../glass.module.css";
import s from "./Hero.module.css";

// Direction B "Prism", the hero. The approved camera move down the ridges (take j, D48) with the tracked plexus + dust
// layer (j4, D50; HeroLayer imported unchanged), and one rendered object standing in the land: a fluted glass monolith
// that refracts the footage behind it (true displacement in Chromium, FluteFilter; frost elsewhere). The green thread
// drops through it, broken into steps by the ribs, and settles on a crisp dot and crosshair in front of the glass: yours. Desktop with motion: the stage is pinned while the camera moves; the
// surface then rises over it as a veil (opacity only) and hands off to the anthem. Elsewhere: a photo band, then the
// claim on the surface. The stage is decorative; the claim carries every word.
export function Hero() {
  return (
    <section id="hero" className={s.hero} data-ch="root" aria-labelledby="b-hero-title">
      <div className={s.stage} data-ch="stage" aria-hidden="true">
        <div className={s.media} data-ch="media">
          <Image src={ZMOVE.j.poster} alt="" fill sizes="100vw" quality={75} preload fetchPriority="high" className={s.poster} />
          <video className={s.video} data-ch="video" muted playsInline preload="none" tabIndex={-1} />
          <HeroVideo src={ZMOVE.j.video} />
          <HeroLayer look="plexusDust" data="zj1" />
        </div>

        {/* The thread: crisp above the glass, refracted (shifted, softened) inside it */}
        <span className={`${s.thread} ${s.threadTop}`} data-b="thread-top" />
        <span className={`${s.thread} ${s.threadIn}`} data-b="thread-in" />

        {/* The monolith: reeded glass, a lit cap, a green fringe down its right edge */}
        <div className={s.monolith} data-b="monolith">
          <div className={`${s.slab} ${glass.edge}`} />
        </div>

        {/* "You": a crisp dot and crosshair in front of the glass, where the thread settles */}
        <span className={s.head} data-b="head" />
        <svg className={s.mark} viewBox="-20 -20 40 40" data-b="mark">
          <path d="M-18 0H-8M8 0H18M0-18V-8M0 8V18" />
          <path className={s.markCorner} d="M-12-6V-12H-6M6-12H12V-6M12 6V12H6M-6 12H-12V6" />
        </svg>

        <span className={s.veil} data-b="veil" />
      </div>

      <div className={s.claim}>
        <div className={s.copy} data-ch="copy">
          <h1 id="b-hero-title" className={`t-display ${s.title}`}>
            Own your <span className="accent">world.</span>
          </h1>
          <p className={`t-lede ${s.lede}`}>AI is starting to act for you. NEAR keeps your money, your data and your AI in your&nbsp;hands.</p>
          <a className={`btn btn-primary ${s.cta}`} href="https://near.com">Get started<GoArrow /></a>
        </div>
      </div>
      <FluteFilter />
      <HeroMotion />
    </section>
  );
}
