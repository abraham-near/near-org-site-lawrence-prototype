import { OwnArt } from "../chapter-one/OwnArt";
import { OrbitArt } from "./orbit/OrbitArt";
import { ANSWER, CONNECT, MEET, OWN, PROBLEM } from "./copy";
import { NearArt } from "./NearArt";
import styles from "./Story.module.css";

// The story as plain reading (D29): every option's words, in order, as real headings and paragraphs. It is what phones,
// tablets, reduced motion and no-JS show, and what screen readers read in every mode (the moving stage is aria-hidden).
export function StoryStatic({ titleId, art = "line" }: { titleId: string; art?: "line" | "orbit" }) {
  const Own = art === "orbit" ? OrbitArt : OwnArt;
  return (
    <div className={styles.static}>
      <h2 id={titleId} className={`t-h2 ${styles.connect}`}>
        {CONNECT.map((s) => <span key={s} className={styles.sentence}>{s} </span>)}
        <span className={styles.sentence}>{MEET.near}{MEET.rest}</span>
      </h2>
      <p className={`t-lede ${styles.problem}`}>{PROBLEM}</p>
      <NearArt className={styles.nearArt} />
      <p className={`t-h3 ${styles.answer}`}>
        {ANSWER.pre}{ANSWER.near}{ANSWER.mid}<span className={styles.owned}>{ANSWER.owned}</span>
      </p>
      <ol className={styles.ownList}>
        {OWN.map((o) => (
          <li key={o.key} className={styles.ownItem}>
            <Own which={o.key} className={art === "orbit" ? `${styles.ownArt} ${styles.ownArtLarge}` : styles.ownArt} />
            <h3 className={`t-h3 ${styles.ownH}`}>Own your <span className="accent">{o.word}</span></h3>
            <p className={`t-body ${styles.ownLine}`}>{o.line}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// The line that carries the story: "NEAR is where they connect." turns into "On NEAR, that layer is user-owned.", with
// NEAR sliding from one place to the other (morph.ts). Both lines sit in one cell; decorative (the static copy reads).
export function MorphLine({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.morph} ${className}`} data-morph>
      <span className={styles.mLine}>
        <span className={styles.mw} data-m="near1">{MEET.near}</span>
        <span className={styles.mw} data-m="rest1">{MEET.rest}</span>
      </span>
      <span className={styles.mLine}>
        <span className={styles.mw} data-m="pre">{ANSWER.pre}</span>
        <span className={styles.mw} data-m="near2">{ANSWER.near}</span>
        <span className={styles.mw} data-m="rest2">{ANSWER.mid}<span className={styles.owned}>{ANSWER.owned}</span></span>
      </span>
    </div>
  );
}
