import { Fragment, type CSSProperties } from "react";
import { ALL } from "./quotes";
import styles from "./VoicesReadIn.module.css";

// Lab option B (D31): the voices read in. Four quotes set large down the page, alternating left and right on the
// grid (D19's rhythm). As each one scrolls up into the reading zone its words fill in from faint to ink, left to right,
// tied to the scroll (CSS scroll-driven, opacity only); once it is above the middle of the screen it is fully set.
// Without scroll-driven animation support, or with reduced motion, every word simply shows.
export function VoicesReadIn({ titleId = "voices-title" }: { titleId?: string }) {
  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>
        <ol className={styles.list}>
          {ALL.map((q, i) => {
            const words = q.plain.split(" ");
            return (
              <li key={q.id} className={styles.item} data-side={i % 2 ? "right" : "left"} data-lead={i === 0 || undefined}>
                <figure className={styles.fig}>
                  <blockquote className={styles.quote}>
                    {/* Screen readers get the sentence whole; the per-word spans are for the eye only */}
                    <p className={styles.sr}>&ldquo;{q.plain}&rdquo;</p>
                    <p aria-hidden="true">
                      <span className={`${styles.hang} ${styles.word}`} style={{ "--i": 0, "--n": words.length } as CSSProperties}>&ldquo;</span>
                      {/* The spaces sit between the spans, so lines still break there (each word is nowrap) */}
                      {words.map((w, j) => (
                        <Fragment key={j}>
                          <span className={styles.word} style={{ "--i": j, "--n": words.length } as CSSProperties}>
                            {w}{j === words.length - 1 && "”"}
                          </span>
                          {j < words.length - 1 && " "}
                        </Fragment>
                      ))}
                    </p>
                  </blockquote>
                  <figcaption className={styles.attrib}>
                    <span className={styles.name}>{q.name}</span>
                    {q.role && <span>{q.role}</span>}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
