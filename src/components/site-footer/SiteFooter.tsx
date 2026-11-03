import Image from "next/image";
import { FOOTER } from "@/components/site-header/nav-data";
import { FooterReveal } from "./FooterReveal";
import styles from "./SiteFooter.module.css";

// Footer (spec/pages/home.md §9, after the draft site, D11): tagline, the site map in eight columns, the lockup at
// full width. Ink. With motion allowed, the ink rises from the bottom as the footer scrolls in ("the black change"),
// over whatever ground the page ends on (the cream surface, or green where a page ends on a green field):
// - the real footer (interactive) shows ink type on that ground until the wipe completes, then takes its ink colours;
// - the ink layer carries a decorative copy in cream type, counter-scaled so the type is uncovered, never stretched
//   (FooterReveal). The copy is aria-hidden and inert.
function FooterBody({ copy = false }: { copy?: boolean }) {
  return (
    <div className={styles.inner}>
      <div className={styles.top}>
        <p className={`t-h3 ${styles.tagline}`}>
          Where money <span className="accent">actually moves.</span>
        </p>
        <nav aria-label={copy ? undefined : "Footer"} className={styles.cols}>
          {FOOTER.map((col) => (
            <div key={col.heading} className={styles.col}>
              <h2 className={styles.colHeading}>{col.heading}</h2>
              <ul className={styles.links}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className={styles.link} tabIndex={copy ? -1 : undefined}>
                      {l.label}
                      {l.external && (
                        <>
                          <svg className={styles.ext} viewBox="0 0 10 10" width="9" height="9" aria-hidden="true" focusable="false">
                            <path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                          {!copy && <span className="sr-only"> (another NEAR site)</span>}
                        </>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      {/* The official lockup, full width: white on ink; black on the pre-wipe ground (the real footer only).
          The draft uses a wordmark-only file we don't have yet. */}
      <Image className={`${styles.mark} ${styles.markLight}`} src="/brand/logo_rev.svg" alt={copy ? "" : "NEAR"} width={1656} height={567} unoptimized />
      {!copy && <Image className={`${styles.mark} ${styles.markDark}`} src="/brand/logo.svg" alt="" width={1656} height={567} unoptimized />}
      <p className={styles.legal}>© 2026 NEAR. All rights reserved.</p>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer} data-footer>
      <FooterBody />
      <div className={styles.ink} data-footer-ink aria-hidden="true" inert>
        <div className={styles.inkContent} data-footer-ink-content>
          <FooterBody copy />
        </div>
      </div>
      <FooterReveal />
    </footer>
  );
}
