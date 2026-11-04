import Image from "next/image";
import { OwnArt } from "../chapter-one/OwnArt";
import { OwnReplay } from "../chapter-one/OwnReplay";
import { ANSWER, CONNECT, MEET, OWN, PROBLEM } from "./copy";
import { NearArt } from "./NearArt";
import { StoryStatic } from "./StoryStatic";
import { StoryRailMotion } from "./StoryRailMotion";
import { RailBack, RailDetail, RailOver, type RailLook } from "./RailLooks";
import base from "./Story.module.css";
import styles from "./StoryRail.module.css";

// Story option C, "The rail" (D29, reworked in D38): one horizontal line carries the story sideways while the reader
// scrolls down. It draws from AI on one side and blockchain on the other into a green NEAR tile under the three lines
// ("where they connect"). The three lines leave and the world slides to the layer beneath your agents, drawn on the line
// (NearArt) while the problem is read; the problem gives way to the answer in the same place, the drawing turns into
// NEAR's, and the line runs on green to four stations, one for each thing you own: the drawing above the line, the words
// below; only the station being read shows (its neighbours are dots on the line). The answer stays at the top
// throughout. Positions on the track are in vw (StoryRail.module.css: --x on each element). `look` adds a cinematic
// layer (D32, RailLooks.tsx).
const words = (s: string) => s.split(" ").map((w, i) => <span key={i} className={styles.pw}>{w} </span>);

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
            <span className={styles.end} style={{ "--x": "5vw" } as React.CSSProperties} data-s="end">AI <em>the frontend</em></span>
            <span className={`${styles.end} ${styles.endR}`} style={{ "--x": "95vw" } as React.CSSProperties} data-s="end">Blockchain <em>the backend</em></span>
            {/* Where the two sides meet: NEAR's tile on the line (the official black N on green) */}
            <span className={styles.hub} style={{ "--x": "50vw" } as React.CSSProperties} data-s="hub">
              <Image src="/brand/icon.svg" alt="" width={639} height={639} className={styles.hubMark} unoptimized />
            </span>

            {/* The layer beneath your agents, on the line: someone else's while the problem is read, NEAR's with the answer */}
            <div className={`${styles.artSlot} ${styles.gateSlot}`} style={{ "--x": `${RAIL.gate}vw` } as React.CSSProperties}>
              <NearArt className={styles.art} data-s="near" />
            </div>

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

          {/* Fixed on the stage: the three lines; then the problem, and the answer in its place, which stays */}
          <div className={styles.connect}>
            {CONNECT.map((s, i) => <p key={s} className={styles.cline} data-s={`c${i}`}>{s}</p>)}
            <p className={styles.cline} data-s="c2">{MEET.near}{MEET.rest}</p>
          </div>
          <p className={styles.problem} data-s="problem">{words(PROBLEM)}</p>
          <p className={styles.answer} data-s="answer">
            {words(`${ANSWER.pre}${ANSWER.near}${ANSWER.mid}`.trimEnd())}<span className={`${styles.pw} ${styles.owned}`}>{ANSWER.owned}</span>
          </p>
          <RailOver look={look} />
        </div>
      </div>
      <StoryRailMotion gate={RAIL.gate} stations={RAIL.stations} end={RAIL.end} look={look} />
      <OwnReplay />
    </section>
  );
}
