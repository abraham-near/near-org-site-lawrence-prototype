import type { Metadata } from "next";
import Link from "next/link";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { VERSIONS } from "./data";
import { DIR_SWITCH } from "./switch";
import { Picker } from "./Picker";
import styles from "./directions.module.css";

export const metadata: Metadata = { title: "Lab: homepage directions", robots: { index: false, follow: false } };

// /lab/directions (D52): the contact sheet for the homepage directions. The four versions, what changed in each, and a
// picker to combine sections across them.
export default function Directions() {
  return (
    <main id="main" className={`container-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className="t-h2">Homepage <span className="accent">directions</span></h1>
        <p className="t-lede">
          The original homepage and three new directions. Each follows the same flow: the hero, the story with its
          horizontal rail, the 3-column Stack, then everything below it. Open each in full, or compare them section by
          section below and pick the version you want for each.
        </p>
      </header>

      <ul className={styles.versions}>
        {VERSIONS.map((v) => (
          <li key={v.key} className={styles.version}>
            <p className="t-h4">{v.name}</p>
            <p className={styles.versionNote}>{v.summary}</p>
            <p className={styles.open}><Link href={v.route}>Open the page<span className="sr-only">: {v.name}</span></Link></p>
          </li>
        ))}
      </ul>

      <section aria-labelledby="by-section">
        <h2 id="by-section" className="t-h3">Section by section</h2>
        <p className={styles.lede}>Each picture opens that section in context in a new tab. Choose one version per section.</p>
        <Picker />
      </section>
      <LabSwitch current="sheet" options={DIR_SWITCH} label="Directions" />
    </main>
  );
}
