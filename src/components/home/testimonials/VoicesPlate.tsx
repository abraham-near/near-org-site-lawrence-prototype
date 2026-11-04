import Image from "next/image";
import { ALL } from "./quotes";
import { InView } from "./InView";
import { Wires } from "./Wires";
import styles from "./VoicesPlate.module.css";

// Lab option I (D36), "Survey plate": a colour-graded still (the dune, from the approved hero round, D25) carries a
// surveyor's crosshair grid with ruler ticks along two edges (after PARK Stuttgart). Four of its crossings are live
// mint nodes, numbered; a leader runs from each node out of the plate to its voice, set as a margin note (after Tufte's
// sidenotes) and closed by a bracket-tick credit, name left and role right (after Works in Progress). Hover or focus
// on a note turns its leader mint and rings its node. One entrance on first view; nothing loops.
// Node positions sit on grid crossings, [column of 8, row of 5], along the dune's ridge. Each node has its own row, in
// the notes' order, so no leader crosses another on its way out of the plate.
const COLS = 8, ROWS = 5;
const NODES: [number, number][] = [[6, 1], [4, 2], [5, 3], [2, 4]];

export function VoicesPlate({ titleId = "voices-title" }: { titleId?: string }) {
  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <InView />
      <div className={styles.inner}>
        <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>

        <figure className={styles.plateWrap}>
          <div className={styles.plateBox}>
            <div className={styles.plate}>
              <Image src="/images/home/voices/home-voices-dune-v1.webp" alt="" fill sizes="(min-width: 1440px) 860px, (min-width: 1280px) 60vw, 100vw" className={styles.img} />
              <span className={styles.grid} aria-hidden="true" />
              {NODES.map(([c, r], i) => (
                <span key={ALL[i].id} className={styles.node} style={{ left: `${(c / COLS) * 100}%`, top: `${(r / ROWS) * 100}%` }} data-wire-start={ALL[i].id} aria-hidden="true">
                  <span className={styles.nodeNum}>{i + 1}</span>
                </span>
              ))}
            </div>
            <span className={styles.rulerTop} aria-hidden="true" />
            <span className={styles.rulerLeft} aria-hidden="true" />
          </div>
        </figure>

        <ol className={styles.notes}>
          {ALL.map((q, i) => (
            <li key={q.id} className={styles.note} data-voice={q.id} data-lead={i === 0 || undefined}>
              <span className={styles.end} data-wire-end={q.id} aria-hidden="true" />
              <span className={styles.num} aria-hidden="true"><span className={styles.dot} />{i + 1}</span>
              <figure className={styles.fig}>
                <blockquote className={styles.quote}><p><span className={styles.hang}>&ldquo;</span>{q.text}&rdquo;</p></blockquote>
                <figcaption className={styles.credit}>
                  <span className={styles.name}>{q.name}</span>
                  {q.role && <span className={styles.role}>{q.role}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <Wires className={styles.wires} cased />
      </div>
    </section>
  );
}
