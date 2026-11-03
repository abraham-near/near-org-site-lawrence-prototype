"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { addMorph, hideAnswer } from "./morph";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MOTION = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";

// Option A's choreography (D29): one scrubbed timeline over the pinned stage, 100 units long (6 screens of scroll).
export function StoryLayerMotion({ cell, x }: { cell: number; x: number }) {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("section");
    if (!root) return;
    const q = <T extends Element = HTMLElement>(s: string, from: ParentNode = root) => from.querySelector<T>(`[data-s="${s}"]`)!;
    const qa = <T extends Element = HTMLElement>(s: string, from: ParentNode = root) => [...from.querySelectorAll<T>(`[data-s="${s}"]`)];

    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const stage = q("stage"), slot = root.querySelector<HTMLElement>("[data-morph]")!;
      const rows = qa("row"), lines = qa("oline"), cells = qa<SVGGElement>("cell");
      const layer = q<SVGGElement>("layer"), link = q<SVGLineElement>("linkline");
      const toTop = () => stage.clientHeight * 0.16 - slot.offsetTop;
      const centre = (i: number) => x + i * cell + cell / 2;
      hideAnswer(slot);
      gsap.set(qa("frame"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(link, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set([...qa("label"), q("layerLabel"), q("point")], { autoAlpha: 0 });
      gsap.set(q("cells"), { autoAlpha: 0 });
      gsap.set(q("green"), { scaleX: 0, transformOrigin: "0% 50%" });

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } });
      // 1. The cross-section draws itself: the three bands, their names, then the green line through the middle and its
      //    point, while the three lines hold. Then the first two leave and the meet line recedes to the kicker.
      tl.to(qa("frame"), { strokeDashoffset: 0, duration: 6, stagger: 1.5, ease: "power1.inOut" }, 0)
        .to([...qa("label"), q("layerLabel")], { autoAlpha: 1, duration: 4, stagger: 1 }, 4)
        .to(link, { strokeDashoffset: 0, duration: 5, ease: "power1.inOut" }, 6)
        .fromTo(q("point"), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 2, ease: "back.out(2)" }, 10.5)
        .to([q("c0"), q("c1")], { autoAlpha: 0, y: -40, duration: 4, stagger: 1, ease: "power1.in" }, 10)
        .to(slot, { y: toTop, scale: 0.5, "--mute": 1, duration: 10 }, 14)
        // 2. The problem wipes on; the layer goes dark and swallows the point (it isn't NEAR's line any more)
        //    (only once the kicker has finished moving, so it never passes through the problem)
        .fromTo(q("problem"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 2, immediateRender: false }, 24)
        .to(q("problem").querySelectorAll("span"), { opacity: 1, ease: "none", duration: 2, stagger: 0.7 }, 25)
        .to(q("dark"), { opacity: 1, duration: 8 }, 26)
        .to(q("layerLabel"), { "--inv": 1, duration: 6 }, 27)
        .to(q("point"), { autoAlpha: 0, scale: 0.4, duration: 4 }, 28)
        .to(link, { opacity: 0.25, duration: 6 }, 28)
        .to(q("problem"), { autoAlpha: 0, duration: 4, ease: "power1.in" }, 40)
        // 3. As the problem goes, the kicker turns into the answer at heading size and stays; the layer turns green from
        //    the left and is named user-owned
        .to(slot, { scale: 1, "--mute": 0, duration: 10 }, 41)
        .to(q("green"), { scaleX: 1, duration: 9, ease: "power2.inOut" }, 43)
        .to(q("layerLabel"), { "--inv": 0, duration: 4 }, 46)
        .to(link, { opacity: 1, duration: 4 }, 47)
        .to(q("ownedLabel"), { opacity: 1, duration: 3 }, 50);
      addMorph(tl, slot, 41, 9);
      // 4. The layer opens into four cells; "Own your …" builds a list on the left, one line read at a time, its cell
      //    lit and the green line moving to run through it
      tl.to(layer, { autoAlpha: 0, duration: 2 }, 57)
        .set(q("cells"), { autoAlpha: 1 }, 57)
        .to(cells.map((c) => c.querySelector("rect")), { attr: { x: (i: number) => x + i * cell + 6, width: cell - 12 }, duration: 4, ease: "power3.inOut" }, 57.5)
        .set(q("own"), { autoAlpha: 1 }, 58);
      // The line under row i pushes the rows after it down by its own height; a row arrives from that offset as the line
      // above it closes, so each lands just under the one before (transforms only, measured in layout pixels)
      const gap = (i: number) => () => lines[i].offsetHeight;
      const STEPS = [60, 70, 80, 90];
      STEPS.forEach((at, i) => {
        tl.fromTo(rows[i], { opacity: 0, y: i > 0 ? () => lines[i - 1].offsetHeight + 16 : 16 }, { opacity: 1, y: 0, duration: 4, ease: "power2.inOut", immediateRender: false }, at)
          .to(lines[i], { opacity: 1, duration: 3, ease: "power2.out" }, at + 1)
          .to(cells[i], { "--on": 1, duration: 3 }, at)
          .to(link, { attr: { x1: centre(i), x2: centre(i) }, duration: 4, ease: "power3.inOut" }, at);
        if (rows[i + 1]) tl.to(rows.slice(i + 1), { y: gap(i), duration: 4, ease: "power2.inOut" }, at);
        if (i > 0) {
          tl.to(rows[i - 1], { "--dim": 1, duration: 3 }, at)
            .to(lines[i - 1], { opacity: 0, duration: 2, ease: "power1.in" }, at)
            .to(cells[i - 1], { "--on": 0, duration: 3 }, at);
        }
      });
      tl.to({}, { duration: 2 }, 98);
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
