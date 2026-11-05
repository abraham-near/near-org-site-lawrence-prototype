import type { Metadata } from "next";
import Link from "next/link";
import { MOTION, type MotionKey } from "@/components/home/story/orbit/motion";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { MOTION_SWITCH } from "./switch";
import { Demo } from "./Demo";
import styles from "./rail-motion.module.css";

export const metadata: Metadata = { title: "Lab: rail motion options", robots: { index: false, follow: false } };

// /lab/rail-motion (D72): three options for the animated data and assets stations, each as a looping demo (slide in,
// hold, slide out) and live on the rail (/lab/orbit-1|2|3)
const KEYS = [1, 2, 3] as MotionKey[];
// A plain or template href here would be prefixed twice in the frozen copies (scripts/build-versions.sh and basePath)
const railHref = (k: MotionKey) => "/lab/orbit-" + k;

export default function RailMotion() {
  return (
    <main id="main" className={`container-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className="t-h2">Rail <span className="accent">motion</span></h1>
        <p className="t-lede">
          Three ways to animate the data and assets stations in Orbit’s style. Data: the frosted disc turns flat to
          camera as it reaches the centre while the green ball loops behind it. Assets: two equal balls orbit their
          ring in a seamless loop. Each demo slides in, holds at the centre and slides out; open each option to see it
          on the rail.
        </p>
      </header>
      <ol className={styles.options}>
        {KEYS.map((k) => {
          const o = MOTION[k];
          return (
            <li key={k} className={styles.option}>
              <div className={styles.head}>
                <h2 className="t-h3">{o.name}</h2>
                <div>
                  {o.note && <p className={styles.note}>{o.note}</p>}
                  <p className={styles.open}><Link href={railHref(k)}>See it on the rail</Link></p>
                </div>
              </div>
              <div className={styles.demos}>
                <Demo label="Own your data"><o.DataArt /></Demo>
                <Demo label="Own your assets"><o.AssetsArt /></Demo>
              </div>
            </li>
          );
        })}
      </ol>
      <LabSwitch current="sheet" options={MOTION_SWITCH} label="Rail motion options" />
    </main>
  );
}
