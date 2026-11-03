"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ALL } from "./quotes";
import styles from "./VoicesIndex.module.css";

// Lab option A (D31): the voices as an index. The four names are a roster on hairlines; the chosen one's quote is set
// large beside it (above it below desktop). Hovering a name with a mouse, tapping it or arrowing to it swaps the quote (out fast, in slow, as the
// Go deeper panels do, D28). Nothing changes on its own. Without JavaScript every quote shows, stacked.
export function VoicesIndex({ titleId = "voices-title" }: { titleId?: string }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = ALL.length;
    const to = { ArrowDown: (i + 1) % n, ArrowRight: (i + 1) % n, ArrowUp: (i - 1 + n) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    setActive(to);
    tabs.current[to]?.focus();
  };
  // Mouse only, and only on desktop, where the roster sits beside the quote: below 1280 it sits above the quote, so a
  // pointer travelling down to read would switch it on the way. Touch and pens pick with a tap.
  const onHover = (e: PointerEvent, i: number) => {
    if (e.pointerType === "mouse" && matchMedia("(min-width: 1280px)").matches) setActive(i);
  };

  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>

        <div className={styles.stage}>
          {ALL.map((q, i) => (
            <figure
              key={q.id} role="tabpanel" id={`voice-panel-${q.id}`} aria-labelledby={`voice-tab-${q.id}`}
              className={styles.panel} data-active={i === active || undefined} inert={i !== active} tabIndex={0}
            >
              <blockquote className={styles.quote}>
                <p><span className={styles.hang}>&ldquo;</span>{q.text}&rdquo;</p>
              </blockquote>
              {/* The roster names the speaker on screen; the caption keeps the pairing for screen readers and no-JS */}
              <figcaption className={styles.caption}>{q.name}{q.role && `, ${q.role}`}</figcaption>
            </figure>
          ))}
        </div>

        <div className={styles.roster} role="tablist" aria-label="Voices" aria-orientation="vertical">
          {ALL.map((q, i) => (
            <button
              key={q.id} ref={(el) => { tabs.current[i] = el; }}
              type="button" role="tab" id={`voice-tab-${q.id}`} aria-controls={`voice-panel-${q.id}`}
              aria-selected={i === active} tabIndex={i === active ? 0 : -1}
              className={styles.row} onClick={() => setActive(i)} onPointerEnter={(e) => onHover(e, i)} onKeyDown={(e) => onKey(e, i)}
            >
              <span className={styles.name}>{q.name}</span>
              {q.role && <span className={styles.role}>{q.role}</span>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
