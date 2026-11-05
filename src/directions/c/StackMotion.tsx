"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LAYERS } from "@/components/home/stack/layers";
import { SELECT, STEP } from "./StackPanels";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The Stack's behaviour, as on the current homepage (D18, D21): hovering a row or a layer in the drawing shows that
// layer in full colour (data-hl); clicking a layer in the drawing selects it. Pinned (desktop with motion and room):
// scrolling steps through the layers from the core outwards and the drawing builds to match (data-build); choosing a
// layer scrolls to its step. Elsewhere with motion: one build-in from the core, once. Reduced motion: every layer shows.
const PINNED = "(min-width: 1280px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";
const FREE = "(prefers-reduced-motion: no-preference) and (not ((min-width: 1280px) and (min-height: 760px)))";

export function StackMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("[data-c-stack]");
    const svg = root?.querySelector<SVGSVGElement>("[data-iso]");
    const track = root?.querySelector<HTMLElement>("[data-track]");
    if (!root || !svg || !track) return;
    const indexOf = (key: string | null) => LAYERS.findIndex((l) => l.key === key);
    const set = (key: string | null) => {
      const built = root.getAttribute("data-build");
      if (key && (built === null || indexOf(key) <= Number(built))) root.setAttribute("data-hl", key);
      else root.removeAttribute("data-hl");
    };
    const toneOf = (t: EventTarget | null) => (t as Element | null)?.closest?.("[data-iso] [data-tone]")?.getAttribute("data-tone") ?? null;
    const over = (e: Event) => set(toneOf(e.target));
    const leave = () => set(null);
    const click = (e: Event) => { over(e); const k = toneOf(e.target); if (k) window.dispatchEvent(new CustomEvent(SELECT, { detail: k })); };
    svg.addEventListener("pointerover", over);
    svg.addEventListener("pointerleave", leave);
    svg.addEventListener("click", click);
    const rows = [...root.querySelectorAll<HTMLElement>("[data-key]")];
    const offs = rows.map((r) => {
      const on = () => set(r.dataset.key ?? null);
      r.addEventListener("pointerenter", on); r.addEventListener("pointerleave", leave);
      return () => { r.removeEventListener("pointerenter", on); r.removeEventListener("pointerleave", leave); };
    });

    const mm = gsap.matchMedia();
    mm.add(PINNED, () => {
      root.setAttribute("data-pinned", "");
      root.setAttribute("data-build", String(Math.max(0, indexOf(root.getAttribute("data-active-layer")))));
      let last = -1, seeking = -1, settle = 0;
      const st = ScrollTrigger.create({
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
        window.scrollTo({ top: st.start + ((k + 0.5) / LAYERS.length) * (st.end - st.start), behavior: "smooth" });
      };
      window.addEventListener(SELECT, onSelect);
      return () => { window.clearTimeout(settle); window.removeEventListener(SELECT, onSelect); root.removeAttribute("data-pinned"); root.removeAttribute("data-build"); };
    });
    mm.add(FREE, () => {
      root.setAttribute("data-build", "-1");
      const timers: number[] = [];
      ScrollTrigger.create({
        trigger: svg, start: "top 75%", once: true,
        onEnter: () => LAYERS.forEach((_, k) => timers.push(window.setTimeout(() => root.setAttribute("data-build", String(k)), k * 320))),
      });
      return () => { timers.forEach(clearTimeout); root.removeAttribute("data-build"); };
    });

    return () => {
      mm.revert();
      svg.removeEventListener("pointerover", over); svg.removeEventListener("pointerleave", leave); svg.removeEventListener("click", click);
      offs.forEach((off) => off());
      root.removeAttribute("data-hl");
    };
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
