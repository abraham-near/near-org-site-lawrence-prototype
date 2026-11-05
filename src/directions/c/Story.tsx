import type React from "react";
import Image from "next/image";
import { ANSWER, CONNECT, MEET, OWN, PROBLEM } from "@/components/home/story/copy";
import { Guides } from "./Shapes";
import { LayerDiagram } from "./LayerDiagram";
import { OwnPlate } from "./OwnPlates";
import { StoryMotion } from "./StoryMotion";
import styles from "./Story.module.css";

// Field, section 2: the anthem and the story, then the horizontal rail. Copy verbatim from spec/pages/home.md §1.2–1.4
// (the story's words come from components/home/story/copy.ts, unchanged).
//   1. The anthem, set as a staircase: each line starts one step further in, so the left edges trace the N's diagonal
//      (a line's height × 0.8351). With motion the lines slide into their steps one by one and the construction line
//      draws down through their corners. The closing phrase is the page's one green phrase.
//   2. The mission: the three sentences, the problem and the answer take turns in one place on the left while the
//      layer diagram on the right goes from empty to someone else's (hatched ink) to the reader's (NEAR green).
//   3. The rail (kept horizontal): "Own your" holds still on the left, behind a hatched stem, while the four things you
//      own slide past, each word landing on the same baseline. Phones, tablets and reduced motion: a native sideways
//      scroll with snap points, each panel carrying its own "Own your".
const ANTHEM = ["NEAR is open infrastructure", "powering the agent economy.", "Confidential by design and secured", "for the quantum era, it lets you", "trade anything, anywhere, and"];
const CLOSE = "own your intelligence.";

export function Story() {
  return (
    <section id="story" className={styles.story} aria-labelledby="anthem-title">
      {/* 1. The anthem */}
      <div className={styles.aTrack} data-a="track">
        <div className={styles.aStage}>
          <Guides />
          <div className={styles.wrap}>
            <h2 id="anthem-title" className={styles.anthem} data-a="anthem">
              <Image src="/brand/icon_tile.svg" alt="" width={160} height={160} className={styles.tile} unoptimized />
              {ANTHEM.map((l, i) => (
                <span key={l} className={styles.aLine} style={{ "--i": i } as React.CSSProperties} data-a="line">{l} </span>
              ))}
              <span className={`${styles.aLine} ${styles.aGreen}`} style={{ "--i": ANTHEM.length } as React.CSSProperties} data-a="line">{CLOSE}</span>
              <span className={styles.aDiag} aria-hidden="true"><span className={styles.aRule} data-a="rule" /></span>
              {[...ANTHEM, CLOSE].map((l, i) => (
                <span key={l} className={styles.aPin} style={{ "--i": i } as React.CSSProperties} data-a="pin" aria-hidden="true" />
              ))}
            </h2>
          </div>
        </div>
      </div>

      {/* 2. The mission */}
      <div className={styles.mTrack} data-m="track">
        <div className={styles.mStage}>
          <Guides />
          <div className={`${styles.wrap} ${styles.mGrid}`}>
            <div className={styles.mText}>
              <h3 className={`t-h2 ${styles.connect}`} data-m="connect">
                {CONNECT.map((s) => <span key={s} className={styles.sentence}>{s} </span>)}
                <span className={styles.sentence}>{MEET.near}{MEET.rest}</span>
              </h3>
              <p className={styles.problem} data-m="problem">{PROBLEM}</p>
              <p className={`t-h2 ${styles.answer}`} data-m="answer">
                {ANSWER.pre}{ANSWER.near}{ANSWER.mid}<span className="accent">{ANSWER.owned}</span>
              </p>
            </div>
            <LayerDiagram className={styles.mArt} />
          </div>
        </div>
      </div>

      {/* 3. The rail */}
      <div className={styles.rTrack} data-r="track">
        <div className={styles.rStage} data-r="stage">
          <Guides />
          <div className={styles.rFixed} aria-hidden="true">
            <p className={`t-h1 ${styles.rOwn}`}>Own your</p>
            <span className={styles.rStem} />
          </div>
          <ol className={styles.strip} data-r="strip" tabIndex={0} aria-label="Own your data, assets, intelligence and identity">
            {OWN.map((o) => (
              <li key={o.key} className={styles.panel} data-r="panel">
                <h3 className={`t-h1 ${styles.ownH}`}>
                  <span className={styles.ownPre}>Own your </span><span className="accent">{o.word}</span>
                </h3>
                <p className={`t-lede ${styles.ownLine}`}>{o.line}</p>
                <OwnPlate which={o.key} />
              </li>
            ))}
          </ol>
        </div>
      </div>
      <StoryMotion />
    </section>
  );
}
