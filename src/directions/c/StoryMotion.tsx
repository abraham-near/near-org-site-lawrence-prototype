"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The story's three scrubbed scenes (desktop, motion allowed; Story.module.css pins each stage). Transform, opacity and
// SVG stroke-dashoffset only; every text holds still for well over 1.5 s of normal scrolling before it changes.
const DESKTOP = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";

export function StoryMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("#story");
    if (!root) return;
    const one = (sel: string) => root.querySelector<HTMLElement>(sel);
    const all = (sel: string) => [...root.querySelectorAll<HTMLElement>(sel)];
    const mm = gsap.matchMedia();

    mm.add(DESKTOP, () => {
      // 1. The anthem: each line slides into its step and goes solid; the construction line draws down their corners
      const aTrack = one("[data-a='track']");
      if (aTrack) {
        const lines = all("[data-a='line']"), pins = all("[data-a='pin']");
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: aTrack, start: "top top", end: "bottom bottom", scrub: 0.6 } });
        tl.fromTo(one("[data-a='rule']"), { scaleY: 0 }, { scaleY: 1, duration: 0.86 }, 0.04);
        lines.forEach((l, i) => {
          tl.fromTo(l, { x: 140, opacity: 0.3 }, { x: 0, opacity: 1, duration: 0.24, ease: "power2.out" }, 0.04 + i * 0.12);
          if (pins[i]) tl.fromTo(pins[i], { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.06 }, 0.2 + i * 0.12);
        });
        tl.to({}, { duration: 0.1 });
      }

      // 2. The mission: the sentences, the problem and the answer take turns; the layer goes from empty to someone
      //    else's (hatched ink) to the reader's (green), and the requests run solid
      const mTrack = one("[data-m='track']");
      if (mTrack) {
        const connect = one("[data-m='connect']"), problem = one("[data-m='problem']"), answer = one("[data-m='answer']");
        const ink = one("[data-m='layerInk']"), green = one("[data-m='layerGreen']"), owned = one("[data-m='owned']");
        const reqs = all("[data-m='req']"), dashes = all("[data-m='reqDash']");
        gsap.set([problem, answer, green, owned], { opacity: 0 });
        gsap.set(dashes, { opacity: 1 });
        gsap.set(reqs, { strokeDashoffset: 1 });
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: mTrack, start: "top top", end: "bottom bottom", scrub: 0.6 } });
        tl.to({}, { duration: 0.2 })
          .to(connect, { opacity: 0, x: -56, duration: 0.08, ease: "power1.in" }, 0.2)
          .fromTo(problem, { opacity: 0, x: 56 }, { opacity: 1, x: 0, duration: 0.1, ease: "power2.out" }, 0.27)
          .fromTo(ink, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.27)
          .to(problem, { opacity: 0, x: -56, duration: 0.08, ease: "power1.in" }, 0.56)
          .fromTo(answer, { opacity: 0, x: 56 }, { opacity: 1, x: 0, duration: 0.1, ease: "power2.out" }, 0.63)
          .to(green, { opacity: 1, duration: 0.1 }, 0.63)
          .to(ink, { opacity: 0, duration: 0.1 }, 0.66)
          .to(dashes, { opacity: 0, duration: 0.06 }, 0.68)
          .to(reqs, { strokeDashoffset: 0, duration: 0.12, stagger: 0.02 }, 0.68)
          .to(owned, { opacity: 1, duration: 0.06 }, 0.78)
          .to({}, { duration: 0.12 }, 0.88);
      }
    });

    // 3. The rail: the strip slides left under the fixed "Own your" while the reader scrolls down; each plate draws on
    //    as its panel arrives
    mm.add(DESKTOP, () => {
      const track = one("[data-r='track']"), strip = one("[data-r='strip']");
      const panels = all("[data-r='panel']");
      if (!track || !strip || panels.length < 2) return;
      // Pinned, the page's own scroll moves the strip, so it leaves the tab order (it holds no links, and screen readers
      // read its panels in order either way); the static strip scrolls sideways by keyboard and keeps its tabindex
      strip.removeAttribute("tabindex");
      const travel = () => panels[panels.length - 1].offsetLeft - panels[0].offsetLeft;
      const setH = () => track.style.setProperty("--rail-h", `${window.innerHeight + travel() * 1.1}px`);
      setH();
      const slide = gsap.to(strip, {
        x: () => -travel(), ease: "none",
        scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true, onRefreshInit: setH },
      });
      panels.forEach((p) => {
        const strokes = p.querySelectorAll("[data-rail-draw]");
        gsap.fromTo(strokes, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0, ease: "none", stagger: 0.01,
          scrollTrigger: { trigger: p, containerAnimation: slide, start: "left 95%", end: "left 35%", scrub: 0.6 },
        });
      });
      return () => { track.style.removeProperty("--rail-h"); strip.setAttribute("tabindex", "0"); };
    });

    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
