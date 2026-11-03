"use client";

import { useEffect, useRef } from "react";

// Marks its parent element with data-in the first time a third of it is on screen, so CSS can play a one-time
// entrance. Without JavaScript (or with reduced motion, in the CSS) everything shows in its final state.
export function InView() {
  const anchor = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = anchor.current?.parentElement;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.setAttribute("data-in", ""); io.disconnect(); }
    }, { threshold: 0.33 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <span ref={anchor} hidden />;
}
