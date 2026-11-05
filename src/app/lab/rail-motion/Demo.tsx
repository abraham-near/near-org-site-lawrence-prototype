"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./rail-motion.module.css";

// A demo frame (D72): the drawing slides in from the right to the centre over 2.4 s, holds for 5 s (its loop running),
// slides out to the left, and repeats, so the turn on arrival and the loop at rest can be judged without the rail.
// The frame is the drawing's [data-slide-frame], so its slide is measured against the frame's centre.
export function Demo({ children, label }: { children: ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = track.current;
    if (!el || paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
    const tick = () => {
      const t = ((performance.now() - t0) / 1000) % 10;
      // in (2.4 s), hold (5 s), out (2.4 s), a breath off screen
      const x = t < 2.4 ? 1 - ease(t / 2.4) : t < 7.4 ? 0 : t < 9.8 ? -ease((t - 7.4) / 2.4) : 1;
      el.style.transform = `translateX(${(x * 100).toFixed(2)}%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);
  return (
    <figure className={styles.demo}>
      <div className={styles.frame} data-slide-frame>
        <div className={styles.plate} aria-hidden="true" />
        <span className={styles.rail} aria-hidden="true" />
        <div ref={track} className={styles.track}><div className={styles.slot}>{children}</div></div>
      </div>
      <figcaption className={styles.caption}>
        <span>{label}</span>
        <button type="button" className={styles.pause} onClick={() => setPaused((p) => !p)}>{paused ? "Play the slide" : "Hold at centre"}</button>
      </figcaption>
    </figure>
  );
}
