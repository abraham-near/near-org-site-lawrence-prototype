import type { Metadata } from "next";
import { GRADES, J_OPTIONS, LAYERS, SURVEY } from "./options";
import styles from "./lab.module.css";

export const metadata: Metadata = { title: "Lab: hero options", robots: { index: false, follow: false } };

const STILLS = [
  { src: "/lab/hero/lab-hero-grade0-8s.webp", name: "Today", note: "The current grade.", page: "home" },
  ...([1, 2, 3] as const).map((g) => ({ src: `/lab/hero/lab-hero-grade${g}-8s.webp`, name: GRADES[g].name, note: GRADES[g].note, page: `lab/hero-g${g}` })),
];

// /lab/hero (D40): the hero's green grades side by side, and the four layer options, each opening in context.
export default function HeroLab() {
  return (
    <main id="main" className={`container-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className="t-h2">The hero: a layer for money, data and AI</h1>
        <p className="t-body">
          A4 is the settled effect. First, the new master render it sits on; then the rounds that led to A4, and the
          first round (green grades and four layers) further down.
        </p>
      </header>

      <section aria-labelledby="joptions">
        <h2 id="joptions" className="t-h3">Graphics on the gentle pull-back: three options</h2>
        <p className={styles.note}>
          Take j is the pick (D48). Three options for the layer over it (D49): the first follows your notes on A4; the
          other two are drastically different, after your references, on the same tracking. The first is refined to a
          golden-ratio composition and also shown over option 2’s dust (D50). All keep clear of the headline itself.
        </p>
        <ul className={styles.layers}>
          {J_OPTIONS.map((o) => (
            <li key={o.key}>
              <p className="t-h4">{o.name}</p>
              <p className={styles.note}>{o.note}</p>
              <p className={styles.link}><a href={`/lab/hero-${o.key}`}>See it in context<span className="sr-only">: {o.name}</span></a></p>
            </li>
          ))}
          <li><p className="t-h4">A4 on take j</p><p className={styles.note}>Where we were, for comparison.</p><p className={styles.link}><a href="/lab/hero-z-j">See it in context<span className="sr-only">: A4 on take j</span></a></p></li>
        </ul>
      </section>

      <section aria-labelledby="zmove">
        <h2 id="zmove" className="t-h3">Pull-back: more z in the camera move</h2>
        <p className={styles.note}>
          The camera starts a little closer and pulls back as it lowers, dropping less, and a layer of trees from behind the
          camera enters the frame. Graded with the subtle green and 10% more contrast. Two takes, measured by tracking: the
          strong one widens the view the most and carries about twice today’s depth; the gentle one about 16% more depth,
          with its trees entering late in the move. A4 is re-tracked to each, and its motion at rest is 5–15% faster (D48).
        </p>
        <ul className={styles.layers}>
          <li><p className="t-h4">Pull-back, strong</p><p className={styles.note}>Take i: the view widens the most; treetops rise across the lower frame.</p><p className={styles.link}><a href="/lab/hero-z-i">See it in context<span className="sr-only">: Pull-back, strong</span></a></p></li>
          <li><p className="t-h4">Pull-back, gentle</p><p className={styles.note}>Take j: a moderate pull-back; trees enter from the lower right near the end.</p><p className={styles.link}><a href="/lab/hero-z-j">See it in context<span className="sr-only">: Pull-back, gentle</span></a></p></li>
          <li><p className="t-h4">Today</p><p className={styles.note}>The current render, for comparison.</p><p className={styles.link}><a href="/home">See it in context<span className="sr-only">: Today</span></a></p></li>
        </ul>
      </section>

      <section aria-labelledby="master">
        <h2 id="master" className="t-h3">The master render, with A4</h2>
        <p className={styles.note}>
          A4 is settled (D47). This is the new camera move it now sits on: a crane down the same ridges, with the valley
          mist drifting. Seven takes were made and measured by tracking; this is the first 5.4 s of take g, which carries
          about 25% more depth over the scroll than today’s render. A4 is re-tracked to it. Compare it with Today.
        </p>
        <ul className={styles.layers}>
          <li><p className="t-h4">Master</p><p className={styles.note}>The new render, ungraded.</p><p className={styles.link}><a href="/lab/hero-master">See it in context<span className="sr-only">: Master</span></a></p></li>
          <li><p className="t-h4">Master, Green 1</p><p className={styles.note}>The same, with the subtle green in the trees.</p><p className={styles.link}><a href="/lab/hero-master-g1">See it in context<span className="sr-only">: Master, Green 1</span></a></p></li>
          <li><p className="t-h4">Today</p><p className={styles.note}>The current render, for comparison.</p><p className={styles.link}><a href="/home">See it in context<span className="sr-only">: Today</span></a></p></li>
        </ul>
      </section>

      <section aria-labelledby="survey">
        <h2 id="survey" className="t-h3">Survey, developed</h2>
        <p className={styles.note}>
          After Plexus for After Effects (points joined when they are close, the lines fading with distance) and GMUNK’s
          graphics for TRON: Legacy (fine line-work that follows the land, ticked rings, restraint so it reads at a
          glance). More detail than A, kept to hairlines and dots so the picture still leads. Every dot is tracked to the
          footage and nothing moves on its own.
        </p>
        <ul className={styles.layers}>
          {SURVEY.map((l) => (
            <li key={l.key}>
              <p className="t-h4">{l.name}</p>
              <p className={styles.note}>{l.note}</p>
              <p className={styles.link}><a href={`/lab/hero-${l.key}`}>See it in context<span className="sr-only">: {l.name}</span></a></p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="green">
        <h2 id="green" className="t-h3">First round: green in the trees</h2>
        <p className={styles.note}>
          A colour grade of the same render, so the shot itself is unchanged. Each still is the frame at 8 seconds, where
          the forest fills the picture.
        </p>
        <ul className={styles.stills}>
          {STILLS.map((s) => (
            <li key={s.src}>
              {/* Lab comparison stills (WebP, already sized) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt={`The hero at 8 seconds: ${s.name}`} loading="lazy" />
              <p className="t-h4">{s.name}</p>
              <p className={styles.note}>{s.note}</p>
              <p className={styles.link}><a href={`/${s.page}`}>See it in context</a></p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="layer">
        <h2 id="layer" className="t-h3">First round: four layers</h2>
        <p className={styles.note}>
          Each is pinned to the land: points on the ridges were tracked through every frame of the render, so the marks
          move with the camera. Nothing plays on its own; it all moves with your scroll. Each fades out towards the
          headline. All four use Green 1, and are made for desktop, where the camera move plays.
        </p>
        <ul className={styles.layers}>
          {LAYERS.map((l) => (
            <li key={l.key}>
              <p className="t-h4">{l.name}</p>
              <p className={styles.theme}>{l.theme}</p>
              <p className={styles.note}>{l.note}</p>
              <p className={styles.link}><a href={`/lab/hero-${l.key}`}>See it in context<span className="sr-only">: {l.name}</span></a></p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
