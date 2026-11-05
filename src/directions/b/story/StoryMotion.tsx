"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The story's scroll choreography. CSS pins (sticky); ScrollTrigger measures and scrubs (0.6 s). Transform and opacity
// only; the one backdrop-filter that changes (the frosted layer) only fades.
//  - Anthem (≥ 1024): each character goes from 18% to full, left to right, while the slab is pinned.
//  - Rail (≥ 768): the two beams draw into the prism (scaled from their far ends), the green beam leaves it, then the
//    world slides to the frosted layer; it clears as the problem gives way to the answer; the world slides on through
//    the four stations, the nearest to the reading line lit. A hairline at the foot shows how far through you are.
export function StoryMotion() {
  const anchor = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("#story");
    if (!root) return;
    const q = <T extends Element = HTMLElement>(k: string) => root.querySelector<T>(`[data-b="${k}"]`)!;
    const mm = gsap.matchMedia();

    // Desktop with motion: the anthem rises into place over the hero's last screen and fades in as the hero's veil
    // does (HeroMotion: veil from top -68% to -100%), so there is never an empty screen between them
    mm.add("(min-width: 1280px) and (prefers-reduced-motion: no-preference)", () => {
      const hero = document.getElementById("hero");
      const stage = q("anthem").firstElementChild;
      if (!hero || !stage) return;
      gsap.fromTo(stage, { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: hero, start: "top -62%", end: "top -96%", scrub: 0.6 } });
    });

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const chars = [...q("wipe").querySelectorAll<HTMLElement>("[aria-hidden] span span")];
      gsap.timeline({ scrollTrigger: { trigger: q("anthem"), start: "top top", end: "bottom bottom", scrub: 0.6 } })
        .fromTo(chars, { opacity: 0.18 }, { opacity: 1, ease: "none", duration: 0.3, stagger: 0.04 }, 0)
        .to({}, { duration: chars.length * 0.008 });
    });

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const world = q("world");
      const stations = [...root.querySelectorAll<HTMLElement>('[data-b="station"]')];
      const panels = [...root.querySelectorAll<HTMLElement>('[data-b="panel"]')];
      const bar = q("progress");
      const end = () => -(world.scrollWidth - window.innerWidth);
      const toB = () => -panels[1].offsetLeft;
      const light = () => {
        const mid = window.innerWidth * 0.42;
        let best = -1, bd = Infinity;
        stations.forEach((st, i) => {
          const r = st.getBoundingClientRect(), d = Math.abs(r.left + Math.min(r.width, 520) * 0.4 - mid);
          if (r.left < window.innerWidth * 0.8 && d < bd) { bd = d; best = i; }
        });
        stations.forEach((st, i) => st.toggleAttribute("data-on", i === best));
      };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: q("rail"), start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
        onUpdate: () => { light(); bar.style.transform = `scaleX(${tl.progress().toFixed(4)})`; },
      });
      tl.fromTo(q("beam-ai"), { scale: 0, svgOrigin: "10 40" }, { scale: 1, duration: 0.5 }, 0)
        .fromTo(q("beam-chain"), { scale: 0, svgOrigin: "10 320" }, { scale: 1, duration: 0.5 }, 0.1)
        .fromTo(q("beam-out"), { scale: 0, svgOrigin: "580 180" }, { scale: 1, duration: 0.3 }, 0.6)
        .to(world, { x: toB, duration: 1.2, ease: "power1.inOut" }, 1.0)
        .to(q("frost"), { opacity: 0, duration: 0.5 }, 2.4)
        .to(q("layer-crisp"), { opacity: 1, duration: 0.5 }, 2.4)
        .to(q("problem"), { opacity: 0, duration: 0.2 }, 2.4)
        .to(q("answer"), { opacity: 1, duration: 0.3 }, 2.6)
        .to(world, { x: end, duration: 3, ease: "power1.inOut" }, 3.1)
        .to({}, { duration: 0.3 });
      return () => stations.forEach((st) => st.removeAttribute("data-on"));
    });
    return () => mm.revert();
  }, { scope: anchor });
  return <span ref={anchor} hidden />;
}
