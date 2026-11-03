"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { addMorph, hideAnswer } from "./morph";
import { playSteps } from "./steps";
import { addLook } from "./lookMotion";
import type { RailLook } from "./RailLooks";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MOTION = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";

// Option C's choreography (D29): one scrubbed timeline over the pinned stage, 100 units long (6.2 screens of scroll).
// The world moves in steps (eased between holds), so each thing on the line stops at the centre to be read.
export function StoryRailMotion({ gate, stations, end, look }: { gate: number; stations: number[]; end: number; look: RailLook }) {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("section");
    if (!root) return;
    const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(`[data-s="${s}"]`)!;
    const qa = (s: string) => [...root.querySelectorAll<HTMLElement>(`[data-s="${s}"]`)];

    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const stage = q("stage"), world = q("world"), slot = root.querySelector<HTMLElement>("[data-morph]")!;
      const connect = slot.parentElement!;
      const dots = qa("dot"), stops = qa("station"), arts = [...root.querySelectorAll<HTMLElement>("[data-s='station'] [data-art]")];
      // Bring a point on the track (in vw) to the middle of the screen
      const centre = (at: number) => () => -(window.innerWidth * (at - 50)) / 100;
      const toTop = () => stage.clientHeight * 0.12 - (connect.offsetTop + slot.offsetTop);
      // The green beyond the box grows to a point on the track (as a share of its length, from 100vw to the end)
      const reach = (at: number) => (at - 100) / (end - 100);
      hideAnswer(slot);
      gsap.set([q("greenL"), q("greenR"), q("greenOn")], { scaleX: 0 });
      gsap.set(q("greenL"), { transformOrigin: "0% 50%" });
      gsap.set(q("greenR"), { transformOrigin: "100% 50%" });
      gsap.set(q("greenOn"), { transformOrigin: "0% 50%" });
      gsap.set([q("point"), ...dots], { scale: 0 });
      gsap.set(qa("end"), { autoAlpha: 0 });
      // Only the station being read shows; its neighbours are just their dots on the line (half-drawings cut by the
      // screen's edges read as bugs, and dimmed text would fail contrast)
      const words = stops.map((st) => [...st.querySelectorAll<HTMLElement>("[data-s='words']")]);
      const pics = stops.map((st) => st.querySelector<HTMLElement>("[data-art]")!);
      gsap.set(pics, { autoAlpha: 0 });
      gsap.set(words.flat(), { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } });
      // 1. The line draws in from both ends and meets at NEAR's point, under the three lines
      tl.to(qa("end"), { autoAlpha: 1, duration: 3, stagger: 1 }, 0)
        .to([q("greenL"), q("greenR")], { scaleX: 1, duration: 7, ease: "power2.inOut" }, 1)
        .to(q("point"), { scale: 1, duration: 2, ease: "back.out(2)" }, 7.5)
        .to([q("c0"), q("c1")], { autoAlpha: 0, y: -40, duration: 4, stagger: 1, ease: "power1.in" }, 10)
        .to(slot, { y: toTop, scale: 0.5, "--mute": 1, duration: 10 }, 12)
        // 2. The world slides to the box; the problem wipes on as the box shuts
        .to(world, { x: centre(gate), duration: 12, ease: "power2.inOut" }, 14)
        //    (the words start once the kicker has finished moving)
        .to(q("problem").querySelectorAll("span"), { opacity: 1, ease: "none", duration: 2, stagger: 0.7 }, 23)
        .to([q("gateTop"), q("gateBottom")], { "--shut": 1, duration: 6 }, 24)
        .to(q("problem"), { autoAlpha: 0, duration: 4, ease: "power1.in" }, 40)
        // 3. As the problem goes, the kicker turns into the answer and stays; the box splits open, the line runs on green
        //    past it, and the halves fade away
        .to(slot, { scale: 0.86, "--mute": 0, duration: 10 }, 41)
        .to(q("gateTop"), { yPercent: -70, "--shut": 0, duration: 7, ease: "power3.inOut" }, 44)
        .to(q("gateBottom"), { yPercent: 70, "--shut": 0, duration: 7, ease: "power3.inOut" }, 44)
        .to(q("greenOn"), { scaleX: reach(gate + 20), duration: 6, ease: "power2.out" }, 46)
        .to([q("gateTop"), q("gateBottom")], { autoAlpha: 0, duration: 4 }, 51);
      addMorph(tl, slot, 41, 9);
      // 4. Station by station: the world moves on, the green runs ahead to the station, its dot lands and its drawing plays
      const STEPS = [62, 72, 82, 92];
      STEPS.forEach((at, i) => {
        tl.to(world, { x: centre(stations[i]), duration: 6, ease: "power2.inOut" }, at - 6)
          .to(q("greenOn"), { scaleX: reach(stations[i]), duration: 6, ease: "power2.inOut" }, at - 6)
          .to(dots[i], { scale: 1, duration: 2, ease: "back.out(2)" }, at - 1.5)
          .to(pics[i], { autoAlpha: 1, duration: 4 }, at - 4)
          .fromTo(words[i], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 4, stagger: 0.6, ease: "power2.out" }, at - 3);
        if (i > 0) tl.to([pics[i - 1], ...words[i - 1]], { autoAlpha: 0, duration: 3, ease: "power1.in" }, at - 6);
      });
      tl.to({}, { duration: 2 }, 98);
      // The look's own layers and moves (D32), and its parallax on every update
      const parallax = addLook(look, { tl, root, world, gateX: centre(gate), steps: STEPS });
      return playSteps(tl, arts, STEPS.map((s) => (s - 1) / 100), parallax);
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
