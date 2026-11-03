import { OwnArt } from "../chapter-one/OwnArt";
import { OwnReplay } from "../chapter-one/OwnReplay";
import { CONNECT, OWN, PROBLEM } from "./copy";
import { MorphLine, StoryStatic } from "./StoryStatic";
import { StorySentenceMotion } from "./StorySentenceMotion";
import base from "./Story.module.css";
import styles from "./StorySentence.module.css";

// Story option B, "The sentence" (D29): type only, centred. The three lines hold; the first two leave and "NEAR is where
// they connect." recedes to a quiet line at the top while the problem wipes on below it; the problem goes, and that quiet
// line turns into "On NEAR, that layer is user-owned.", which stays up as the heading for "Own your …" (the word rolls,
// its line swaps under it, its drawing plays above it).
export function StorySentence() {
  return (
    <section className={base.story} aria-labelledby="story-title" data-story="sentence">
      <StoryStatic titleId="story-title" />
      <div className={base.track} style={{ "--story-h": "600vh" } as React.CSSProperties} aria-hidden="true">
        <div className={`${base.stage} ${styles.stage}`} data-s="stage">
          <div className={styles.connect} data-s="connect">
            {CONNECT.map((s, i) => <p key={s} className={styles.line} data-s={`c${i}`}>{s}</p>)}
            <MorphLine className={styles.slot} />
          </div>
          <div className={styles.problem} data-s="problem">
            <p>{PROBLEM.split(" ").map((w, i) => <span key={i} className={styles.pw}>{w} </span>)}</p>
          </div>
          <div className={styles.own} data-s="own">
            <div className={styles.arts} data-own-stage>
              {OWN.map((o) => <OwnArt key={o.key} which={o.key} className={styles.art} />)}
            </div>
            {/* "Own your" ends at the centre line and the word starts from it, so the pair pivots on the page's axis */}
            <div className={styles.ownRow}>
              <p className={styles.ownK} data-s="ownk">Own your</p>
              <div className={styles.mask}>
                {OWN.map((o) => <span key={o.key} className={`accent ${styles.word}`} data-s="word">{o.word}</span>)}
              </div>
            </div>
            <div className={styles.lines}>
              {OWN.map((o) => <p key={o.key} className={`t-lede ${styles.ownLine}`} data-s="oline">{o.line}</p>)}
            </div>
          </div>
        </div>
      </div>
      <StorySentenceMotion />
      <OwnReplay />
    </section>
  );
}
