import type { Metadata } from "next";
import { OPTIONS, type VoicesOption } from "./options";
import styles from "./lab.module.css";

export const metadata: Metadata = { title: "Lab: testimonial options", robots: { index: false, follow: false } };

const ROUNDS: { round: VoicesOption["round"]; title: string }[] = [
  { round: 3, title: "Round 3: more detailed and precise" },
  { round: 2, title: "Round 2: each mimics one real site" },
  { round: 0, title: "Today" },
  { round: 1, title: "Round 1" },
];

// /lab/voices: every testimonial option on one page, each under a lab label with its reference (D31, D34, D36).
// /lab/voices-a … -j show one option in context, between Origin and Get into NEAR.
export default function VoicesLab() {
  return (
    <main id="main">
      <header className={styles.intro}>
        <h1>What the world is saying: options</h1>
        <p>The same four quotes, names and roles in every option; nothing is added or reworded. Round 3 is more detailed and precise, after your board favourites (Tempo, Monad, PARK Stuttgart) and fresh references. Round 2 follows four real quote sections closely. Each option sits beside a screenshot of what it draws on.</p>
        <p>Recommendation: <strong>H, Junction</strong>. It is the one option whose lines and nodes mean something: the four voices wired into NEAR’s own Stack drawing, in the page’s thread language. It needs one decision: that the thread may reach this section. From round 2, E stays the quieter alternative. See D36.</p>
        <nav className={styles.nav} aria-label="Options">
          {OPTIONS.map((o) => <a key={o.key} href={`#option-${o.key}`}>{o.label} · {o.name}</a>)}
        </nav>
      </header>
      {ROUNDS.map(({ round, title }) => (
        <div key={round}>
          <h2 className={styles.round}>{title}</h2>
          {OPTIONS.filter((o) => o.round === round).map(({ key, label, name, note, ref, needs, Section }) => (
            <div key={key}>
              <div id={`option-${key}`} className={styles.label}>
                <div className={styles.labelInner}>
                  <div className={styles.labelText}>
                    <p className={styles.head}><span className={styles.tag}>{label}</span> <span className={styles.name}>{name}</span></p>
                    <p className={styles.note}>{note}</p>
                    {needs && <p className={styles.note}><strong>{needs}</strong></p>}
                    <p className={styles.links}>
                      {ref && <>After <a href={ref.url}>{ref.site}</a></>}
                      {key !== "current" && <> · <a href={`/lab/voices-${key}`}>See it in context</a></>}
                    </p>
                  </div>
                  {ref?.img && (
                    <figure className={styles.ref}>
                      {/* A screenshot of the reference section, for comparison only (lab, not the site) */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/lab/voices-refs/${ref.img}`} alt={`The reference: ${ref.site}’s quote section`} loading="lazy" />
                      <figcaption>Reference: {ref.site}</figcaption>
                    </figure>
                  )}
                </div>
              </div>
              <Section titleId={`voices-title-${key}`} />
              <div className={styles.gap} />
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
