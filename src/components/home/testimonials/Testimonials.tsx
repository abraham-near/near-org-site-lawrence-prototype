import type { ReactNode } from "react";
import styles from "./Testimonials.module.css";

// Section 6 (spec/pages/home.md §6): a light grey band (surface-2, D15), a tonal step without a second dark section.
// Copy is the approved v4 board wording: one featured quote set large, three more below. Attributions come from
// the draft site.

type Quote = { text: ReactNode; name: string; role?: string };

const FEATURED: Quote = { text: "Their AI work is the only AI x Crypto thing I’m looking forward to.", name: "Austin Federa", role: "Co-founder of DoubleZero" };

const QUOTES: Quote[] = [
  { text: "I wouldn’t bet against NEAR.", name: "Hunter Horsley", role: "CEO of Bitwise" },
  { text: "NEAR still feels like the most underrated team in crypto…", name: "Mert Mumtaz", role: "Co-founder of Helius" },
  { text: <>&hellip;unlocking global access to encrypted wealth. Game changing at <span className={styles.nowrap}>a multi-generational</span> scale.</>, name: "Josh Swihart" },
];

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

export function Testimonials() {
  return (
    <section className={styles.band} aria-labelledby="voices-title">
      <div className={styles.inner}>
        <h2 id="voices-title" className={styles.title}>What the world is saying about NEAR</h2>

        <figure className={styles.featured}>
          <blockquote className={styles.featQuote}>
            {/* The opening mark hangs into the margin so the text edge stays on the grid line */}
            <p><span className={styles.hang}>&ldquo;</span>{FEATURED.text}&rdquo;</p>
          </blockquote>
          <Attribution q={FEATURED} />
        </figure>

        <ul className={styles.quotes}>
          {QUOTES.map((q) => (
            <li key={q.name}>
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
