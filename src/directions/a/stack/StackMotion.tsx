"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LAYERS } from "@/components/home/stack/layers";
import { SELECT, STEP } from "./StackPanel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PINNED = "(min-width: 1280px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";
const FREE = "(prefers-reduced-motion: no-preference) and (not ((min-width: 1280px) and (min-height: 760px)))";

// The Stack's interactions (the live page's, StackInteractions.tsx, in this direction's attributes): hovering a layer
// in the drawing, its label or its row lifts it into the green ramp (data-hl); clicking one in the drawing selects it.
// Pinned (desktop with motion): scrolling through the track steps the selection from the core outwards and the plate
// builds to match (data-build); choosing a layer scrolls to its step. Elsewhere with motion: one build-in from the
// core the first time the plate comes into view. With reduced motion every layer shows.
export function StackMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("[data-a-stack]");
    const plate = root?.querySelector<HTMLElement>("[data-plate]");
    const track = root?.querySelector<HTMLElement>("[data-track]");
    if (!root || !plate || !track) return;
    const indexOf = (k: string | null) => LAYERS.findIndex((l) => l.key === k);
    const set = (k: string | null) => {
      const built = root.getAttribute("data-build");
      if (k && (built === null || indexOf(k) <= Number(built))) root.setAttribute("data-hl", k);
      else root.removeAttribute("data-hl");
    };
    const toneOf = (t: EventTarget | null) => (t as Element | null)?.closest?.("[data-plate] [data-tone]")?.getAttribute("data-tone") ?? null;
    const over = (e: Event) => set(toneOf(e.target));
    const leave = () => set(null);
    const click = (e: Event) => { over(e); const k = toneOf(e.target); if (k) window.dispatchEvent(new CustomEvent(SELECT, { detail: k })); };
    plate.addEventListener("pointerover", over);
    plate.addEventListener("pointerleave", leave);
    plate.addEventListener("click", click);
    const rows = [...root.querySelectorAll<HTMLElement>("[data-key]")].map((b) => {
      const on = () => set(b.dataset.key ?? null), off = () => set(null);
      b.addEventListener("pointerenter", on); b.addEventListener("pointerleave", off);
      return () => { b.removeEventListener("pointerenter", on); b.removeEventListener("pointerleave", off); };
    });

    const mm = gsap.matchMedia();
    mm.add(PINNED, () => {
      root.setAttribute("data-pinned", "");
      root.setAttribute("data-build", String(Math.max(0, indexOf(root.getAttribute("data-sel")))));
      let last = -1, seeking = -1, settle = 0;
      const stt = ScrollTrigger.create({
        trigger: track, start: "top top", end: "bottom bottom",
        onUpdate: (self) => {
          const k = Math.min(LAYERS.length - 1, Math.floor(self.progress * LAYERS.length));
          if (seeking >= 0) { if (k !== seeking) return; seeking = -1; window.clearTimeout(settle); }
          if (k !== last) { last = k; window.dispatchEvent(new CustomEvent(STEP, { detail: LAYERS[k].key })); }
        },
      });
      const onSelect = (e: Event) => {
        const k = indexOf((e as CustomEvent<string>).detail);
        if (k < 0) return;
        last = k; seeking = k;
        window.clearTimeout(settle);
        settle = window.setTimeout(() => { seeking = -1; }, 1500);
        window.scrollTo({ top: stt.start + ((k + 0.5) / LAYERS.length) * (stt.end - stt.start), behavior: "smooth" });
      };
      window.addEventListener(SELECT, onSelect);
      return () => { window.clearTimeout(settle); window.removeEventListener(SELECT, onSelect); root.removeAttribute("data-pinned"); root.removeAttribute("data-build"); };
    });
    mm.add(FREE, () => {
      root.setAttribute("data-build", "-1");
      const timers: number[] = [];
      ScrollTrigger.create({
        trigger: plate, start: "top 75%", once: true,
        onEnter: () => LAYERS.forEach((_, k) => timers.push(window.setTimeout(() => root.setAttribute("data-build", String(k)), k * 320))),
      });
      return () => { timers.forEach(clearTimeout); root.removeAttribute("data-build"); };
    });

    return () => {
      mm.revert();
      plate.removeEventListener("pointerover", over); plate.removeEventListener("pointerleave", leave); plate.removeEventListener("click", click);
      rows.forEach((off) => off());
      root.removeAttribute("data-hl");
    };
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
