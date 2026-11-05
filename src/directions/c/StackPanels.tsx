"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { LAYERS, type LayerKey } from "@/components/home/stack/layers";
import styles from "./Stack.module.css";

// The layer list and the selected layer's detail (the content and behaviour of the current Stack, D14/D18, restyled):
// a vertical tablist, core first, NEAR Protocol selected first; ↑/↓, Home and End move the selection. A choice is a
// "c-stack:select"; scrolling the pinned section sends "c-stack:step" (StackMotion). Panels share one grid cell, so
// switching never moves the page; without JS every panel shows, stacked.
export const SELECT = "c-stack:select";
export const STEP = "c-stack:step";
const noop = () => () => {};
const choose = (k: LayerKey) => window.dispatchEvent(new CustomEvent(SELECT, { detail: k }));

export function StackPanels() {
  const [active, setActive] = useState<LayerKey>("protocol");
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const root = tabs.current[0]?.closest("[data-c-stack]");
    root?.setAttribute("data-active-layer", active);
    if (root?.hasAttribute("data-pinned")) root.setAttribute("data-build", String(LAYERS.findIndex((l) => l.key === active)));
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
      <div className={styles.list} role="tablist" aria-orientation="vertical" aria-label="The four layers">
        {LAYERS.map((l, i) => (
          <button
            key={l.key} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab"
            id={`c-stack-tab-${l.key}`} aria-controls={`c-stack-panel-${l.key}`} aria-selected={l.key === active} tabIndex={l.key === active ? 0 : -1}
            className={styles.tab} data-key={l.key} onClick={() => choose(l.key)} onKeyDown={(e) => onKey(e, i)}
          >
            <span className={styles.glyph} aria-hidden="true" />
            <span className={styles.tabName}>{l.name}</span>
            <span className={styles.tabRole}>{l.role}</span>
          </button>
        ))}
      </div>

      <div className={styles.panels}>
        {LAYERS.map((l) => (
          <div
            key={l.key} role="tabpanel" id={`c-stack-panel-${l.key}`} aria-labelledby={`c-stack-tab-${l.key}`}
            className={styles.panel} data-active={l.key === active || undefined} inert={hydrated && l.key !== active}
          >
            <p className={styles.line}>{l.line}</p>
            <ul className={styles.features}>
              {l.features.map((f) => (
                <li key={f.title}>
                  <p className={styles.featTitle}>{f.title}</p>
                  <p className={styles.featDetail}>{f.detail}</p>
                </li>
              ))}
            </ul>
            <dl className={styles.stats}>
              {l.stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <dt className={styles.statLabel}>{s.label}</dt>
                  <dd className={styles.statValue}>{s.value}</dd>
                </div>
              ))}
            </dl>
            <a className={styles.url} href={l.url.href}>
              {l.url.label}
              <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true" focusable="false"><path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
              <span className="sr-only"> (another NEAR site)</span>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
