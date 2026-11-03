"use client";

import { useEffect, useRef } from "react";

// Hovering an "Own your …" drawing replays its one small move (D28, after Tempo's cards: the drawing re-runs its
// story while the words beside it hold still). Mouse only, with motion allowed; a drawing that is still playing isn't
// restarted, and on a pinned stage only the drawing on show (data-on) answers. Stages can sit under a copy layer, so the
// pointer is tested against each drawing's box rather than waiting for it to receive the event. Mounted inside the story
// section (D29); a stage marks its drawings' holder with data-own-stage.
const CAN = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function OwnReplay() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>("section");
    if (!root) return;
    const can = matchMedia(CAN);
    const arts = [...root.querySelectorAll<HTMLElement>("[data-art]")];
    const shown = (a: HTMLElement) => a.getClientRects().length > 0 && (!a.closest("[data-own-stage]") || a.hasAttribute("data-on"));
    let inside: HTMLElement | undefined;
    const onMove = (e: PointerEvent) => {
      if (!can.matches || e.pointerType !== "mouse") return;
      const hit = arts.find((a) => {
        if (!shown(a)) return false;
        const r = a.getBoundingClientRect();
        return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      });
      if (hit === inside) return;
      inside = hit; // replay only on entering a drawing
      if (!hit || hit.getAnimations({ subtree: true }).some((a) => a.playState === "running")) return;
      hit.removeAttribute("data-play");
      void hit.getBoundingClientRect(); // restart the CSS moves
      hit.setAttribute("data-play", "");
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    return () => root.removeEventListener("pointermove", onMove);
  }, []);

  return <span ref={anchor} hidden />;
}
