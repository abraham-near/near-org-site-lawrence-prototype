"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// "The black change" (D11): as the footer scrolls in, the ink rises from its bottom edge over the page's last ground
// (scaleY on the layer, transform only). The layer's cream copy of the footer is counter-scaled by the inverse, so
// its type is uncovered at true size rather than stretched. Scrubbed with the page's smoothing (D8). Once complete,
// the real footer takes its ink colours (data-wiped) and the layer steps aside.
export function FooterReveal() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const footer = anchor.current?.closest<HTMLElement>("[data-footer]");
    const ink = footer?.querySelector<HTMLElement>("[data-footer-ink]");
    const content = footer?.querySelector<HTMLElement>("[data-footer-ink-content]");
    if (!footer || !ink || !content) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const set = (p: number) => {
        const s = Math.max(p, 0.001);
        ink.style.transform = `scaleY(${s})`;
        content.style.transform = `scaleY(${1 / s})`;
        footer.toggleAttribute("data-wiped", p >= 0.999);
      };
      const state = { p: 0 };
      set(0);
      gsap.to(state, {
        p: 1, ease: "none",
        scrollTrigger: { trigger: footer, start: "top bottom", end: "top 25%", scrub: 0.6 },
        onUpdate: () => set(state.p),
      });
      return () => { ink.style.transform = ""; content.style.transform = ""; };
    });
    return () => { mm.revert(); footer.removeAttribute("data-wiped"); };
  }, { scope: anchor });

  return <span ref={anchor} hidden />;
}
