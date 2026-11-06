import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HEROES, HERO_KEYS, RANDOM_KEYS, reviewPath, type HeroKey } from "@/components/home/chapter-one/heroes";
import styles from "./hero-live.module.css";

export const metadata: Metadata = { title: "Lab: hero versions", robots: { index: false, follow: false } };

// /lab/hero-live (D90, D107): the hero versions, the ring heroes the homepage picks from at random first, then the
// earlier versions, each with its poster (its camera
// move's first frame), a link to the homepage showing it (/home?hero=<key>) and its own review page.
// The homepage links are plain links, so each is a full page load and shows the version's true first paint; written
// href={`/${...}`} so a frozen copy prefixes them (scripts/build-versions.sh). The review links are next/link, whose
// href is built by concatenation: a plain or template href would be prefixed twice there (the script and basePath).
const home = (k: string) => "home?hero=" + k;

export default function HeroLive() {
  return (
    <main id="main" className={`container-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className="t-h2">Hero <span className="accent">versions</span></h1>
        <p className="t-lede">
          The homepage shows one of the six ring heroes at random on each load, each as likely as the others (D107). The
          earlier versions are kept below; they&rsquo;re no longer picked, but each still opens on the homepage and on its own
          review page.
        </p>
        <p className={styles.open}><a href={`/${home("random")}`}>Open the homepage at random</a></p>
      </header>
      <h2 className="t-h3">On the homepage, at random</h2>
      <Cards keys={RANDOM_KEYS} />
      <h2 className="t-h3" style={{ marginTop: "var(--space-9)" }}>Earlier versions</h2>
      <Cards keys={HERO_KEYS.filter((k) => !RANDOM_KEYS.includes(k))} />
    </main>
  );
}

function Cards({ keys }: { keys: HeroKey[] }) {
  return (
    <ol className={styles.grid}>
      {keys.map((k) => {
        const h = HEROES[k];
        return (
          <li key={k} className={styles.card}>
            <div className={styles.frame}>
              <Image src={h.poster!} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" quality={75} className={styles.img} />
            </div>
            <div className={styles.head}>
              <h3 className="t-h3">{h.name}</h3>
              <p className={styles.state}>{h.video ? "Camera move" : "Still"}</p>
            </div>
            <p className={styles.links}>
              <a href={`/${home(k)}`}>On the homepage</a>
              <Link href={reviewPath(k)} prefetch={false}>Review page</Link>
            </p>
          </li>
        );
      })}
    </ol>
  );
}
