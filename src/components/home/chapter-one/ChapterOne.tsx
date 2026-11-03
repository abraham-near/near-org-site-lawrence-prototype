import Image from "next/image";
import { SplitText } from "./SplitText";
import { ChapterOneMotion } from "./ChapterOneMotion";
import { HeroInView } from "./HeroInView";
import { HeroMedia } from "./HeroMedia";
import { OwnArt, type OwnKey } from "./OwnArt";
import { OwnReplay } from "./OwnReplay";
import { GoArrow } from "@/components/GoArrow";
import styles from "./ChapterOne.module.css";

// Section 1 (spec/pages/home.md §1): "Own your world", one narrative in four beats with one green line.
// Desktop with motion: a pinned stage under scrolling beats (GSAP, D8). Otherwise: plain stacked sections
// with a static green rule. All copy is server-rendered and readable without JS.

const OWN: { key: OwnKey; word: string; line: string }[] = [
  { key: "data", word: "data.", line: "Transactions and prompts stay confidential, even from the infrastructure running them." },
  { key: "assets", word: "assets.", line: "Hold, swap and move everything you have from one account only you control." },
  { key: "intelligence", word: "intelligence.", line: "Inference and agents run inside hardware enclaves, and every request returns a signed proof of what ran." }, // F17
  { key: "identity", word: "identity.", line: "One NEAR account that reads like a name, works across 35+ chains, and upgrades to post-quantum keys in a single rotation." },
];

const TAGS: { key: string; label: string; em: string }[] = [
  { key: "ai", label: "AI", em: "the frontend" },
  { key: "chain", label: "Blockchain", em: "the backend" },
];

export function ChapterOne() {
  return (
    <section className={styles.chapter} data-ch="root" aria-label="Own your world">
      {/* The stage: decorative (every word lives in the beats). Pinned on desktop; a photo band on phones. */}
      <div className={styles.stage} data-ch="stage" aria-hidden="true">
        <div className={styles.photo} data-ch="photo">
          {/* Parallax wrapper: the hero photograph (first paint, LCP), a still since D26 */}
          <div className={styles.media} data-ch="media">
            <Image src="/images/home/home-hero-ridges-v1.webp" alt="" fill sizes="100vw" quality={75} preload fetchPriority="high" className={styles.photoImg} />
            <HeroMedia />
          </div>
          {/* The close-in: two surface curtains scale in from the edges until only the line is left (transform only). */}
          <span className={`${styles.curtain} ${styles.curtainL}`} data-ch="curtain-l" />
          <span className={`${styles.curtain} ${styles.curtainR}`} data-ch="curtain-r" />
        </div>
        <svg className={styles.lines} data-ch="lines" />
        <div className={styles.tags}>
          {TAGS.map((t) => (
            <span key={t.key} className={styles.tag} data-tag={t.key}>
              {t.label}
              <em>{t.em}</em>
            </span>
          ))}
        </div>
        {/* "Own your …": one drawing at a time, hung on the thread to the right of the copy (D18) */}
        <div className={styles.ownStage} data-ch="own-stage">
          {OWN.map((o) => <OwnArt key={o.key} which={o.key} className={styles.stageArt} />)}
        </div>
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
            <div className={styles.anthemRow}>
              <Image src="/brand/icon.svg" alt="" width={48} height={48} className={styles.anthemMark} data-ch="mark" unoptimized />
              <h2 className={styles.statement} data-wipe>
                <SplitText
                  wordClass={styles.wd}
                  charClass={styles.ch}
                  breakClass={styles.lb}
                  parts={[
                    { text: "NEAR is open infrastructure powering\nthe agent economy. Confidential by\ndesign and secured for the quantum era,\nit lets you trade anything, anywhere,\nand " },
                    { text: "own your intelligence.", className: styles.hl },
                  ]}
                />
              </h2>
            </div>
          </div>
        </div>

        <div className={`${styles.beat} ${styles.beatMission}`} data-beat="mission">
          <div className={styles.copy}>
            <h2 className={`t-h2 ${styles.missionTitle}`}>
              {/* One sentence per line (D15); no Kepler accent here */}
              <span className={styles.sentence}>AI is the frontend.</span>{" "}
              <span className={styles.sentence}>Blockchain is the backend.</span>{" "}
              <span className={styles.sentence}>NEAR is where they connect.</span>
            </h2>
            <p className="t-lede">Whoever runs the layer beneath your agents sees what they see and keeps what they&nbsp;earn.</p>
            <p className={`t-h3 ${styles.payoff}`}>On NEAR, that layer is <span className={styles.nowrap}>user-owned.</span></p>
          </div>
        </div>

        <div className={`${styles.beat} ${styles.beatOwn}`} data-beat="own">
          {/* "Own your" holds; the word after it rolls (after the b7 direction), and its drawing changes on the right (D18). */}
          <div className={styles.own}>
            <h2 className="sr-only">Own your own</h2>
            <p className={`t-h1 ${styles.ownK}`} aria-hidden="true">Own your</p>
            <ol className={styles.ownSteps}>
              {OWN.map((o) => (
                <li key={o.word} className={styles.ownStep} data-step>
                  <OwnArt which={o.key} className={styles.stepArt} />
                  <h3 className={`t-h1 ${styles.ownH}`}>
                    <span className={styles.ownPrefix}>Own your </span>
                    <span className={styles.mask}><span className={`accent ${styles.ownWord}`} data-word>{o.word}</span></span>
                  </h3>
                  <p className={`t-lede ${styles.ownLine}`} data-line>
                    {o.line}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <ChapterOneMotion />
      <HeroInView />
      <OwnReplay />
    </section>
  );
}
