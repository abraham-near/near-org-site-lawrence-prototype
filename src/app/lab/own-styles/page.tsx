import type { Metadata } from "next";
import { OWN } from "@/components/home/story/copy";
import { CURRENT, STYLES } from "./styles";
import type { StyleDef } from "./styles/types";
import { Crop, Screen } from "./Stage";
import { Pick, Summary } from "./Review";
import styles from "./own-styles.module.css";

export const metadata: Metadata = { title: "Lab: Own-your illustration styles", robots: { index: false, follow: false } };

// /lab/own-styles (D53): eight illustration styles for the rail's four "Own your …" stations, building on the Original
// direction, each mocked up as a still over its background: the whole screen at the "assets" station (as on the page),
// then all four stations at their real size. Today's drawings come first for comparison.
function Style({ s, n }: { s: StyleDef; n?: number }) {
  return (
    <li className={styles.style} id={s.key} aria-labelledby={`${s.key}-name`}>
      <div className={styles.head}>
        <div>
          <p className={styles.num}>{n ? `Style ${n} of ${STYLES.length}` : "For comparison"}</p>
          <h2 id={`${s.key}-name`} className={`t-h3 ${styles.name}`}>{s.name}</h2>
          {s.refs && <p className={styles.refs}>From your favourites: {s.refs}</p>}
        </div>
        <div className={styles.about}>
          <p>{s.summary}</p>
          <p><b>In motion:</b> {s.motion}</p>
        </div>
      </div>
      <div className={styles.views}>
        <Screen style={s} />
        <div className={styles.crops}>
          {OWN.map((o) => <Crop key={o.key} style={s} which={o.key} />)}
        </div>
      </div>
      {n && <Pick k={s.key} name={s.name} />}
    </li>
  );
}

export default function OwnStyles() {
  return (
    <main id="main" className={`container-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className="t-h2">Own-your <span className="accent">illustrations</span></h1>
        <p className="t-lede">
          Eight styles for the drawings on the rail’s four stations, building on the Original direction. Each is a still
          over the rail’s background: the whole screen at the assets station, then all four stations at their real size.
          Mark each Keep, Maybe or Drop, and we’ll narrow them down and refine.
        </p>
      </header>
      <ol className={styles.styles}>
        <Style s={CURRENT} />
        {STYLES.map((s, i) => <Style key={s.key} s={s} n={i + 1} />)}
      </ol>
      <Summary names={STYLES.map(({ key, name }) => ({ key, name }))} />
    </main>
  );
}
