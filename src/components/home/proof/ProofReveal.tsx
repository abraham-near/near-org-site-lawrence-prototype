"use client";

import { useEffect, useRef } from "react";
import { motionPaused } from "@/components/MotionToggle";

// A one-shot reveal (D15) the first time the strip is in view: a green line draws across its top rule while the
// figures fade up in a quick stagger, about 1.2 s in all, then it rests. Under 5 s, so it needs no pause control.
// With reduced motion, motion paused or no JS, the strip simply shows (Proof.module.css gates the start state).
export function ProofReveal() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>("[data-proof]");
    if (!root) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || motionPaused()) { root.setAttribute("data-revealed", ""); return; }
    root.setAttribute("data-reveal", "");
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      root.setAttribute("data-revealed", "");
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return <span ref={anchor} hidden />;
}
