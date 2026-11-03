import { ALL, FEATURED, MORE, KeepHyphens as Words, type Quote } from "./quotes";
import styles from "./VoicesMarked.module.css";

// Lab option C (D31): the live layout, with the typography doing more. The strongest phrase in each quote is marked
// with a mint highlighter band (after Basecamp), and every opening mark hangs into the margin (after Granola). No
// motion. Emphasis only: the words are the approved wording (quotes.tsx).

function Marked({ q }: { q: Quote }) {
  const at = q.plain.indexOf(q.mark);
  if (at < 0) return <Words s={q.plain} />;
  return <><Words s={q.plain.slice(0, at)} /><mark className={styles.mark}>{q.mark}</mark><Words s={q.plain.slice(at + q.mark.length)} /></>;
}

function Voice({ q, lead }: { q: Quote; lead?: boolean }) {
  return (
    <figure className={lead ? styles.featured : styles.quote}>
      <blockquote>
        <p><span className={styles.open} aria-hidden="true">&ldquo;</span><Marked q={q} /><span className={styles.close} aria-hidden="true">&rdquo;</span></p>
      </blockquote>
      <figcaption className={styles.attrib}>
        <span className={styles.name}>{q.name}</span>
        {q.role && <span>{q.role}</span>}
      </figcaption>
    </figure>
  );
}

export function VoicesMarked({ titleId = "voices-title" }: { titleId?: string }) {
  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>
        <Voice q={FEATURED} lead />
        <ul className={styles.quotes} aria-label={`${ALL.length - 1} more voices`}>
          {MORE.map((q) => <li key={q.id}><Voice q={q} /></li>)}
        </ul>
      </div>
    </section>
  );
}
