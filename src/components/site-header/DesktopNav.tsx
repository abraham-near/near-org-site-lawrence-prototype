"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { NavGroup } from "./nav-data";
import { Chevron } from "./Chevron";
import { NavItem } from "./NavItem";
import styles from "./SiteHeader.module.css";

// Disclosure navigation (not an ARIA menu): each group is a button that shows a compact panel of links.
// Enter/Space toggles, Escape closes and returns focus, focus or a click leaving the nav closes it.
// Pointer hover opens with a short intent delay; keyboard and touch use the button.
export function DesktopNav({ groups }: { groups: NavGroup[] }) {
  // `switched`: moving from one open group to another swaps the panel without replaying its entrance (audit)
  const [state, setState] = useState<{ id: string | null; switched: boolean }>({ id: null, switched: false });
  const open = state.id;
  const setOpen = (id: string | null) => setState((p) => ({ id, switched: p.id !== null && id !== null && p.id !== id }));
  const navRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const uid = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => { if (!navRef.current?.contains(e.target as Node)) setOpen(null); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      navRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="${uid}-${open}"]`)?.focus();
      setOpen(null);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); };
  }, [open, uid]);

  // Mouse hover opens/closes after a short intent delay.
  function schedule(e: React.PointerEvent, id: string | null, delay: number) {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(id), delay);
  }

  return (
    <nav
      ref={navRef}
      className={styles.desktopNav}
      aria-label="Main"
      onBlur={(e) => { if (!navRef.current?.contains(e.relatedTarget as Node)) setOpen(null); }}
      onPointerLeave={(e) => schedule(e, null, 220)}
    >
      <ul className={styles.groups} data-switching={state.switched || undefined}>
        {groups.map((g) => {
          const isOpen = open === g.id;
          const panelId = `${uid}-${g.id}`;
          return (
            <li key={g.id} onPointerEnter={(e) => schedule(e, g.id, 90)}>
              <button
                type="button"
                className={`t-label ${styles.trigger}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : g.id)}
              >
                <span className={styles.triggerText}>{g.label}</span>
                <Chevron className={styles.chevron} />
              </button>
              {/* Panels hang from the start of the menu row (like the draft), sections side by side. */}
              <div id={panelId} className={styles.panel} data-open={isOpen || undefined} hidden={!isOpen}>
                {g.sections.map((s, i) => (
                  <div key={s.heading ?? i} className={styles.section}>
                    {s.heading && <p className={styles.sectionHeading}>{s.heading}</p>}
                    <ul className={styles.items}>
                      {s.links.map((l) => <li key={l.label}><NavItem link={l} /></li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
