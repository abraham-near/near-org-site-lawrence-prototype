"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { addMorph, hideAnswer } from "./morph";
import { playSteps } from "./steps";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MOTION = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";

// Option B's choreography (D29): one scrubbed timeline over the pinned stage, 100 units long (6 screens of scroll).
export function StorySentenceMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("section");
    if (!root) return;
    const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(`[data-s="${s}"]`)!;
    const qa = (s: string) => [...root.querySelectorAll<HTMLElement>(`[data-s="${s}"]`)];

    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const stage = q("stage"), slot = root.querySelector<HTMLElement>("[data-morph]")!;
      const words = qa("word"), lines = qa("oline");
      const arts = [...root.querySelectorAll<HTMLElement>("[data-own-stage] [data-art]")];
      // Where the meet line goes: a quiet kicker 16% down the stage, measured in layout pixels (no transforms)
      const toTop = () => stage.clientHeight * 0.16 - slot.offsetTop;
      hideAnswer(slot);
      gsap.set(words, { y: 0, yPercent: 115 }); // replaces the CSS start position (GSAP would add to it)

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } });
      // 1. The three lines hold, then the first two lift away and the meet line recedes to the kicker
      tl.to([q("c0"), q("c1")], { autoAlpha: 0, y: -40, duration: 4, stagger: 1, ease: "power1.in" }, 8)
        .to(slot, { y: toTop, scale: 0.42, "--mute": 1, duration: 10 }, 12)
        // 2. The problem wipes on, word by word, then holds
        //    (only once the kicker has finished moving, so it never passes through the problem)
        .fromTo(q("problem"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 2, immediateRender: false }, 22)
        .to(q("problem").querySelectorAll("span"), { opacity: 1, ease: "none", duration: 2, stagger: 0.8 }, 23)
        .to(q("problem"), { autoAlpha: 0, duration: 4, ease: "power1.in" }, 40)
        // 3. As the problem goes, the kicker turns into the answer, steps up to heading size and back to ink; it stays
        .to(slot, { scale: 0.84, "--mute": 0, duration: 10 }, 41);
      addMorph(tl, slot, 41, 9);
      // 4. Own your …: each word rolls in and its line swaps under it, ten units each, the last holding to the end
      tl.set(q("own"), { autoAlpha: 1 }, 56)
        .fromTo(q("ownk"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 4, ease: "power2.out" }, 56);
      const STEPS = [58, 68, 78, 88];
      STEPS.forEach((at, i) => {
        tl.to(words[i], { yPercent: 0, duration: 4, ease: "power3.out" }, at)
          .to(lines[i], { opacity: 1, duration: 3, ease: "power2.out" }, at + 1);
        if (i < STEPS.length - 1) {
          tl.to(words[i], { yPercent: -115, duration: 4, ease: "power3.out" }, STEPS[i + 1])
            .to(lines[i], { opacity: 0, duration: 2, ease: "power1.in" }, STEPS[i + 1]);
        }
      });
      tl.to({}, { duration: 2 }, 98);
      // The drawings swap and play their one move as each word arrives (discrete, from the timeline's progress)
      return playSteps(tl, arts, STEPS.map((s) => s / 100));
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
