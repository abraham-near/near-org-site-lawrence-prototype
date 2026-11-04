import type { CSSProperties } from "react";
import { ALL } from "./quotes";
import { InView } from "./InView";
import styles from "./VoicesSheet.module.css";

// Lab option J (D36), "Credits sheet": the section drawn as a press sheet. The 12-column grid is visible as dashed
// rails (after Payload and Zed); four cells cut from it share hairline edges, with crosshair nodes at their corners and
// one mint node at the centre (after Monad's frame). Each cell is a credit block (after A24, which sets its credits in
// our own Neue Montreal): the quote, a ruler with one tick per word (its length is the quote's length; the count is
// computed from the text), and label-over-value credits. The featured cell is graph paper (after Zed). Hover or focus
// a cell and its ticks turn mint. One entrance on first view; nothing loops.
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function VoicesSheet({ titleId = "voices-title" }: { titleId?: string }) {
  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <InView />
      <div className={styles.inner}>
        <div className={styles.rails} aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} />)}</div>
        <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>

        <div className={styles.sheet}>
          {ALL.map((q, i) => {
            const n = words(q.plain);
            return (
              <figure key={q.id} className={styles.cell} data-lead={i === 0 || undefined}>
                <blockquote className={styles.quote}><p><span className={styles.hang}>&ldquo;</span>{q.text}&rdquo;</p></blockquote>
                <p className={styles.ruler}>
                  <span className={styles.ticks} style={{ "--n": n } as CSSProperties} aria-hidden="true" />
                  <span className={styles.count}>{n} words</span>
                </p>
                <figcaption className={styles.credits}>
                  <dl>
                    <div><dt>Said by</dt><dd>{q.name}</dd></div>
                    {q.role && <div><dt>Role</dt><dd>{q.role}</dd></div>}
                  </dl>
                </figcaption>
              </figure>
            );
          })}
          {/* The sheet's nine corner nodes; the centre one is mint */}
          {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => (
            <span key={`${r}${c}`} className={styles.cross} data-centre={(r === 1 && c === 1) || undefined} style={{ left: `${c * 50}%`, top: `${r * 50}%` }} aria-hidden="true" />
          )))}
        </div>
      </div>
    </section>
  );
}
