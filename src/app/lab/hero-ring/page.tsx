import type { Metadata } from "next";
import Link from "next/link";
import { RING_OPTIONS } from "@/components/home/chapter-one/heroes/ring-options";
import { RingPicker } from "./RingPicker";
import styles from "./hero-ring.module.css";

export const metadata: Metadata = { title: "Lab: ring hero options", robots: { index: false, follow: false } };

// /lab/hero-ring: the contact sheet for the gate's ring in eight new landscapes. Each thumbnail is the option's
// homepage opening view at 1440 × 900 (the still with the gate's layer fitted to it, captured with Playwright); tick the
// ones to make in full motion and copy the selection. Review hrefs are built by concatenation: a whole "/lab/hero…"
// string would be prefixed twice in the frozen copies (scripts/build-versions.sh and basePath).
const gateHref = "/lab/" + "hero-live-" + "gate";
const thumb = (k: string) => `/images/lab/hero-ring/thumb-${k}.webp`;

export default function HeroRingSheet() {
  const options = RING_OPTIONS.map(({ key, name, note }) => ({ key, name, note, href: "/lab/" + "hero-ring-" + key, thumb: thumb(key) }));
  return (
    <main id="main" className={`container-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className="t-h2">The ring, <span className="accent">elsewhere</span></h1>
        <p className="t-lede">
          The gate’s chrome ring, frosted disc and green sphere in eight new landscapes, each with the gate’s graphics
          fitted to its ring, sphere and ground. These are stills for now. Tick the ones you want made in full motion,
          with the gate’s camera move and tracking, then copy your selection at the bottom and send it to me.
        </p>
      </header>

      <section className={styles.reference} aria-labelledby="reference-title">
        <Link className={styles.thumb} href={gateHref} prefetch={false}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static lab thumbnails, sized by CSS */}
          <img src={thumb("gate")} alt="The gate: the homepage's opening view" loading="lazy" />
        </Link>
        <div className={styles.referenceText}>
          <p className={styles.kicker}>Current favourite, for reference</p>
          <h2 id="reference-title" className="t-h3">The gate</h2>
          <p className={styles.note}>
            A misty grassy slope; the camera cranes down as the chrome’s reflections slide and the graphics track the ring,
            the sphere and the grass edge. The options below would move the same way.
          </p>
          <p className={styles.open}><Link href={gateHref} prefetch={false}>Open the page<span className="sr-only">: the gate</span></Link></p>
        </div>
      </section>

      <RingPicker options={options} />
    </main>
  );
}
