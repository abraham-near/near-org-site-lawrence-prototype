"use client";

import { useSyncExternalStore } from "react";

// The page's visible motion toggle (ACCEPTANCE §4, WCAG 2.2.2): pauses everything that moves on its own (the hero
// loop; the proof strip's short reveal also skips when paused). It sets html[data-motion-paused] and fires
// "near:motion"; the choice is remembered (the layout's inline script restores it before paint). Scroll-linked motion follows the user's own
// scrolling and isn't affected. Hidden with reduced motion, where nothing plays on its own anyway.
export const MOTION_EVENT = "near:motion";
export const motionPaused = () => typeof document !== "undefined" && document.documentElement.hasAttribute("data-motion-paused");

const subscribe = (cb: () => void) => { window.addEventListener(MOTION_EVENT, cb); return () => window.removeEventListener(MOTION_EVENT, cb); };

export function MotionToggle({ className }: { className?: string }) {
  const paused = useSyncExternalStore(subscribe, motionPaused, () => false);

  const toggle = () => {
    const next = !paused;
    document.documentElement.toggleAttribute("data-motion-paused", next);
    try { localStorage.setItem("near-motion", next ? "paused" : "playing"); } catch {}
    window.dispatchEvent(new Event(MOTION_EVENT));
  };

  return (
    <button type="button" className={className} aria-pressed={paused} onClick={toggle}>
      <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false">
        {paused ? <path d="M3 1.5v9l7-4.5z" fill="currentColor" /> : <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />}
      </svg>
      {paused ? "Play motion" : "Pause motion"}
    </button>
  );
}
