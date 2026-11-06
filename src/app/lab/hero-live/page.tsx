import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HEROES, HERO_KEYS } from "@/components/home/chapter-one/heroes";
import styles from "./hero-live.module.css";

export const metadata: Metadata = { title: "Lab: hero versions", robots: { index: false, follow: false } };

// /lab/hero-live (D90): the five hero versions the homepage picks from at random, each with its poster (its camera
// move's first frame), a link to the homepage showing it (/home?hero=<key>) and its own review page.
// The homepage links are plain links, so each is a full page load and shows the version's true first paint; written
// href={`/${...}`} so a frozen copy prefixes them (scripts/build-versions.sh). The review links are next/link, whose
// href is built by concatenation: a plain or template href would be prefixed twice there (the script and basePath).
const home = (k: string) => "home?hero=" + k;
const reviewHref = (k: string) => "/lab/" + "hero-live-" + k;

export default function HeroLive() {
  return (
    <main id="main" className={`container-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className="t-h2">Hero <span className="accent">versions</span></h1>
        <p className="t-lede">
          The homepage shows one of these five at random on each load, each as likely as the others. Open a version on
          the homepage to see it from the first paint, or on its own review page. A version marked “still” has no
          camera move yet and shows its photograph.
        </p>
        <p className={styles.open}><a href={`/${home("random")}`}>Open the homepage at random</a></p>
      </header>
      <ol className={styles.grid}>
        {HERO_KEYS.map((k) => {
          const h = HEROES[k];
          return (
            <li key={k} className={styles.card}>
              <div className={styles.frame}>
                <Image src={h.poster!} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" quality={75} className={styles.img} />
              </div>
              <div className={styles.head}>
                <h2 className="t-h3">{h.name}</h2>
                <p className={styles.state}>{h.video ? "Camera move" : "Still"}</p>
              </div>
              <p className={styles.links}>
                <a href={`/${home(k)}`}>On the homepage</a>
                {k !== "original" && <Link href={reviewHref(k)} prefetch={false}>Review page</Link>}
              </p>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
