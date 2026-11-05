import Image from "next/image";
import { FEATURED, MORE, type Quote } from "@/components/home/testimonials/quotes";
import glass from "../glass.module.css";
import s from "./Voices.module.css";

// Direction B, Voices (spec/pages/home.md §6; quotes and attributions from components/home/testimonials/quotes.tsx,
// unchanged). A band photographed through standing panes of frosted glass (Higgsfield, LOG.md: panes), and in front of
// it one glass plate: the featured quote large on the left, the three short ones as a flat column on hairlines to its
// right. One pane of glass, not a stack of cards. Typographic only, no portraits, no motion.
function Who({ q }: { q: Quote }) {
  return (
    <figcaption className={s.who}>
      <span className={s.name}>{q.name}</span>
      {q.role && <span className={s.role}>{q.role}</span>}
    </figcaption>
  );
}

export function Voices() {
  return (
    <section id="voices" className={s.voices} aria-labelledby="b-voices-title">
      <div className={s.inner}>
        <h2 id="b-voices-title" className={`t-h3 ${s.title}`}>What the world is saying about NEAR</h2>
      </div>
      <div className={s.band}>
        <Image src="/directions/b/dir-b-panes.webp" alt="" fill sizes="100vw" decoding="async" className={s.bg} />
        <div className={s.inner}>
          <div className={`${glass.glass} ${glass.edge} ${s.plate}`}>
            <figure className={s.featured}>
              <blockquote className={s.featQuote}><p><span className={s.hang}>&ldquo;</span>{FEATURED.text}&rdquo;</p></blockquote>
              <Who q={FEATURED} />
            </figure>
            <ul className={s.list}>
              {MORE.map((q) => (
                <li key={q.id}>
                  <figure className={s.quote}>
                    <blockquote><p><span className={s.hang}>&ldquo;</span>{q.text}&rdquo;</p></blockquote>
                    <Who q={q} />
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
