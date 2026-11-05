"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { LAYERS, type LayerKey } from "@/components/home/stack/layers";
import st from "./Stack.module.css";

// The layer list and the selected layer's detail (the live page's behaviour, components/home/stack/StackLayers.tsx):
// a vertical tablist, core first, NEAR Protocol selected first; ↑/↓, Home and End move the selection. A choice is an
// "a-stack:select" event; where the section is pinned, StackMotion scrolls to that layer's step and reports
// "a-stack:step" as the reader scrolls. Panels share one grid cell so switching never moves the page; without JS every
// panel shows. In this direction each stat's value rolls into place when its panel arrives.
export const SELECT = "a-stack:select";
export const STEP = "a-stack:step";
const noop = () => () => {};
const choose = (k: LayerKey) => window.dispatchEvent(new CustomEvent(SELECT, { detail: k }));

export function StackPanel() {
  const [active, setActive] = useState<LayerKey>("protocol");
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const root = tabs.current[0]?.closest<HTMLElement>("[data-a-stack]");
    if (!root) return;
    root.setAttribute("data-sel", active);
    if (root.hasAttribute("data-pinned")) root.setAttribute("data-build", String(LAYERS.findIndex((l) => l.key === active)));
  }, [active]);

  useEffect(() => {
    const on = (e: Event) => { const k = (e as CustomEvent<LayerKey>).detail; if (LAYERS.some((l) => l.key === k)) setActive(k); };
    window.addEventListener(SELECT, on);
    window.addEventListener(STEP, on);
    return () => { window.removeEventListener(SELECT, on); window.removeEventListener(STEP, on); };
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = LAYERS.length;
    const to = { ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    choose(LAYERS[to].key);
    tabs.current[to]?.focus();
  };

  return (
    <>
      <div className={st.list} role="tablist" aria-orientation="vertical" aria-label="The four layers">
        {LAYERS.map((l, i) => (
          <button
            key={l.key} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab"
            id={`a-stack-tab-${l.key}`} aria-controls={`a-stack-panel-${l.key}`} aria-selected={l.key === active} tabIndex={l.key === active ? 0 : -1}
            className={st.tab} data-key={l.key} onClick={() => choose(l.key)} onKeyDown={(e) => onKey(e, i)}
          >
            <span className={st.index} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className={st.tabName}>{l.name}</span>
            <span className={st.tabTick} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className={st.panels}>
        {LAYERS.map((l) => (
          <div
            key={l.key} role="tabpanel" id={`a-stack-panel-${l.key}`} aria-labelledby={`a-stack-tab-${l.key}`}
            className={st.panel} data-active={l.key === active || undefined} inert={hydrated && l.key !== active}
          >
            <div className={st.panelTop}>
              <p className={st.role}>{l.role}</p>
              <a className={st.url} href={l.url.href}>
                {l.url.label}
                <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true" focusable="false"><path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
                <span className="sr-only"> (another NEAR site)</span>
              </a>
            </div>
            <p className={st.line}>{l.line}</p>
            <ul className={st.features}>
              {l.features.map((f) => (
                <li key={f.title}>
                  <p className={st.featTitle}>{f.title}</p>
                  <p className={st.featDetail}>{f.detail}</p>
                </li>
              ))}
            </ul>
            <dl className={st.stats} aria-label={`${l.name} in numbers`}>
              {l.stats.map((s) => (
                <div key={s.label} className={st.stat}>
                  <dt className={st.statLabel}>{s.label}</dt>
                  <dd className={st.statValue}>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
