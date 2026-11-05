"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MOTION = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";

type Track = { hub: number; gate: number; own: number[]; end: number };

// The story's choreography (Story.tsx), desktop with motion only; elsewhere everything shows at rest.
// Anthem: pinned; each word goes from 18% to full, left to right; under each line its baseline draws as the line goes
// solid and the line's number arrives (scrubbed, 0.6 s smoothing).
// Traverse: one scrubbed timeline, 100 units over the pinned stage. The track moves in steps (eased between holds), so
// every station stops in the middle to be read; the green runs on behind the reader from NEAR; the chainage readout
// counts the distance travelled. Stations draw their figures when they come into view (Watch.tsx).
export function StoryMotion({ track }: { track: Track }) {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("section");
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      // ---- the anthem
      const an = root.querySelector<HTMLElement>("[data-an='root']")!;
      const lines = [...an.querySelectorAll<HTMLElement>("[data-an='line']")];
      const atl = gsap.timeline({ scrollTrigger: { trigger: an, start: "top top", end: "bottom bottom", scrub: 0.6 } });
      let at = 0;
      lines.forEach((ln) => {
        const words = [...ln.querySelectorAll<HTMLElement>("[data-an='w']")];
        const rule = ln.querySelector<HTMLElement>("[data-an='rule']");
        const no = ln.querySelector<HTMLElement>("[data-an='no']");
        atl.fromTo(words, { opacity: 0.18 }, { opacity: 1, duration: 1, stagger: 0.55, ease: "none" }, at);
        const len = 1 + (words.length - 1) * 0.55;
        if (rule) atl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: len, ease: "none" }, at);
        if (no) atl.fromTo(no, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, at + len - 0.6);
        at += len;
      });
      atl.to({}, { duration: at * 0.18 });

      // ---- the traverse
      const tr = root.querySelector<HTMLElement>("[data-tr='root']")!;
      const q = (k: string) => tr.querySelector<HTMLElement>(`[data-tr='${k}']`)!;
      const qa = (k: string) => [...tr.querySelectorAll<HTMLElement>(`[data-tr='${k}']`)];
      const trk = q("track"), readout = q("ch");
      const centre = (x: number) => () => -(window.innerWidth * (x - 50)) / 100;
      // the green from NEAR (50vw) to a point on the track, as a share of its length
      const reach = (x: number) => (x - 50) / (track.end - 80);
      const gate = q("gate");
      const before = [...gate.querySelectorAll<SVGElement>("[data-tr='before']")];
      const after = [...gate.querySelectorAll<SVGElement>("[data-tr='after'], [data-tr='tag']")];

      gsap.set([q("halfL"), q("halfR")], { scaleX: 0 });
      gsap.set(q("hub"), { scale: 0 });
      gsap.set(qa("end"), { autoAlpha: 0 });
      gsap.set([q("problem"), q("answer")], { autoAlpha: 0, y: 16 });
      gsap.set(before, { opacity: 1 });
      gsap.set(after, { opacity: 0 });
      trk.style.setProperty("--g", "0");

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: tr, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } });
      tl.to(qa("end"), { autoAlpha: 1, duration: 3, stagger: 1 }, 0)
        .to([q("halfL"), q("halfR")], { scaleX: 1, duration: 7 }, 1)
        .to(q("hub"), { scale: 1, duration: 2, ease: "back.out(1.6)" }, 7.5)
        .to(q("connect"), { autoAlpha: 0, y: -24, duration: 4, ease: "power1.in" }, 16)
        .to(trk, { x: centre(track.gate), duration: 12 }, 17)
        .to(trk, { "--g": reach(track.gate - 12), duration: 12 }, 17)
        .to(q("problem"), { autoAlpha: 1, y: 0, duration: 4, ease: "power2.out" }, 23)
        .to(q("problem"), { autoAlpha: 0, y: -24, duration: 3, ease: "power1.in" }, 40)
        .to(q("answer"), { autoAlpha: 1, y: 0, duration: 4, ease: "power2.out" }, 42)
        .to(before, { opacity: 0, duration: 4 }, 42)
        .to(after, { opacity: 1, duration: 4, stagger: 0.8 }, 43)
        .to(trk, { "--g": reach(track.gate), duration: 3 }, 44);
      const STEPS = [58, 68, 78, 88];
      STEPS.forEach((t, i) => {
        tl.to(trk, { x: centre(track.own[i]), duration: 6 }, t - 6)
          .to(trk, { "--g": reach(track.own[i]), duration: 6 }, t - 6);
      });
      // the last station holds to the end; the green runs on to the terminus beside it
      tl.to(trk, { "--g": 1, duration: 5, ease: "power1.out" }, 90).to({}, { duration: 2 }, 98);

      // chainage readout: the track's own distance at the middle of the screen
      const onUpdate = () => {
        const x = -(gsap.getProperty(trk, "x") as number) / window.innerWidth * 100 + 50;
        const v = Math.max(0, x);
        readout.textContent = `${Math.floor(v / 100)}+${String(Math.round((v % 100) * 10)).padStart(3, "0")}`;
      };
      tl.eventCallback("onUpdate", onUpdate);
      onUpdate();
      return () => { tl.eventCallback("onUpdate", null); trk.style.removeProperty("--g"); };
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
