"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SELECT_EVENT } from "./StackLayers";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LAYERS = ["protocol", "intents", "ai", "com"] as const;

// Hover or focus on a layer (in the drawing) or its row in the list highlights it in the drawing: data-hl on the
// section drives CSS. Clicking a layer in the drawing selects it in the list. The Chapter 1 hand-off line is placed
// over the drawing's own thread (--handoff-x/-h), wherever the layout puts the drawing. Plus one build-in, from the
// core outwards, the first time the drawing comes into view (motion allowed only).
export function StackInteractions() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = anchor.current?.closest<HTMLElement>("[data-stack]");
    const svg = root?.querySelector<SVGSVGElement>("[data-iso]");
    if (!root || !svg) return;
    const set = (key: string | null) => (key ? root.setAttribute("data-hl", key) : root.removeAttribute("data-hl"));
    const toneOf = (t: EventTarget | null) => (t as Element | null)?.closest?.("[data-iso] [data-tone]")?.getAttribute("data-tone") ?? null; // layers only, not the band's own tone

    const onSvgOver = (e: Event) => set(toneOf(e.target));
    const onSvgLeave = () => set(null);
    svg.addEventListener("pointerover", onSvgOver);
    svg.addEventListener("pointerleave", onSvgLeave);
    const onSvgClick = (e: Event) => {
      onSvgOver(e); // touch: highlight too
      const key = toneOf(e.target);
      if (key) window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: key }));
    };
    svg.addEventListener("click", onSvgClick);

    // The hand-off: from the band's top edge down to the top of the drawing's thread, at its x
    const line = svg.querySelector<SVGGraphicsElement>("[data-thread] line");
    const place = () => {
      if (!line) return;
      const b = root.getBoundingClientRect(), t = line.getBoundingClientRect();
      root.style.setProperty("--handoff-x", `${t.left + t.width / 2 - b.left}px`);
      root.style.setProperty("--handoff-h", `${Math.max(0, t.top - b.top)}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(root);
    const blocks = [...root.querySelectorAll<HTMLElement>("[data-key]")];
    const handlers = blocks.map((b) => {
      const on = () => set(b.dataset.key ?? null), off = () => set(null);
      b.addEventListener("pointerenter", on); b.addEventListener("pointerleave", off);
      b.addEventListener("focusin", on); b.addEventListener("focusout", off);
      return () => { b.removeEventListener("pointerenter", on); b.removeEventListener("pointerleave", off); b.removeEventListener("focusin", on); b.removeEventListener("focusout", off); };
    });

    // Build-in: each layer drops into place and fades up, core first (opacity + a translate held in --drop,
    // so it composes with the hover lift).
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const groups = LAYERS.map((l) => svg.querySelectorAll(`[data-tone="${l}"]`));
      // CSS transitions stand down from setup until the build-in completes: GSAP writes every block's start state at
      // load, and with transitions on that launched ~180 transitions at once (the page's main blocking cost). When done,
      // re-measure the hand-off (the drop moved the thread) and hand opacity back to CSS (the resting dim).
      root.setAttribute("data-building", "");
      const tl = gsap.timeline({ paused: true, onComplete: () => { root.removeAttribute("data-building"); place(); groups.forEach((g) => gsap.set(g, { clearProps: "opacity" })); } });
      groups.forEach((g, n) => tl.fromTo(g, { opacity: 0, "--drop": "-28px" }, { opacity: 1, "--drop": "0px", duration: 0.6, ease: "power3.out" }, n * 0.14));
      ScrollTrigger.create({ trigger: svg, start: "top 75%", once: true, onEnter: () => tl.play() });
      return () => root.removeAttribute("data-building");
    });

    return () => {
      mm.revert();
      svg.removeEventListener("pointerover", onSvgOver); svg.removeEventListener("pointerleave", onSvgLeave); svg.removeEventListener("click", onSvgClick);
      ro.disconnect();
      handlers.forEach((off) => off());
      root.removeAttribute("data-hl");
    };
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
