import type { Metadata } from "next";
import { OPTIONS, type VoicesOption } from "./options";
import styles from "./lab.module.css";

export const metadata: Metadata = { title: "Lab: testimonial options", robots: { index: false, follow: false } };

const ROUNDS: { round: VoicesOption["round"]; title: string }[] = [
  { round: 2, title: "Round 2: each mimics one real site" },
  { round: 0, title: "Today" },
  { round: 1, title: "Round 1" },
];

// /lab/voices: every testimonial option on one page, each under a lab label with its reference (D31, D34).
// /lab/voices-a … -g show one option in context, between Origin and Get into NEAR.
export default function VoicesLab() {
  return (
    <main id="main">
      <header className={styles.intro}>
        <h1>What the world is saying: options</h1>
        <p>The same four quotes, names and roles in every option; nothing is added or reworded. Round 2 follows four real quote sections closely, swapping their portraits, logos and colours for our type, hairlines and one mint. Each sits beside a screenshot of the section it mimics.</p>
        <p>Recommendation: <strong>E, Speaker, leader, words</strong> (after Craft). All four voices readable at rest, an editorial serif voice, one quiet entrance. It needs one decision: quoted speech in Kepler italic. Runner-up: <strong>F</strong>, if you want a full-screen moment (it needs a second orchestrated scroll moment). See D34.</p>
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
