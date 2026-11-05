"use client";

import { useEffect } from "react";

// Marks every watch area ([data-a-watch]) with data-in the first time it comes into view, which starts its
// micro-motions (survey.module.css). Placed once on the page. An area can set its own threshold with
// data-a-watch="0.5" (the share of it in view). Areas never reset: each micro-motion plays once.
export function Watch() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-a-watch]:not([data-in])")];
    const groups = new Map<number, HTMLElement[]>();
    els.forEach((el) => {
      const t = Number(el.dataset.aWatch) || 0.3;
      groups.set(t, [...(groups.get(t) ?? []), el]);
    });
    const ios = [...groups].map(([t, list]) => {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.setAttribute("data-in", "");
        io.unobserve(e.target);
      }), { threshold: Math.min(t, 0.99), rootMargin: "0px 0px -8% 0px" });
      list.forEach((el) => io.observe(el));
      return io;
    });
    return () => ios.forEach((io) => io.disconnect());
  }, []);
  return null;
}
