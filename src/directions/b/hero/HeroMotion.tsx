"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The hero's scroll choreography (desktop with motion only; the stage is pinned by CSS sticky, ScrollTrigger measures).
// Scrubbed at 0.6 s (DESIGN §4): the thread draws down to the glass and on through it (transform: scaleY), the crosshair
// and its dot fade on as it lands, the monolith drifts up a little against the camera move (translate only), and the
// surface rises over the stage as an opacity veil while the anthem fades in over it (StoryMotion), so the hand-off is a
// crossfade with no empty screen. No blur ever animates.
const MOTION = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";

export function HeroMotion() {
  const anchor = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("#hero");
    if (!root) return;
    const q = (k: string) => root.querySelector<HTMLElement>(`[data-b="${k}"]`)!;
    // SVG filters inside backdrop-filter render in Chromium only (Safari and Firefox parse but ignore them), so the
    // displacement is switched on for Chromium engines and the frost stays elsewhere
    const chromium = "chrome" in window || /Chrom(e|ium)\//.test(navigator.userAgent);
    if (chromium) document.documentElement.setAttribute("data-b-refract", "");
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const st = (start: string, end: string) => ({ trigger: root, start, end, scrub: 0.6 });
      gsap.fromTo(q("thread-top"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st("top top", "top -20%") });
      gsap.fromTo(q("thread-in"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st("top -18%", "top -45%") });
      gsap.fromTo([q("head"), q("mark")], { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: st("top -42%", "top -50%") });
      gsap.fromTo(q("monolith"), { yPercent: 0 }, { yPercent: -8, ease: "none", scrollTrigger: st("top top", "top -100%") });
      gsap.fromTo(q("veil"), { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: st("top -68%", "top -100%") });
    });
    return () => { mm.revert(); document.documentElement.removeAttribute("data-b-refract"); };
  }, { scope: anchor });
  return <span ref={anchor} hidden />;
}
