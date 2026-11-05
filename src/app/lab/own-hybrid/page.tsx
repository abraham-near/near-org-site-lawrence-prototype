import type { Metadata } from "next";
import Link from "next/link";
import { OWN } from "@/components/home/story/copy";
import { HYBRID } from "./styles";
import type { StyleDef } from "../own-styles/styles/types";
import { Crop, Screen } from "../own-styles/Stage";
import { Pick, Summary } from "../own-styles/Review";
import styles from "../own-styles/own-styles.module.css";

export const metadata: Metadata = { title: "Lab: Own-your hybrid renders", robots: { index: false, follow: false } };

// /lab/own-hybrid (D54): the second round of illustration styles for the rail's four "Own your …" stations: rendered
// glass and metal (generated stills with transparent backgrounds) set with fine 2D and 3D vector lines, on abstract new
// concepts. Same stills as /lab/own-styles (the whole screen at the assets station, then all four at real size), with
// a larger 420 × 315 slot so the detail reads.
const STORE = "near-own-hybrid-picks";

function Style({ s, n }: { s: StyleDef; n: number }) {
  return (
    <li className={styles.style} id={s.key} aria-labelledby={`${s.key}-name`}>
      <div className={styles.head}>
        <div>
          <p className={styles.num}>Hybrid {n} of {HYBRID.length}</p>
          <h2 id={`${s.key}-name`} className={`t-h3 ${styles.name}`}>{s.name}</h2>
          {s.refs && <p className={styles.refs}>References: {s.refs}</p>}
        </div>
        <div className={styles.about}>
          <p>{s.summary}</p>
          <p><b>In motion:</b> {s.motion}</p>
        </div>
      </div>
      <div className={styles.views}>
        <Screen style={s} large />
        <div className={styles.crops}>
          {OWN.map((o) => <Crop key={o.key} style={s} which={o.key} large />)}
        </div>
      </div>
      <Pick k={s.key} name={s.name} store={STORE} />
    </li>
  );
}

// A plain href string here would be prefixed twice in the frozen copies (scripts/build-versions.sh and basePath)
const ROUND_ONE = "/lab/own-styles";

export default function OwnHybrid() {
  return (
    <main id="main" className={`container-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className="t-h2">Own-your <span className="accent">renders</span></h1>
        <p className="t-lede">
          Round two for the rail’s four stations: rendered glass and metal set with fine 2D and 3D vector lines, on new,
          more abstract concepts with micro detail. Each is a still over the rail’s background: the whole screen at the
          assets station, then all four at their real size. Mark each Keep, Maybe or Drop.
        </p>
        <p className={styles.lede}>
          Narrowed to your keepers: Lamella with its identity station redone flat to camera and without the chains, a
          new front-on Lamella, Orbit, Materialise, and Sapphire (a maybe) without drop shadows and with fewer small
          labels. Machined and Field are dropped.
        </p>
        <p className={styles.lede}>Round one, the eight flat styles, is at <Link href={ROUND_ONE}>/lab/own-styles</Link>.</p>
      </header>
      <ol className={styles.styles}>
        {HYBRID.map((s, i) => <Style key={s.key} s={s} n={i + 1} />)}
      </ol>
      <Summary names={HYBRID.map(({ key, name }) => ({ key, name }))} store={STORE} title="Own-your hybrid renders" />
    </main>
  );
}
