import { FEATURED, MORE, type Quote } from "./quotes";
import styles from "./VoicesPraise.module.css";

// Lab option D (D34), after the praise page for James Clear's Atomic Habits (jamesclear.com/atomic-habits): two
// staggered columns of praise where the shorter a quote is, the larger it is set, so "I wouldn't bet against NEAR"
// leads at the h1 size. Hairlines instead of tinted cards, names and roles stacked under each quote, no portraits.
// No motion: the contrast in scale is the interest.
const [horsley, mumtaz, swihart] = MORE;
const LEFT: [Quote, string][] = [[FEATURED, "l"], [swihart, "s"]];
const RIGHT: [Quote, string][] = [[horsley, "xl"], [mumtaz, "l"]];

function Praise({ q, size }: { q: Quote; size: string }) {
  return (
    <figure className={styles.praise} data-size={size} data-id={q.id}>
      <blockquote><p><span className={styles.hang}>&ldquo;</span>{q.text}&rdquo;</p></blockquote>
      <figcaption className={styles.attrib}>
        <span className={styles.name}>{q.name}</span>
        {q.role && <span className={styles.role}>{q.role}</span>}
      </figcaption>
    </figure>
  );
}

export function VoicesPraise({ titleId = "voices-title" }: { titleId?: string }) {
  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>
        <div className={styles.left}>{LEFT.map(([q, s]) => <Praise key={q.id} q={q} size={s} />)}</div>
        <div className={styles.right}>{RIGHT.map(([q, s]) => <Praise key={q.id} q={q} size={s} />)}</div>
      </div>
    </section>
  );
}
