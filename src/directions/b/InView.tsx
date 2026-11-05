"use client";

import { useEffect, useRef } from "react";

// Sets data-in on the nearest [data-inview] ancestor the first time it is a third in view, so CSS can play a one-shot
// vector draw-on (transform/opacity only; reduced motion shows the final state in CSS).
export function InView({ threshold = 0.33 }: { threshold?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("[data-inview]");
    if (!host) return;
    host.setAttribute("data-armed", "");
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { host.setAttribute("data-in", ""); io.disconnect(); } }, { threshold });
    io.observe(host);
    return () => io.disconnect();
  }, [threshold]);
  return <span ref={ref} hidden />;
}
