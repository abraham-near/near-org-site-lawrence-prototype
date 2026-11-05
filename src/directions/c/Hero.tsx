import Image from "next/image";
import { HeroVideo } from "@/components/home/chapter-one/HeroVideo";
import { HeroInView } from "@/components/home/chapter-one/HeroInView";
import { GoArrow } from "@/components/GoArrow";
import { Guides } from "./Shapes";
import { HeroMotion } from "./HeroMotion";
import styles from "./Hero.module.css";

// Field, section 1: the claim as a Swiss poster. The ridges footage (take j, the current hero's camera move, D48) sits
// behind a surface plane whose edge is the N's diagonal (50.13°, construction.ts), so the picture reads as a wedge cut
// at the mark's own angle; a hatched band and its anchor squares sit on the footage along that edge. Desktop with
// motion: the stage pins for 0.8 of a screen while the reader's scroll drives the camera (HeroVideo, unchanged), the
// plane, its band and the headline slide away to show the whole picture, then a second plane sweeps in on the same
// diagonal and leaves a wedge of the picture in the lower left (the phone composition); the stage then lifts off the
// anthem, which is already in place beneath it. HeroInView (reused) quiets the header's button while the hero's own
// button is on screen. Phones, tablets and reduced motion: the poster, stacked, with the corner cut at the
// same angle. The copy is the approved claim (spec/pages/home.md §1.1).
export const HERO_POSTER = "/lab/hero/lab-hero-z-j.webp";
export const HERO_VIDEO_J = "/lab/hero/lab-hero-z-j.mp4";

export function Hero() {
  return (
    <section id="hero" className={styles.hero} data-ch="root" aria-labelledby="hero-title">
      <div className={styles.stage} data-h="stage">
        <div className={styles.media} data-ch="media">
          <Image src={HERO_POSTER} alt="" fill sizes="100vw" quality={75} preload fetchPriority="high" className={styles.img} />
          <video className={styles.video} data-ch="video" muted playsInline preload="none" tabIndex={-1} aria-hidden="true" />
          <HeroVideo src={HERO_VIDEO_J} />
        </div>

        {/* On the footage: a hatched band parallel to the cut, with an anchor square at each corner */}
        <div className={styles.bandGroup} data-h="band" aria-hidden="true">
          <span className={styles.band} />
          <span className={`${styles.pin} ${styles.pinTL}`} />
          <span className={`${styles.pin} ${styles.pinTR}`} />
          <span className={`${styles.pin} ${styles.pinBL}`} />
          <span className={`${styles.pin} ${styles.pinBR}`} />
        </div>

        {/* The planes: GSAP moves each wrapper (x only); the skew lives on the child, in CSS */}
        <div className={styles.moveL} data-h="panelL" aria-hidden="true"><div className={styles.panelL} /></div>
        <div className={styles.moveR} data-h="panelR" aria-hidden="true"><div className={styles.panelR} /></div>
        <div className={styles.guideLayer}><Guides /></div>

        <div className={styles.copy} data-h="copy" data-beat="claim">
          <h1 id="hero-title" className={`t-display ${styles.title}`}>
            Own your <span className="accent">world.</span>
          </h1>
          <div className={styles.foot}>
            <p className={`t-lede ${styles.lede}`}>AI is starting to act for you. NEAR keeps your money, your data and your AI in your&nbsp;hands.</p>
            <a className={`btn btn-primary ${styles.cta}`} href="https://near.com">Get started<GoArrow /></a>
          </div>
          {/* The scroll cue (desktop): a hairline dropping to an anchor square */}
          <p className={styles.cue} aria-hidden="true"><span className={styles.cueLine} />Scroll</p>
        </div>
      </div>
      <HeroMotion />
      <HeroInView />
    </section>
  );
}
