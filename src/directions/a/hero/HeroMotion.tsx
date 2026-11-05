"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MOTION = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";

// The hero's instrument (Hero.tsx). Desktop with motion: the time tape follows the camera move (HeroVideo scrubs the
// video from the top of the page to -120%), the frame readout counts with it, and then the four bars close in to the
// frame (scrubbed, 0.6 s smoothing). Elsewhere the tape rests at frame 0 and nothing moves.
export function HeroMotion({ frames, tick }: { frames: number; tick: number }) {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("[data-ch='root']");
    const stage = root?.querySelector<HTMLElement>("[data-ch='stage']");
    const readout = root?.querySelector<HTMLElement>("[data-a='frame']");
    if (!root || !stage || !readout) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      let target = 0, now = 0, raf = 0, shown = -1;
      const render = () => {
        raf = 0;
        now += (target - now) * 0.18;
        if (Math.abs(target - now) < 0.02) now = target;
        stage.style.setProperty("--tape-x", `${(-now * tick).toFixed(2)}px`);
        const f = Math.round(now);
        if (f !== shown) { shown = f; readout.textContent = (f / 24).toFixed(1); }
        if (now !== target) raf = requestAnimationFrame(render);
      };
      const move = ScrollTrigger.create({
        trigger: root, start: "top top", end: "top -120%",
        onUpdate: (st) => { target = st.progress * (frames - 1); if (!raf) raf = requestAnimationFrame(render); },
      });
      const close = gsap.fromTo(stage, { "--close": 0 }, {
        "--close": 1, ease: "power1.inOut",
        scrollTrigger: { trigger: root, start: "top -118%", end: "top -148%", scrub: 0.6 },
      });
      return () => { cancelAnimationFrame(raf); move.kill(); close.kill(); stage.style.removeProperty("--tape-x"); stage.style.removeProperty("--close"); };
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
