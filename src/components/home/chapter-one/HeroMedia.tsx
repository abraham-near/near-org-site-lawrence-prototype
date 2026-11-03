"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The hero photograph's parallax (D26: a still, the layered ridges; no video loop, so nothing plays on its own).
// The photo (next/image, preloaded) is the first paint and the LCP. Parallax moves the media wrapper, scrubbed with
// the reader's own scroll (transform only), and only when motion is allowed.
export function HeroMedia() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const media = anchor.current?.closest<HTMLElement>("[data-ch='media']");
    const root = anchor.current?.closest<HTMLElement>("[data-ch='root']");
    if (!media || !root) return;

    const mm = gsap.matchMedia();
    mm.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 1280px) and (prefers-reduced-motion: no-preference)",
    }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;
      if (desktop) {
        // Pinned stage: the photo drifts up and settles from a slight zoom while the claim scrolls. It keeps a 10%
        // overscan throughout, so the 5% drift never shows the page under the photo's bottom edge.
        gsap.fromTo(media, { yPercent: 0, scale: 1.12 }, {
          yPercent: -5, scale: 1.1, ease: "none",
          scrollTrigger: { trigger: root.querySelector("[data-beat='claim']"), start: "top top", end: "bottom top", scrub: 0.6 },
        });
      } else {
        // Phones/tablets: the photo band moves slower than the page
        gsap.fromTo(media, { yPercent: -4, scale: 1.08 }, {
          yPercent: 4, ease: "none",
          scrollTrigger: { trigger: media.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
