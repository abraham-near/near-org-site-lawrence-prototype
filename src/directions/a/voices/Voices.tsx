import type React from "react";
import { FEATURED, MORE, type Quote } from "@/components/home/testimonials/quotes";
import v from "./Voices.module.css";

// Direction A, Voices (research/dir-a.md §5.7): the four approved quotes (components/home/testimonials/quotes.tsx,
// unchanged) as readings on a sheet. The featured quote set large; the other three hang from crosshair nodes on one
// shared baseline, each on a leader that draws down to it when the row comes into view. Light, typographic.
function Who({ q }: { q: Quote }) {
  return (
    <figcaption className={v.who}>
      <span className={v.name}>{q.name}</span>
      {q.role && <span className={v.role}>{q.role}</span>}
    </figcaption>
  );
}

export function Voices() {
  return (
    <section id="voices" className={v.voices} aria-labelledby="a-voices-title">
      <div className={v.inner}>
        <h2 id="a-voices-title" className={v.title}>What the world is saying about NEAR</h2>

        <figure className={v.featured} data-a-watch="0.4">
          <span className={v.mark} aria-hidden="true" />
          <blockquote className={v.featQuote}><p><span className={v.hang}>&ldquo;</span>{FEATURED.text}&rdquo;</p></blockquote>
          <Who q={FEATURED} />
        </figure>

        <ul className={v.row} data-a-watch="0.3">
          {MORE.map((q, i) => (
            <li key={q.id} className={v.item} style={{ "--d": `${200 + i * 220}ms` } as React.CSSProperties}>
              <span className={v.node} aria-hidden="true" />
              <span className={v.leader} aria-hidden="true" />
              <figure className={v.quote}>
                <blockquote><p><span className={v.hang}>&ldquo;</span>{q.text}&rdquo;</p></blockquote>
                <Who q={q} />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
