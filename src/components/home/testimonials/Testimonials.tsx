import styles from "./Testimonials.module.css";
import { FEATURED, MORE as QUOTES, type Quote } from "./quotes";

// Section 6 (spec/pages/home.md §6): a light grey band (surface-2, D15), a tonal step without a second dark section.
// Copy is the approved v4 board wording (quotes.tsx): one featured quote set large, three more below. Three livelier
// options are in the lab (/lab/voices, D31) for Lawrence to choose from.

function Attribution({ q }: { q: Quote }) {
  return (
    <figcaption className={styles.attrib}>
      <p className={styles.who}>
        <span className={styles.name}>{q.name}</span>
        {q.role && <span className={styles.role}>{q.role}</span>}
      </p>
    </figcaption>
  );
}

export function Testimonials({ titleId = "voices-title" }: { titleId?: string }) {
  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>

        <figure className={styles.featured}>
          <blockquote className={styles.featQuote}>
            {/* The opening mark hangs into the margin so the text edge stays on the grid line */}
            <p><span className={styles.hang}>&ldquo;</span>{FEATURED.text}&rdquo;</p>
          </blockquote>
          <Attribution q={FEATURED} />
        </figure>

        <ul className={styles.quotes}>
          {QUOTES.map((q) => (
            <li key={q.id}>
              <figure className={styles.quote}>
                <blockquote><p><span className={styles.hang}>&ldquo;</span>{q.text}&rdquo;</p></blockquote>
                <Attribution q={q} />
              </figure>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
