import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { GoArrow } from "@/components/GoArrow";
import { DesktopNav } from "./DesktopNav";
import { HeaderScroll } from "./HeaderScroll";
import { MobileNav } from "./MobileNav";
import { NAV, PRIMARY_ACTION } from "./nav-data";
import styles from "./SiteHeader.module.css";

// Section 0: a floating ink bar (logo · menus · one green action), after the draft site the brief now follows
// (DESIGN §1 lists ink for the nav bar, §3 radius-lg for it). Server-rendered; the menus are small client islands.
// It slides away while scrolling down and returns on any scroll up (D27, HeaderScroll).
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.skip} href="#main">Skip to content</a>
      <div className={styles.frame}>
        <div className={styles.bar}>
          <Link href="/" className={styles.home} aria-label="NEAR home">
            <Logo height={28} tone="light" priority />
          </Link>
          <DesktopNav groups={NAV} />
          <div className={styles.actions}>
            <a className={`btn btn-primary ${styles.cta}`} href={PRIMARY_ACTION.href}>
              {PRIMARY_ACTION.label}
              <GoArrow />
            </a>
            <MobileNav groups={NAV} action={PRIMARY_ACTION} />
          </div>
        </div>
      </div>
      <HeaderScroll />
    </header>
  );
}
