import { FEATURED, MORE, type Quote } from "@/components/home/testimonials/quotes";
import { Guides } from "./Shapes";
import styles from "./Lower.module.css";

// Field, section 7: what the world is saying, set as type. The featured quote (the current section's approved v4
// wording, unchanged) runs large across the grid in the quote style, its opening mark hanging into the margin beside
// a hatched stem; it slides onto its grid line as it arrives (FieldMotion). The other three sit in three columns on
// hairlines. No portraits, no cards.
function Who({ q }: { q: Quote }) {
  return (
    <figcaption className={styles.vWho}>
      <span className={styles.vName}>{q.name}</span>
      {q.role && <span className={styles.vRole}>{q.role}</span>}
    </figcaption>
  );
}

export function Voices() {
  return (
    <section id="voices" className={styles.voices} aria-labelledby="c-voices-title">
      <Guides />
      <div className={styles.wrap}>
        <h2 id="c-voices-title" className={`t-h3 ${styles.vTitle}`}>What the world is saying about NEAR</h2>
        <figure className={styles.vFeat}>
          <span className={styles.vStem} aria-hidden="true" />
          <blockquote className={styles.vFeatQuote} data-slide="96">
            <p><span className={styles.vHang}>&ldquo;</span>{FEATURED.text}&rdquo;</p>
          </blockquote>
          <Who q={FEATURED} />
        </figure>
        <ul className={styles.vList}>
          {MORE.map((q) => (
            <li key={q.id}>
              <figure className={styles.vQuote}>
                <blockquote><p><span className={styles.vHangSm}>&ldquo;</span>{q.text}&rdquo;</p></blockquote>
                <Who q={q} />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
