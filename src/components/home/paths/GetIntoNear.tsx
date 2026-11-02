import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./GetIntoNear.module.css";

// Section 7 (spec/pages/home.md §7, copy board Step 18): three ways in, one link each. A short paths block, not a
// developer section. Rows on hairlines (DESIGN §3), not a card grid; each row is one link. URLs come from
// PRODUCT.md; the integration docs URL isn't known yet, so that row says so instead of linking.

type Path = { name: string; line: ReactNode; action: string; href: string; external?: boolean; image: string };

// Product names and "cross-chain" never break across lines
const nb = (s: string) => <span className={styles.nowrap}>{s}</span>;

const PATHS: Path[] = [
  { name: "Trade on NEAR", line: "Trade, earn yield and go confidential, all from one near.com account.", action: "Open near.com", href: "https://near.com", external: true, image: "/images/home/home-paths-trade-v1.webp" },
  { name: "Integrate NEAR", line: <>Add {nb("NEAR Intents")} for confidential {nb("cross-chain")} execution, or {nb("NEAR AI")} for private inference you can verify.</>, action: "Integration docs", href: "https://docs.near.org/", external: true, image: "/images/home/home-paths-integrate-v1.webp" },
  { name: "Build on NEAR", line: <>Build onchain apps and AI agents on battle-tested infrastructure with built-in confidentiality and {nb("cross-chain")} reach.</>, action: "Start building", href: "https://docs.near.org/", external: true, image: "/images/home/home-paths-build-v1.webp" },
];

export function GetIntoNear() {
  return (
    <section className={styles.paths} aria-labelledby="paths-title">
      <div className={styles.inner}>
        <h2 id="paths-title" className="t-h2">Get into <span className="accent">NEAR</span></h2>
        <ul className={styles.list}>
          {PATHS.map((p) => (
            <li key={p.name} className={styles.row} data-linked="">
              <div className={styles.thumb}><Image src={p.image} alt="" fill sizes="(min-width: 1280px) 196px, (min-width: 768px) 25vw, 96px" className={styles.thumbImg} /></div>
              <h3 className={`t-h3 ${styles.name}`}>{p.name}</h3>
              <p className={styles.line}>{p.line}</p>
              <p className={styles.action}>
                <a className={styles.link} href={p.href}>
                  <span className={styles.label}>{p.action}</span>
                  {p.external && (
                    <>
                      <svg className={styles.ext} viewBox="0 0 10 10" width="10" height="10" aria-hidden="true" focusable="false">
                        <path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                      <span className="sr-only"> (another NEAR site)</span>
                    </>
                  )}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
