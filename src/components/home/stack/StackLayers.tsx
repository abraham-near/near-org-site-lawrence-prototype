"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LAYERS, type LayerKey } from "./layers";
import styles from "./Stack.module.css";

// The layer list and the selected layer's detail (D14, after Lawrence's Figma layout): a vertical tablist,
// NEAR Protocol selected first. Hovering or focusing a row highlights its layer in the drawing (StackInteractions,
// via data-key); clicking a layer in the drawing selects it ("stack:select"). Panels share one grid cell so
// switching never moves the page; without JS every panel shows, stacked.
export const SELECT_EVENT = "stack:select";

export function StackLayers() {
  const [active, setActive] = useState<LayerKey>("protocol");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // The drawing shows the selection at rest (Stack.module.css reads data-active-layer on the band)
  useEffect(() => { tabs.current[0]?.closest("[data-stack]")?.setAttribute("data-active-layer", active); }, [active]);

  useEffect(() => {
    const on = (e: Event) => { const k = (e as CustomEvent<LayerKey>).detail; if (LAYERS.some((l) => l.key === k)) setActive(k); };
    window.addEventListener(SELECT_EVENT, on);
    return () => window.removeEventListener(SELECT_EVENT, on);
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
    <>
      <div className={styles.list} role="tablist" aria-orientation="vertical" aria-label="The four layers">
        {LAYERS.map((l, i) => (
          <button
            key={l.key} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab"
            id={`stack-tab-${l.key}`} aria-controls={`stack-panel-${l.key}`} aria-selected={l.key === active} tabIndex={l.key === active ? 0 : -1}
            className={styles.tab} data-key={l.key} onClick={() => setActive(l.key)} onKeyDown={(e) => onKey(e, i)}
          >
            <span className={styles.index} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.tabName}>{l.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.panels}>
        {LAYERS.map((l) => (
          <div
            key={l.key} role="tabpanel" id={`stack-panel-${l.key}`} aria-labelledby={`stack-tab-${l.key}`}
            className={styles.panel} data-active={l.key === active || undefined}
          >
            <div className={styles.panelTop}>
              <p className={`t-label ${styles.role}`}>{l.role}</p>
              <a className={styles.url} href={l.url.href}>
                {l.url.label}
                <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true" focusable="false"><path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
                <span className="sr-only"> (another NEAR site)</span>
              </a>
            </div>
            <p className={styles.line}>{l.line}</p>
            <ul className={styles.features}>
              {l.features.map((f) => (
                <li key={f.title}>
                  <p className={styles.featTitle}>{f.title}</p>
                  <p className={styles.featDetail}>{f.detail}</p>
                </li>
              ))}
            </ul>
            <ul className={styles.stats} aria-label={`${l.name} in numbers`}>
              {l.stats.map((s) => (
                <li key={s.label}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
