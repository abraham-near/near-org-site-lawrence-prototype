"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ALL } from "./quotes";
import styles from "./VoicesStage.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Lab option F (D34), after Attio's homepage quote (attio.com): one voice per screen. On desktop with motion the
// section pins a full-screen stage on faint dot-grid paper; each quote is centred, very large, and its words ink in
// as you scroll (opacity, scrubbed by GSAP ScrollTrigger per DESIGN §4), then the next quote takes its place (out
// fast, in slow, D28). A roster along the bottom shows where you are. Nothing moves without the reader's scroll.
// Phones, tablets, reduced motion and no-JS get the four quotes stacked and fully inked.
// This would be a second orchestrated moment on the page (DESIGN §4 allows one): choosing it needs a decision (D34).
const PINNED = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";
const FAINT = 0.45; // unread words stay legible (about 3:1); Attio starts lighter, but its quotes are longer
const INKED_BY = 0.6; // a quote is fully inked 60% of the way through its share of the scroll; the rest is a hold

export function VoicesStage({ titleId = "voices-title" }: { titleId?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = root.current;
    const track = el?.querySelector<HTMLElement>("[data-track]");
    if (!el || !track) return;
    const figs = [...el.querySelectorAll<HTMLElement>("[data-q]")];
    const words = figs.map((f) => [...f.querySelectorAll<HTMLElement>("[data-w]")]);
    const names = [...el.querySelectorAll<HTMLElement>("[data-name]")];

    const mm = gsap.matchMedia();
    mm.add(PINNED, () => {
      el.setAttribute("data-pinned", "");
      let last = -1;
      const paint = (p: number) => {
        const n = figs.length, k = Math.min(n - 1, Math.floor(p * n)), local = p * n - k;
        if (k !== last) {
          last = k;
          figs.forEach((f, i) => f.toggleAttribute("data-active", i === k));
          names.forEach((nm, i) => nm.toggleAttribute("data-on", i === k));
        }
        const ws = words[k], t = Math.min(1, local / INKED_BY) * ws.length;
        ws.forEach((w, j) => { w.style.opacity = String(FAINT + (1 - FAINT) * Math.min(1, Math.max(0, t - j))); });
      };
      const st = ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: (self) => paint(self.progress) });
      paint(st.progress);
      // The track just grew to its pinned height, so everything below it moved: re-measure the page's other triggers
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(raf);
        el.removeAttribute("data-pinned");
        figs.forEach((f) => f.removeAttribute("data-active"));
        names.forEach((nm) => nm.removeAttribute("data-on"));
        words.flat().forEach((w) => { w.style.opacity = ""; });
      };
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className={styles.band} aria-labelledby={titleId}>
      <div className={styles.track} data-track>
        <div className={styles.stage}>
          <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>
          <div className={styles.quotes}>
            {ALL.map((q, i) => {
              const ws = q.plain.split(" ");
              return (
                <figure key={q.id} className={styles.fig} data-q={i}>
                  <blockquote className={styles.quote}>
                    {/* Screen readers get the sentence whole; the per-word spans are for the eye only */}
                    <p className={styles.sr}>&ldquo;{q.plain}&rdquo;</p>
                    <p aria-hidden="true">
                      {ws.map((w, j) => (
                        <Fragment key={j}>
                          <span className={styles.word} data-w>{j === 0 && "“"}{w}{j === ws.length - 1 && "”"}</span>
                          {j < ws.length - 1 && " "}
                        </Fragment>
                      ))}
                    </p>
                  </blockquote>
                  <figcaption className={styles.attrib}>
                    <span className={styles.name}>{q.name}</span>
                    {q.role && <span>{q.role}</span>}
                  </figcaption>
                </figure>
              );
            })}
          </div>
          {/* Where you are in the four (pinned only); the names are already in each caption for screen readers */}
          <ol className={styles.roster} aria-hidden="true">
            {ALL.map((q) => <li key={q.id} data-name>{q.name}</li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}
