import Image from "next/image";
import { SplitText } from "./SplitText";
import { ChapterOneMotion } from "./ChapterOneMotion";
import { HeroInView } from "./HeroInView";
import { HeroVideo } from "./HeroVideo";
import { GoArrow } from "@/components/GoArrow";
import styles from "./ChapterOne.module.css";

// Section 1 (spec/pages/home.md §1): "Own your world", the claim and the anthem. The story that follows (the mission line
// and "Own your") is its own section since D29 (components/home/story).
// Desktop with motion: a pinned stage under scrolling beats (GSAP, D8); the hero is a scroll-scrubbed camera move down
// the ridges (D29). Otherwise: plain stacked beats with a static green rule. All copy is server-rendered.
export function ChapterOne() {
  return (
    <section className={styles.chapter} data-ch="root" aria-label="Own your world">
      {/* The stage: decorative (every word lives in the beats). Pinned on desktop; a photo band on phones. */}
      <div className={styles.stage} data-ch="stage" aria-hidden="true">
        <div className={styles.photo} data-ch="photo">
          <div className={styles.media} data-ch="media">
            {/* The video's first frame, so the swap to the video is invisible; first paint and LCP */}
            <Image src="/images/home/home-hero-ridges-v2.webp" alt="" fill sizes="100vw" quality={75} preload fetchPriority="high" className={styles.photoImg} />
            {/* Desktop with motion only: HeroVideo gives it a source and scrubs it with the scroll (never plays on its own) */}
            <video className={styles.video} data-ch="video" muted playsInline preload="none" tabIndex={-1} />
            <HeroVideo />
          </div>
          {/* The close-in: two surface curtains scale in from the edges until only the line is left (transform only). */}
          <span className={`${styles.curtain} ${styles.curtainL}`} data-ch="curtain-l" />
          <span className={`${styles.curtain} ${styles.curtainR}`} data-ch="curtain-r" />
        </div>
        <svg className={styles.lines} data-ch="lines" />
      </div>

      <div className={styles.beats} data-ch="beats">
        <div className={`${styles.beat} ${styles.beatClaim}`} data-beat="claim">
          <div className={styles.copy}>
            <h1 className="t-display">
              Own your <span className="accent">world.</span>
            </h1>
            <p className={`t-lede ${styles.lede}`}>AI is starting to act for you. NEAR keeps your money, your data and your AI in your&nbsp;hands.</p>
            <a className={`btn btn-primary ${styles.cta}`} href="https://near.com">Get started<GoArrow /></a>
          </div>
        </div>

        <div className={`${styles.beat} ${styles.beatAnthem}`} data-beat="anthem">
          <div className={styles.anthem}>
            {/* D29: larger, and the N in its black tile hangs two lines deep to the left of "NEAR" */}
            <h2 className={styles.statement} data-wipe>
              <Image src="/brand/icon_tile.svg" alt="" width={160} height={160} className={styles.anthemMark} data-ch="mark" unoptimized />
              <SplitText
                wordClass={styles.wd}
                charClass={styles.ch}
                breakClass={styles.lb}
                parts={[
                  // Desktop line breaks ("\n"): two lines beside the tile, and the green phrase on a line of its own
                  { text: "NEAR is open infrastructure\npowering the agent economy.\nConfidential by design and secured\nfor the quantum era, it lets you\ntrade anything, anywhere, and\n" },
                  { text: "own your intelligence.", className: styles.hl },
                ]}
              />
            </h2>
          </div>
        </div>
      </div>

      <ChapterOneMotion />
      <HeroInView />
    </section>
  );
}
