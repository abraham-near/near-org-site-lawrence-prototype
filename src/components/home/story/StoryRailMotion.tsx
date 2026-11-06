"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { playSteps } from "./steps";
import { addLook } from "./lookMotion";
import type { RailLook } from "./RailLooks";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MOTION = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";

// Option C's choreography (D29, D38): one scrubbed timeline over the pinned stage, 100 units long (6.2 screens of
// scroll). The world moves in steps (eased between holds), so each thing on the line stops at the centre to be read.
export function StoryRailMotion({ gate, stations, end, look }: { gate: number; stations: number[]; end: number; look: RailLook }) {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("section");
    if (!root) return;
    const q = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(`[data-s="${s}"]`)!;
    const qa = (s: string) => [...root.querySelectorAll<HTMLElement>(`[data-s="${s}"]`)];

    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const world = q("world"), problem = q("problem"), near = q("near");
      const pWords = [...problem.children], aWords = [...q("answer").children];
      const dots = qa("dot"), stops = qa("station"), arts = [...root.querySelectorAll<HTMLElement>("[data-s='station'] [data-art]")];
      // Bring a point on the track (in vw) to the middle of the screen
      const centre = (at: number) => () => -(window.innerWidth * (at - 50)) / 100;
      // The green beyond the first screen grows to a point on the track (as a share of its length, from 100vw to the end)
      const reach = (at: number) => (at - 100) / (end - 100);
      gsap.set([q("greenL"), q("greenR"), q("greenOn")], { scaleX: 0 });
      gsap.set(q("greenL"), { transformOrigin: "0% 50%" });
      gsap.set(q("greenR"), { transformOrigin: "100% 50%" });
      gsap.set(q("greenOn"), { transformOrigin: "0% 50%" });
      gsap.set([q("hub"), q("gateTile"), ...dots], { scale: 0 });
      gsap.set(qa("end"), { autoAlpha: 0 });
      gsap.set(problem, { autoAlpha: 0 });
      gsap.set(aWords, { autoAlpha: 0, y: "0.3em" });
      // Only the station being read shows; its neighbours are just their dots on the line (half-drawings cut by the
      // screen's edges read as bugs, and dimmed text would fail contrast)
      const words = stops.map((st) => [...st.querySelectorAll<HTMLElement>("[data-s='words']")]);
      const pics = stops.map((st) => st.querySelector<HTMLElement>("[data-art]")!);
      gsap.set(pics, { autoAlpha: 0 });
      gsap.set(words.flat(), { autoAlpha: 0 });

      // 0. D96 (Lawrence: "I want this type to animate up into position and not just be there when it scrolls in"): the
      //    three lines rise into place one after another as the section comes up the screen, scrubbed, landing before
      //    it pins (their inner spans, so the main timeline's exit on the lines themselves is untouched)
      gsap.fromTo(qa("cin"), { yPercent: 70, autoAlpha: 0 }, {
        yPercent: 0, autoAlpha: 1, ease: "power3.out", stagger: 0.18, duration: 1,
        scrollTrigger: { trigger: root, start: "top 85%", end: "top 15%", scrub: 0.6 },
      });

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } });
      // 1. The two sides appear and the line draws in from both into NEAR's tile, under the three lines
      tl.to(qa("end"), { autoAlpha: 1, duration: 3, stagger: 1 }, 0)
        .to([q("greenL"), q("greenR")], { scaleX: 1, duration: 7, ease: "power2.inOut" }, 1)
        .to(q("hub"), { scale: 1, duration: 2, ease: "back.out(1.6)" }, 7.5)
        //    (held on screen a while once the tile has landed: the meeting is the beat)
        .to([q("c0"), q("c1"), q("c2")], { autoAlpha: 0, y: -40, duration: 4, stagger: 1, ease: "power1.in" }, 15)
        // 2. The world slides to the layer beneath your agents; the problem wipes on at the top and holds
        .to(world, { x: centre(gate), duration: 12, ease: "power2.inOut" }, 17)
        .to(problem, { autoAlpha: 1, duration: 3 }, 22)
        .to(pWords, { opacity: 1, ease: "none", duration: 2, stagger: 0.7 }, 25)
        // 3. The answer takes the problem's place the moment it has left (no empty beat, and never the two at once) and
        //    stays; the layer becomes the user's and the line runs on green
        .to(problem, { autoAlpha: 0, y: -30, duration: 2.4, ease: "power1.in" }, 40)
        .to(aWords, { autoAlpha: 1, y: 0, duration: 3, stagger: 0.5, ease: "power2.out" }, 42.5)
        //    (D86: the drawing reads --own each frame, 0 the problem, 1 the answer, and eases its own change on a
        //    spring, so the scrub itself runs straight; from-to, so the problem holds before it. It starts as the
        //    problem starts leaving and lands, with the N, as "user-owned." finishes)
        .fromTo(near, { "--own": 0 }, { "--own": 1, duration: 8, ease: "none" }, 40)
        .to(q("greenOn"), { scaleX: reach(gate + 20), duration: 6, ease: "power2.out" }, 46)
        //    (D95: NEAR's tile lands on the line under the layer as its disc turns green; it leaves with the line)
        .to(q("gateTile"), { scale: 1, duration: 2, ease: "back.out(1.6)" }, 45.5);
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
      // A drawing plays from the moment it starts to fade in (at − 4), so it never shows its end state first and then
      // resets (D56: Orbit's sequence starts from empty)
      return playSteps(tl, arts, STEPS.map((s) => (s - 4) / 100), parallax);
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
