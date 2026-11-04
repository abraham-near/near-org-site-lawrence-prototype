"use client";

import { useEffect, useRef, useState } from "react";

// Draws fine connectors between marked points in its parent (round 3 lab options, D36): each [data-wire-start="k"]
// joins [data-wire-end="k"] with a cubic curve that leaves and arrives horizontally (after Tempo's settlement
// diagram). Optional [data-wire-label="k"] elements are placed at a curve's midpoint. Hovering or focusing
// [data-voice="k"] marks curve k hot (the CSS turns it mint). Re-measured on resize, once fonts load, and after any
// transition inside the parent ends (an entrance that moves the ends would otherwise leave the curves short). With
// `cased`, each curve is drawn twice, a wider light casing under the line, so it reads over a photograph. The parent
// must be position: relative; the SVG is decorative.
type Wire = { k: string; d: string; mid: { x: number; y: number } };

export function Wires({ className, cased }: { className?: string; cased?: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const [wires, setWires] = useState<Wire[]>([]);
  const [hot, setHot] = useState<string | null>(null);

  useEffect(() => {
    const host = svg.current?.parentElement;
    if (!host) return;
    const measure = () => {
      const box = host.getBoundingClientRect();
      // Both ends are taken at the marked element's centre
      const at = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      };
      const next: Wire[] = [];
      host.querySelectorAll<HTMLElement>("[data-wire-start]").forEach((s) => {
        const k = s.dataset.wireStart!;
        const e = host.querySelector(`[data-wire-end="${k}"]`);
        if (!e || !s.offsetParent) return;
        const a = at(s), b = at(e), dx = (b.x - a.x) * 0.55;
        const d = `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
        next.push({ k, d, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } });
      });
      setWires(next);
      host.querySelectorAll<HTMLElement>("[data-wire-label]").forEach((l) => {
        const w = next.find((x) => x.k === l.dataset.wireLabel);
        if (w) { l.style.left = `${w.mid.x}px`; l.style.top = `${w.mid.y}px`; }
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    document.fonts?.ready.then(measure);
    let raf = 0;
    const settle = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    host.addEventListener("transitionend", settle);

    const voices = [...host.querySelectorAll<HTMLElement>("[data-voice]")];
    const offs = voices.map((v) => {
      const on = () => setHot(v.dataset.voice ?? null), off = () => setHot(null);
      v.addEventListener("pointerenter", on); v.addEventListener("pointerleave", off);
      v.addEventListener("focusin", on); v.addEventListener("focusout", off);
      return () => { v.removeEventListener("pointerenter", on); v.removeEventListener("pointerleave", off); v.removeEventListener("focusin", on); v.removeEventListener("focusout", off); };
    });
    return () => { ro.disconnect(); cancelAnimationFrame(raf); host.removeEventListener("transitionend", settle); offs.forEach((f) => f()); };
  }, []);

  useEffect(() => {
    const host = svg.current?.parentElement;
    if (!host) return;
    host.querySelectorAll<HTMLElement>("[data-voice],[data-wire-end],[data-wire-start],[data-wire-label]").forEach((el) => {
      const k = el.dataset.voice ?? el.dataset.wireEnd ?? el.dataset.wireStart ?? el.dataset.wireLabel;
      el.toggleAttribute("data-hot", k === hot);
    });
  }, [hot]);

  return (
    <svg ref={svg} className={className} aria-hidden="true" width="100%" height="100%">
      {cased && wires.map((w) => <path key={`c${w.k}`} d={w.d} data-casing fill="none" />)}
      {wires.map((w) => <path key={w.k} d={w.d} data-k={w.k} data-hot={w.k === hot || undefined} fill="none" />)}
    </svg>
  );
}
