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

// D97: every block of words on the rail comes on and goes off the same way, line by line: each line rises 70% of its
// height into place as it fades in, the next a beat later; leaving, each lifts 40 px as it fades. ON and OFF are the
// tweens; GAP_ON and GAP_OFF the beats between lines (timeline units, 100 in all).
const ON = { yPercent: 0, autoAlpha: 1, duration: 3, ease: "power3.out" } as const;
const FROM = { yPercent: 70, autoAlpha: 0 } as const;
const OFF = { y: -40, autoAlpha: 0, duration: 2.4, ease: "power1.in" } as const;
const GAP_ON = 0.9, GAP_OFF = 0.5;
// Words (inline-block spans) grouped into the lines they wrap onto
function lines(words: HTMLElement[]) {
  const rows = new Map<number, HTMLElement[]>();
  words.forEach((w) => { const k = Math.round(w.offsetTop); rows.set(k, [...(rows.get(k) ?? []), w]); });
  return [...rows.keys()].sort((x, y) => x - y).map((k) => rows.get(k)!);
}
const comeOn = (tl: gsap.core.Timeline, rows: Element[][], at: number) =>
  rows.forEach((r, i) => tl.fromTo(r, FROM, { ...ON, immediateRender: false }, at + i * GAP_ON));
const goOff = (tl: gsap.core.Timeline, rows: Element[][], at: number) =>
  rows.forEach((r, i) => tl.to(r, OFF, at + i * GAP_OFF));

// Option C's choreography (D29, D38): one scrubbed timeline over the pinned stage, 100 units long (6.2 screens of
// scroll). The world moves in steps (eased between holds), so each thing on the line stops at the centre to be read.
export function StoryRailMotion({ gate, stations, look }: { gate: number; stations: number[]; end?: number; look: RailLook }) {
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
      gsap.set([q("greenL"), q("greenR")], { scaleX: 0 });
      gsap.set(q("greenL"), { transformOrigin: "0% 50%" });
      gsap.set(q("greenR"), { transformOrigin: "100% 50%" });
      gsap.set([q("hub"), q("gateTile"), ...dots], { scale: 0 });
      gsap.set(qa("end"), { autoAlpha: 0 });
      gsap.set([...pWords, ...aWords], FROM);
      // Only the station being read shows; its neighbours are just their dots on the line (half-drawings cut by the
      // screen's edges read as bugs, and dimmed text would fail contrast)
      const words = stops.map((st) => [...st.querySelectorAll<HTMLElement>("[data-s='words']")]);
      const pics = stops.map((st) => st.querySelector<HTMLElement>("[data-art]")!);
      gsap.set(pics, { autoAlpha: 0 });
      gsap.set(words.flat(), FROM);

      // 0. D96, D97 (Lawrence: "I want this type to animate up into position…"; then "the type should animate on later,
      //    its too soon so I don't see it, it should happen as the scroll starts to ease to its locked position"): the
      //    three lines rise into place one after another over the last stretch before the section locks and the first
      //    moments after, scrubbed (their inner spans, so the lines' own exit on the main timeline is untouched)
      gsap.fromTo(qa("cin"), FROM, {
        ...ON, stagger: 0.3, duration: 1,
        scrollTrigger: { trigger: root, start: "top 30%", end: "top -20%", scrub: 0.6 },
      });

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true } });
      // 1. The two sides appear and the line draws in from both into NEAR's tile, under the three lines
      tl.to(qa("end"), { autoAlpha: 1, duration: 3, stagger: 1 }, 0)
        .to([q("greenL"), q("greenR")], { scaleX: 1, duration: 7, ease: "power2.inOut" }, 1)
        //    (held on screen a while once the tile has landed: the meeting is the beat)
        .to(q("hub"), { scale: 1, duration: 2, ease: "back.out(1.6)" }, 7.5)
        // 2. The world slides to the layer beneath your agents
        .to(world, { x: centre(gate), duration: 12, ease: "power2.inOut" }, 17)
        //    (D99, Lawrence: "the green line to the right of the near green box can fade out as we start scrolling
        //    leaving the black line": the green that came in from blockchain fades as the slide starts)
        .to(q("greenR"), { autoAlpha: 0, duration: 4, ease: "power1.inOut" }, 17);
      // (D97: every block of words comes on and goes off line by line, the same way; the three lines go first)
      goOff(tl, [[q("c0")], [q("c1")], [q("c2")]], 15);
      // the problem rises on at the top and holds; then lifts off, and the answer rises into its place the moment it
      // has gone (no empty beat, and never the two at once) and stays; the layer becomes the user's
      const pRows = lines(pWords as HTMLElement[]), aRows = lines(aWords as HTMLElement[]);
      comeOn(tl, pRows, 22);
      goOff(tl, pRows, 40);
      comeOn(tl, aRows, 40 + (pRows.length - 1) * GAP_OFF + OFF.duration);
      tl
        //    (D86: the drawing reads --own each frame, 0 the problem, 1 the answer, and eases its own change on a
        //    spring, so the scrub itself runs straight; from-to, so the problem holds before it. It starts as the
        //    problem starts leaving and lands, with the N, as "user-owned." finishes)
        .fromTo(near, { "--own": 0 }, { "--own": 1, duration: 8, ease: "none" }, 40)
        //    (D95: NEAR's tile lands on the line under the layer as its disc turns green; it leaves with the line)
        .to(q("gateTile"), { scale: 1, duration: 2, ease: "back.out(1.6)" }, 45.5);
      // 4. Station by station: the world moves on, the station's dot lands in the box and its drawing plays
      const STEPS = [62, 72, 82, 92];
      STEPS.forEach((at, i) => {
        tl.to(world, { x: centre(stations[i]), duration: 6, ease: "power2.inOut" }, at - 6)
          .to(dots[i], { scale: 1, duration: 2, ease: "back.out(2)" }, at - 1.5)
          .to(pics[i], { autoAlpha: 1, duration: 4 }, at - 4);
        comeOn(tl, words[i].map((w) => [w]), at - 3);
        if (i > 0) {
          tl.to(pics[i - 1], { autoAlpha: 0, duration: 3, ease: "power1.in" }, at - 6);
          goOff(tl, words[i - 1].map((w) => [w]), at - 6);
        }
      });
      tl.to({}, { duration: 2 }, 98);
      // The look's own layers and moves (D32), and its parallax on every update
      const parallax = addLook(look, { tl, root, world, gateX: centre(gate), steps: STEPS });
      // A drawing plays from the moment it starts to fade in (at − 4), so it never shows its end state first and then
      // resets (D56: Orbit's sequence starts from empty)
      // D100 (Lawrence: "the green line should start in the middle of the black box … and extend to the left, we don't
      // see it on the right of it… The behavior of the line in … the Own Your 4 sections is the behavior I want
      // everywhere"): once drawn in from AI, the green rides with the reader, from the left edge to the box's middle,
      // by cancelling the world's travel on it (it stays under the tiles, which are in the world above it)
      const setGreen = gsap.quickSetter(q("greenL"), "x", "px");
      const update = () => { parallax(); setGreen(-Number(gsap.getProperty(world, "x"))); };
      return playSteps(tl, arts, STEPS.map((s) => (s - 4) / 100), update);
    });
    return () => mm.revert();
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
