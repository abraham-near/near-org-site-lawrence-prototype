"use client";

import { useEffect, useRef } from "react";

// The header gets out of the way (D27): it slides up while the reader scrolls down and comes back as soon as they
// scroll up. It always shows near the top of the page, while a menu is open, and while keyboard focus is inside it (so
// keyboard users never lose it; a mouse click that leaves focus on a button doesn't pin it). Small jitters (under 8 px)
// are ignored. Sets data-hidden on the header; CSS moves the bar.
const TOP = 96, JITTER = 8;

export function HeaderScroll() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const header = anchor.current?.closest<HTMLElement>("header");
    if (!header) return;
    let last = window.scrollY, ticking = false;
    const held = () => !!header.querySelector(":focus-visible, [data-open], dialog[open]"); // keyboard focus, not a mouse click
    const update = () => {
      ticking = false;
      const y = window.scrollY, dy = y - last;
      if (y < TOP || held()) header.removeAttribute("data-hidden");
      else if (dy > JITTER) header.setAttribute("data-hidden", "");
      else if (dy < -JITTER) header.removeAttribute("data-hidden");
      else return; // inside the jitter band: keep the last reference point
      last = y;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    const show = () => { if (held()) header.removeAttribute("data-hidden"); };
    window.addEventListener("scroll", onScroll, { passive: true });
    header.addEventListener("focusin", show);
    return () => { window.removeEventListener("scroll", onScroll); header.removeEventListener("focusin", show); header.removeAttribute("data-hidden"); };
  }, []);

  return <span ref={anchor} hidden />;
}
