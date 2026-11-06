import type { Metadata } from "next";
import { OrbitArt } from "@/components/home/story/orbit/OrbitArt";
import { IDENTITY_OPTIONS } from "@/components/home/story/orbit/motion/o3/identity";
import styles from "./identity.module.css";

export const metadata: Metadata = { title: "Lab: identity options", robots: { index: false, follow: false } };

// /lab/identity (D80): static options for the Own your identity station, in the style of the three animated stations,
// to choose from before it is animated. Each sits at rest in a crop of the rail at 1440 (its 420 slot over the ridges),
// at full size and at twice the size for detail. Today's Orbit drawing is first, for comparison.
function Plate({ children, big }: { children: React.ReactNode; big?: boolean }) {
  return (
    <div className={`${styles.frame} ${big ? styles.big : ""}`} data-slide-frame data-own-stage>
      <div className={styles.plate} aria-hidden="true" />
      <span className={styles.rail} aria-hidden="true" />
      <div className={styles.slot}>{children}</div>
    </div>
  );
}

export default function IdentityOptions() {
  return (
    <main id="main" className={`container-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className="t-h2">Own your <span className="accent">identity</span></h1>
        <p className="t-lede">
          Options for the fourth station, made like the data, assets and intelligence stations: frosted glass, chrome,
          one green part and Orbit’s fine lines. The gimbal (A) is the pick: it now has the green ball and is animated,
          here and on the homepage (D81). The others stay static for reference. The line it illustrates: “One NEAR account that reads like a name, works across 35+ chains, and upgrades to
          post-quantum keys in a single rotation.”
        </p>
      </header>
      <ol className={styles.options}>
        <li className={styles.option}>
          <div className={styles.head}>
            <h2 className="t-h3">Today: Orbit’s drawing</h2>
            <p className={styles.note}>A green ring over a frosted disc engraved with the name, the old ring as a ghost at its previous tilt.</p>
          </div>
          <div className={styles.views}><Plate><OrbitArt which="identity" /></Plate></div>
        </li>
        {IDENTITY_OPTIONS.map((o) => (
          <li key={o.key} className={styles.option}>
            <div className={styles.head}>
              <h2 className="t-h3">{o.key.toUpperCase()} · {o.name}</h2>
              <p className={styles.note}>{o.note}</p>
            </div>
            <div className={styles.views}>
              <Plate><o.Art /></Plate>
              <Plate big><o.Art /></Plate>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
