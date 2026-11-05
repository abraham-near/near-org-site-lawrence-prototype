"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";


gsap.registerPlugin(ScrollTrigger, useGSAP);

// The hero's scroll (desktop, motion allowed; Hero.module.css pins the stage for 0.8 of a screen). One scrubbed timeline:
//   hold the poster → the surface plane (with its hatched band) and the headline slide out left, opening the whole
//   picture while the camera moves (HeroVideo) → a second plane sweeps in from the right on the same diagonal and lands
//   leaving a wedge of the picture; the stage then unpins and lifts off the anthem beneath it.
// Transform and opacity only. Nothing moves unless the reader scrolls.
export function HeroMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("#hero");
    if (!root) return;
    const q = (k: string) => root.querySelector<HTMLElement>(`[data-h='${k}']`);
    const stage = q("stage"), panelL = q("panelL"), panelR = q("panelR"), copy = q("copy"), band = q("band");
    if (!stage || !panelL || !panelR || !copy || !band) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1280px) and (prefers-reduced-motion: no-preference)", () => {
      const H = () => stage.getBoundingClientRect().height;
      const W = () => window.innerWidth;
      // Hero.module.css: the cut meets the top at x0 = inset + 400 px; its foot is run × H further right
      const inset = () => Math.max(64, (W() - 1440) / 2 + 64);
      const out = () => -(inset() + 400 + H() * 0.8351 + 40);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      });
      // The band rides on the plane's edge, so it leaves with it rather than floating in the picture
      tl.to({}, { duration: 0.12 })
        .to([panelL, band], { x: out, duration: 0.38, ease: "power1.in" }, 0.12)
        .to(copy, { x: () => -(inset() + Math.min(600, W() * 0.42) + 80), duration: 0.34, ease: "power1.in" }, 0.14)
        // The second plane lands with its edge meeting the foot of the screen a quarter of the way in, leaving a wedge
        // of the picture in the lower left; the timeline ends as it lands
        .fromTo(panelR, { x: W }, { x: () => W() * 0.24 - H() * 0.8351, duration: 0.4, ease: "power1.out" }, 0.6);
      return () => gsap.set([panelL, panelR, copy, band], { clearProps: "transform" });
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
