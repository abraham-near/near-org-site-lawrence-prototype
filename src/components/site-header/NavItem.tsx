import type { NavLink } from "./nav-data";
import styles from "./SiteHeader.module.css";

// One menu link: name (with ↗ when it leaves near.org) and an optional one-line description.
export function NavItem({ link }: { link: NavLink }) {
  return (
    <a className={styles.item} href={link.href}>
      <span className={styles.itemName}>
        {link.label}
        {link.external && (
          <>
            <svg className={styles.ext} viewBox="0 0 10 10" width="9" height="9" aria-hidden="true" focusable="false">
              <path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="sr-only"> (another NEAR site)</span>
          </>
        )}
      </span>
      {link.description && <span className={styles.itemDesc}>{link.description}</span>}
    </a>
  );
}
