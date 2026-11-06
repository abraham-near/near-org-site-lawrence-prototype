import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { CinematicHero } from "@/components/home/chapter-one/cinematic/CinematicHero";
import { CINEMATIC } from "@/components/home/chapter-one/cinematic/options";
import styles from "./page.module.css";

// A plain or template href here would be prefixed twice in the frozen copies (scripts/build-versions.sh and basePath)
const HREF = "/lab/" + "hero-cinematic/";

export const metadata: Metadata = { title: "Hero: cinematic options", robots: { index: false, follow: false } };

// Lab: four static options for the opening image, each a full first screen in situ (a photograph-like still with a
// vector layer in the rail stations' vocabulary drawn on its features). One at true size: /lab/hero-cinematic/a … d.
export default function HeroCinematic() {
  return (
    <main id="main">
      {CINEMATIC.map((o, i) => (
        <Fragment key={o.key}>
          <div className={styles.strip}>
            <span className={styles.tag}>Option {o.key.toUpperCase()}</span>
            <span className={styles.name}>{o.name}</span>
            <p className={styles.note}>{o.note}</p>
            <Link className={styles.open} href={HREF + o.key}>Open alone</Link>
          </div>
          <CinematicHero o={o} h1={i === 0} preload={i === 0} />
        </Fragment>
      ))}
    </main>
  );
}
