import type React from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import pa from "./Paths.module.css";

// Direction A, Get into NEAR (research/dir-a.md §5.8): three routes in. One ruled line runs across with a waypoint for
// each path; each path hangs from its waypoint (an image plate, the name, the line and one
// action), on a hairline dropped from its waypoint to the image's corner. Hovering a path draws the route to its waypoint in green and eases its image in (mouse only, D28); keyboard
// focus gets the route. Copy, links and images as components/home/paths/GetIntoNear.tsx.
type Path = { name: string; line: ReactNode; action: string; href: string; image: string };
const nb = (s: string) => <span className={pa.nowrap}>{s}</span>;
const PATHS: Path[] = [
  { name: "Trade on NEAR", line: "Trade, earn yield and go confidential, all from one near.com account.", action: "Open near.com", href: "https://near.com", image: "/images/home/home-paths-trade-v3.webp" },
  { name: "Integrate NEAR", line: <>Add {nb("NEAR Intents")} for confidential {nb("cross-chain")} execution, or {nb("NEAR AI")} for private inference you can verify.</>, action: "Integration docs", href: "https://docs.near.org/", image: "/images/home/home-paths-integrate-v2.webp" },
  { name: "Build on NEAR", line: <>Build onchain apps and AI agents on battle-tested infrastructure with built-in confidentiality and {nb("cross-chain")} reach.</>, action: "Start building", href: "https://docs.near.org/", image: "/images/home/home-paths-build-v3.webp" },
];

export function Paths() {
  return (
    <section id="paths" className={pa.paths} aria-labelledby="a-paths-title">
      <div className={pa.inner}>
        <h2 id="a-paths-title" className="t-h2">Get into <span className="accent">NEAR</span></h2>
        <div className={pa.route} aria-hidden="true" data-a-watch="0.5">
          <span className={pa.routeLine} />
          <span className={pa.routeGreen} />
          <span className={pa.routeTicks} />
        </div>
        <ul className={pa.list}>
          {PATHS.map((p, i) => (
            <li key={p.name} className={pa.col} style={{ "--i": i } as React.CSSProperties}>
              <span className={pa.way} aria-hidden="true" />
              <span className={pa.drop} aria-hidden="true" />
              <a className={pa.link} href={p.href}>
                <span className={pa.frame}>
                  <span className={pa.clip}><Image src={p.image} alt="" fill sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw" className={pa.img} /></span>
                </span>
                <span className={`t-h3 ${pa.name}`}>{p.name}</span>
                <span className={pa.line}>{p.line}</span>
                <span className={pa.action}>
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
