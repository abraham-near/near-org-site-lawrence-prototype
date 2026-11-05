"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { LAYERS, type LayerKey } from "@/components/home/stack/layers";
import glass from "../glass.module.css";
import s from "./Stack.module.css";

// The layer list (a vertical tablist, core first) and the selected layer's detail on a dark glass panel. The section
// root carries data-active (the selected layer lifts in the drawing) and data-hover (the others dim to smoke). Clicking
// a slab in the drawing selects it too. The first time the band is in view the slabs build out from the core
// (data-in; CSS transitions, transform and opacity only). Without JS every panel shows, stacked, and every slab shows.
const noop = () => () => {};

export function StackTabs() {
  const [active, setActive] = useState<LayerKey>("protocol");
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => { wrap.current?.closest<HTMLElement>("#stack")?.setAttribute("data-active", active); }, [active]);

  useEffect(() => {
    const root = wrap.current?.closest<HTMLElement>("#stack");
    if (!root) return;
    const hover = (k: string | null) => (k ? root.setAttribute("data-hover", k) : root.removeAttribute("data-hover"));
    const over = (e: Event) => {
      const el = (e.target as Element).closest<HTMLElement | SVGElement>("[data-layer],[data-key]");
      hover(el ? el.dataset.layer ?? el.dataset.key ?? null : null);
    };
    const out = () => hover(null);
    const click = (e: Event) => {
      const k = (e.target as Element).closest<SVGElement>("[data-layer]")?.dataset.layer as LayerKey | undefined;
      if (k) setActive(k);
    };
    const art = root.querySelector<HTMLElement>("[data-art]");
    const list = root.querySelector<HTMLElement>("[role=tablist]");
    [art, list].forEach((el) => { el?.addEventListener("pointerover", over); el?.addEventListener("pointerleave", out); });
    list?.addEventListener("focusin", over);
    list?.addEventListener("focusout", out);
    art?.addEventListener("click", click);
    // Build in once, from the core outwards
    let built = 0;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      root.setAttribute("data-in", "");
      built = window.setTimeout(() => root.setAttribute("data-built", ""), 2000);
      io.disconnect();
    }, { threshold: 0.25 });
    root.setAttribute("data-js-stack", "");
    io.observe(root);
    return () => {
      [art, list].forEach((el) => { el?.removeEventListener("pointerover", over); el?.removeEventListener("pointerleave", out); });
      list?.removeEventListener("focusin", over);
      list?.removeEventListener("focusout", out);
      art?.removeEventListener("click", click);
      io.disconnect();
      clearTimeout(built);
    };
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = LAYERS.length;
    const to = { ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    setActive(LAYERS[to].key);
    tabs.current[to]?.focus();
  };

  return (
    <div ref={wrap} className={s.ui}>
      <div className={s.list} role="tablist" aria-orientation="vertical" aria-label="The four layers">
        {LAYERS.map((l, i) => (
          <button
            key={l.key} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab"
            id={`b-stack-tab-${l.key}`} aria-controls={`b-stack-panel-${l.key}`} aria-selected={l.key === active} tabIndex={l.key === active ? 0 : -1}
            className={s.tab} data-key={l.key} onClick={() => setActive(l.key)} onKeyDown={(e) => onKey(e, i)}
          >
            <span className={s.index} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className={s.tabName}>{l.name}</span>
            <span className={s.tabRole}>{l.role}</span>
          </button>
        ))}
      </div>

      <div className={`${glass.glassDark} ${glass.edge} ${s.detail}`}>
        <div className={s.panels}>
          {LAYERS.map((l) => (
            <div
              key={l.key} role="tabpanel" id={`b-stack-panel-${l.key}`} aria-labelledby={`b-stack-tab-${l.key}`}
              className={s.panel} data-on={l.key === active || undefined} inert={hydrated && l.key !== active}
            >
              <div className={s.panelTop}>
                <p className={`t-label ${s.role}`}>{l.role}</p>
                <a className={s.url} href={l.url.href}>
                  {l.url.label}
                  <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true" focusable="false"><path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
                  <span className="sr-only"> (another NEAR site)</span>
                </a>
              </div>
              <p className={s.line}>{l.line}</p>
              <ul className={s.features}>
                {l.features.map((f) => (
                  <li key={f.title}>
                    <p className={s.featTitle}>{f.title}</p>
                    <p className={s.featDetail}>{f.detail}</p>
                  </li>
                ))}
              </ul>
              <ul className={s.stats} aria-label={`${l.name} in numbers`}>
                {l.stats.map((st) => (
                  <li key={st.label}>
                    <span className={s.statValue}>{st.value}</span>
                    <span className={s.statLabel}>{st.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
