import type { CSSProperties } from "react";
import { ALL, KeepHyphens } from "./quotes";
import { InView } from "./InView";
import styles from "./VoicesLeader.module.css";

// Lab option E (D34), after Craft's homepage quotes (craft.do): one reading line per voice. The speaker, then a thin
// leader rule, then the words in a large italic serif with a hung mark. All four rows run left to right (Craft
// alternates sides; that reads as DESIGN §6's zigzag). On first view each leader draws from the name towards the
// words (transform), then the words fade in (opacity), once per row. Setting quotes in Kepler italic needs a decision
// (D34).
export function VoicesLeader({ titleId = "voices-title" }: { titleId?: string }) {
  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>
        <ul className={styles.rows}>
          {ALL.map((q, i) => (
            <li key={q.id} className={styles.row} style={{ "--i": i } as CSSProperties}>
              <InView />
              <figure className={styles.fig}>
                <figcaption className={styles.who}>
                  <span className={styles.name}>{q.name}</span>
                  {q.role && <span className={styles.role}>{q.role}</span>}
                </figcaption>
                <span className={styles.leader} aria-hidden="true" />
                {/* Plain text: Kepler sets its own line breaks well; the kept-together phrase orphaned "changing at" */}
                <blockquote className={styles.quote}><p><span className={styles.hang}>&ldquo;</span><KeepHyphens s={q.plain.replace("\u00a0", " ")} />&rdquo;</p></blockquote>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
