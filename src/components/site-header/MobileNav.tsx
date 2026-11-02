"use client";

import { useRef } from "react";
import type { NavGroup, NavLink } from "./nav-data";
import { Chevron } from "./Chevron";
import { NavItem } from "./NavItem";
import { Logo } from "@/components/brand/Logo";
import styles from "./SiteHeader.module.css";

// Phones: a full-height ink sheet built on the native <dialog> (focus is trapped, Escape closes, the page is inert).
// Groups are <details> disclosures, so they work without extra script.
export function MobileNav({ groups, action }: { groups: NavGroup[]; action: NavLink }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button ref={opener} type="button" className={`t-label ${styles.menuButton}`} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
        Menu
      </button>
      <dialog
        ref={dialog}
        className={styles.sheet}
        aria-label="Menu"
        onClose={() => opener.current?.focus()}
        onClick={(e) => { if ((e.target as HTMLElement).closest("a")) close(); }}
      >
        <div className={styles.sheetTop}>
          <Logo height={28} tone="light" />
          <button type="button" className={`t-label ${styles.menuButton}`} onClick={close}>Close</button>
        </div>
        <nav aria-label="Main" className={styles.sheetNav}>
          {groups.map((g) => (
            <details key={g.id} className={styles.sheetGroup}>
              <summary className={styles.sheetSummary}>
                <span className="t-h4">{g.label}</span>
                <Chevron className={styles.chevron} />
              </summary>
              {g.sections.map((s, i) => (
                <div key={s.heading ?? i} className={styles.sheetSection}>
                  {s.heading && <p className={styles.sectionHeading}>{s.heading}</p>}
                  <ul className={styles.items}>
                    {s.links.map((l) => <li key={l.label}><NavItem link={l} /></li>)}
                  </ul>
                </div>
              ))}
            </details>
          ))}
        </nav>
        <a className={`btn btn-primary ${styles.sheetCta}`} href={action.href}>{action.label}</a>
      </dialog>
    </>
  );
}
