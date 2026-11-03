import { ALL } from "./quotes";
import styles from "./VoicesTiles.module.css";

// Lab option G (D34), after Flighty's press tiles (flighty.com): a calm row of four tiles, each a speaker's name. One
// tile is flooded mint and shows its quote between double hairlines; hovering or focusing another moves the flood
// (colour 200 ms, the name out fast, the quote in: D28's two speeds). The first tile starts flooded, so one quote is
// always on show. Where there's no hover (touch, phones) every tile shows its quote and only the first is mint.
// Pure CSS; nothing changes on its own.
export function VoicesTiles({ titleId = "voices-title" }: { titleId?: string }) {
  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>
        <ul className={styles.tiles}>
          {ALL.map((q, i) => (
            <li key={q.id} className={styles.tile} data-lead={i === 0 || undefined}>
              {/* Focusable so keyboard users can move the flood the way a mouse does; the quote is always in the
                  accessibility tree, only its visibility changes */}
              <figure className={styles.fig} tabIndex={0}>
                <figcaption className={styles.who}>
                  <span className={styles.name}>{q.name}</span>
                  {q.role && <span className={styles.role}>{q.role}</span>}
                </figcaption>
                <div className={styles.face}>
                  <span className={styles.rules} aria-hidden="true" />
                  <blockquote className={styles.quote}><p>&ldquo;{q.text}&rdquo;</p></blockquote>
                  <span className={styles.rules} aria-hidden="true" />
                  <span className={styles.credit} aria-hidden="true">{q.name}</span>
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
