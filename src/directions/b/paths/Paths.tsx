import type { ReactNode } from "react";
import Image from "next/image";
import s from "./Paths.module.css";

// Direction B, Get into NEAR (spec/pages/home.md §7; copy, links and images as the live section). Three rows on
// hairlines, each one link. Each picture is seen through a strip of fluted glass; on hover or focus the glass slides
// aside and the picture comes clear (transform only), while a green rule draws across the row's top.
type Path = { name: string; line: ReactNode; action: string; href: string; image: string };
const nb = (t: string) => <span className={s.nowrap}>{t}</span>;
const PATHS: Path[] = [
  { name: "Trade on NEAR", line: "Trade, earn yield and go confidential, all from one near.com account.", action: "Open near.com", href: "https://near.com", image: "/images/home/home-paths-trade-v3.webp" },
  { name: "Integrate NEAR", line: <>Add {nb("NEAR Intents")} for confidential {nb("cross-chain")} execution, or {nb("NEAR AI")} for private inference you can verify.</>, action: "Integration docs", href: "https://docs.near.org/", image: "/images/home/home-paths-integrate-v2.webp" },
  { name: "Build on NEAR", line: <>Build onchain apps and AI agents on battle-tested infrastructure with built-in confidentiality and {nb("cross-chain")} reach.</>, action: "Start building", href: "https://docs.near.org/", image: "/images/home/home-paths-build-v3.webp" },
];

export function Paths() {
  return (
    <section id="paths" className={s.paths} aria-labelledby="b-paths-title">
      <div className={s.inner}>
        <h2 id="b-paths-title" className="t-h2">Get into <span className="accent">NEAR</span></h2>
        <ul className={s.list}>
          {PATHS.map((p) => (
            <li key={p.name}>
              <a className={s.row} href={p.href}>
                <span className={s.thumb} aria-hidden="true">
                  <Image src={p.image} alt="" decoding="async" fill sizes="(min-width: 1280px) 240px, (min-width: 768px) 30vw, 100vw" className={s.img} />
                  <span className={s.flute} />
                </span>
                <h3 className={`t-h3 ${s.name}`}>{p.name}</h3>
                <span className={s.line}>{p.line}</span>
                <span className={s.action}>
                  {p.action}
                  <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true" focusable="false"><path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
                  <span className="sr-only"> (another NEAR site)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
