"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { along } from "./construction";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The page's one motion motif (Field): shapes and type travel along the N's diagonal as the reader scrolls, and
// construction lines draw on. Everything is scroll-linked (scrubbed 0.6 s, DESIGN §4), transform, opacity and SVG
// stroke-dashoffset only, and nothing moves on its own. With reduced motion nothing here runs: the markup is already
// the final state. Hooks, by data attribute, anywhere inside [data-field]:
//   data-drift="d"   moves the element d px along the diagonal (down-right to up-left) while its section passes
//   data-draw-group  draws its [data-draw] strokes (pathLength 1) in order as it comes up the screen
//   data-slide="px"  slides type in from px to its place on the grid as it arrives
export function FieldMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("[data-field]");
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>("[data-drift]").forEach((el) => {
        const d = Number(el.dataset.drift) || 0;
        const a = along(d / 2), b = along(-d / 2);
        gsap.fromTo(el, { x: a.x, y: a.y }, {
          x: b.x, y: b.y, ease: "none",
          scrollTrigger: { trigger: el.closest("section") ?? el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      });

      root.querySelectorAll<HTMLElement>("[data-draw-group]").forEach((group) => {
        const strokes = group.querySelectorAll<SVGGeometryElement>("[data-draw]");
        if (!strokes.length) return;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: group, start: group.dataset.drawStart ?? "top 88%", end: group.dataset.drawEnd ?? "top 30%", scrub: 0.6 },
        });
        strokes.forEach((s, i) => tl.fromTo(s, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", duration: 1 }, i * (Number(group.dataset.drawStagger) || 0.12)));
        group.querySelectorAll<SVGElement>("[data-draw-fade]").forEach((f) => tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" }, Number(f.dataset.drawFade) || 0.6));
      });

      root.querySelectorAll<HTMLElement>("[data-slide]").forEach((el) => {
        gsap.fromTo(el, { x: Number(el.dataset.slide) || 0 }, {
          x: 0, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: el.dataset.slideEnd ?? "top 45%", scrub: 0.6 },
        });
      });
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
