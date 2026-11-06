import type { Metadata } from "next";
import Link from "next/link";
import { LabSwitch } from "@/components/home/story/LabSwitch";
import { HERO_VERSIONS, ILLUSTRATIONS, VERSIONS, heroRoute, heroThumb, illoThumb } from "./data";
import { DIR_SWITCH } from "./switch";
import { Picker } from "./Picker";
import styles from "./directions.module.css";

export const metadata: Metadata = { title: "Lab: homepage directions", robots: { index: false, follow: false } };

// /lab/directions (D52): the contact sheet for the homepage directions. The four versions, what changed in each, and a
// picker to combine sections across them.
// A plain href string here would be prefixed twice in the frozen copies (scripts/build-versions.sh and basePath)
const ORBIT = "/lab/orbit";

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

      <section className={styles.heroes} aria-labelledby="hero-versions">
        <h2 id="hero-versions" className="t-h3">Hero versions</h2>
        <p className={styles.lede}>
          The six ring heroes the homepage picks from at random, then the earlier versions (no longer picked). Each opens
          the whole homepage with that hero only: scroll through it to run the camera move and its tracked graphics.
        </p>
        {[true, false].map((onHome) => (
          <div key={String(onHome)}>
            <h3 className={`t-h4 ${styles.heroGroup}`}>{onHome ? "On the homepage, at random" : "Earlier versions"}</h3>
            <ul className={styles.heroList}>
              {HERO_VERSIONS.filter((h) => h.home === onHome).map((h) => (
                <li key={h.key} className={styles.hero}>
                  <Link className={styles.thumb} href={heroRoute(h)} prefetch={false}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- static lab thumbnails, sized by CSS */}
                    <img src={heroThumb(h.key)} alt={`${h.name}: the homepage's opening view`} loading="lazy" />
                  </Link>
                  <p className="t-h4">{h.name}</p>
                  <p className={styles.versionNote}>{h.note}</p>
                  <p className={styles.open}><Link href={heroRoute(h)} prefetch={false}>Open the page<span className="sr-only">: {h.name}</span></Link></p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="by-section">
        <h2 id="by-section" className="t-h3">Section by section</h2>
        <p className={styles.lede}>Each picture opens that section in context in a new tab. Choose one version per section.</p>
        <Picker />
      </section>
      <section className={styles.illos} aria-labelledby="illos">
        <h2 id="illos" className="t-h3">“Own your” illustrations</h2>
        <p className={styles.lede}>
          The options for the rail’s four station drawings, kept for future use. Orbit is built into the Original for
          review at <Link href={ORBIT}>/lab/orbit</Link>.
        </p>
        <ul className={styles.illoList}>
          {ILLUSTRATIONS.map((o) => (
            <li key={o.key} className={styles.illo}>
              <Link className={styles.thumb} href={o.href}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static lab thumbnails, sized by CSS */}
                <img src={illoThumb(o.key)} alt={`${o.name}: the assets station`} loading="lazy" />
              </Link>
              <p className="t-h4">{o.name}</p>
              <p className={styles.status}>{o.status}</p>
              <p className={styles.versionNote}>{o.note}</p>
            </li>
          ))}
        </ul>
      </section>
      <LabSwitch current="sheet" options={DIR_SWITCH} label="Directions" />
    </main>
  );
}
