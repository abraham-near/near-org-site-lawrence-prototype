import { OwnArt } from "../chapter-one/OwnArt";
import { OwnReplay } from "../chapter-one/OwnReplay";
import { CONNECT, OWN, PROBLEM } from "./copy";
import { MorphLine, StoryStatic } from "./StoryStatic";
import { StoryRailMotion } from "./StoryRailMotion";
import { RailBack, RailDetail, RailOver, type RailLook } from "./RailLooks";
import base from "./Story.module.css";
import styles from "./StoryRail.module.css";

// Story option C, "The rail" (D29): one horizontal line carries the story sideways while the reader scrolls down. It draws
// from both ends to NEAR's point under the three lines ("where they connect"). The world slides left to a closed box on
// the line while the problem is read (the layer beneath, run by someone else); the answer opens the box and the line runs
// on green to four stations, one for each thing you own: the drawing above the line, the words below; only the station
// being read shows (its neighbours are dots on the line). The answer stays at the top throughout. Positions on the track
// are in vw (StoryRail.module.css: --x on each element). `look` adds a cinematic layer (D32, RailLooks.tsx).
export const RAIL = { gate: 150, stations: [235, 290, 345, 400], end: 470 };

export function StoryRail({ look = "plain" }: { look?: RailLook }) {
  return (
    <section className={base.story} aria-labelledby="story-title" data-story="rail">
      <StoryStatic titleId="story-title" />
      <div className={base.track} style={{ "--story-h": "620vh" } as React.CSSProperties} aria-hidden="true">
        <div className={`${base.stage} ${styles.stage}`} data-s="stage" data-look={look}>
          <RailBack look={look} />
          <div className={styles.world} style={{ "--end": `${RAIL.end}vw` } as React.CSSProperties} data-s="world">
            <RailDetail look={look} gate={RAIL.gate} stations={RAIL.stations} />
            <span className={styles.rail} />
            <span className={`${styles.green} ${styles.greenL}`} data-s="greenL" />
            <span className={`${styles.green} ${styles.greenR}`} data-s="greenR" />
            <span className={`${styles.green} ${styles.greenOn}`} style={{ "--x": "100vw" } as React.CSSProperties} data-s="greenOn" />
            <span className={styles.end} style={{ "--x": "6vw" } as React.CSSProperties} data-s="end">AI <em>the frontend</em></span>
            <span className={`${styles.end} ${styles.endR}`} style={{ "--x": "94vw" } as React.CSSProperties} data-s="end">Blockchain <em>the backend</em></span>
            <span className={styles.point} style={{ "--x": "50vw" } as React.CSSProperties} data-s="point" />

            {/* The layer beneath: a box on the line, dark while someone else runs it; it splits open with the answer */}
            <div className={styles.problem} style={{ "--x": `${RAIL.gate - 50}vw` } as React.CSSProperties} data-s="problem">
              <p>{PROBLEM.split(" ").map((w, i) => <span key={i} className={styles.pw}>{w} </span>)}</p>
            </div>
            <span className={styles.gate} style={{ "--x": `${RAIL.gate}vw` } as React.CSSProperties}>
              <span className={`${styles.half} ${styles.top}`} data-s="gateTop" />
              <span className={`${styles.half} ${styles.bottom}`} data-s="gateBottom" />
            </span>

            {OWN.map((o, i) => (
              <div key={o.key} className={styles.station} style={{ "--x": `${RAIL.stations[i]}vw` } as React.CSSProperties} data-s="station">
                <div className={styles.artSlot} data-own-stage>
                  <OwnArt which={o.key} className={styles.art} />
                </div>
                <span className={styles.dot} data-s="dot" />
                <p className={styles.title} data-s="words">Own your <span className="accent">{o.word}</span></p>
                <p className={`t-lede ${styles.line}`} data-s="words">{o.line}</p>
              </div>
            ))}
          </div>

          {/* Fixed on the stage: the three lines, then the line that recedes, turns into the answer and stays */}
          <div className={styles.connect}>
            {CONNECT.map((s, i) => <p key={s} className={styles.cline} data-s={`c${i}`}>{s}</p>)}
            <MorphLine className={styles.slot} />
          </div>
          <RailOver look={look} />
        </div>
      </div>
      <StoryRailMotion gate={RAIL.gate} stations={RAIL.stations} end={RAIL.end} look={look} />
      <OwnReplay />
    </section>
  );
}
