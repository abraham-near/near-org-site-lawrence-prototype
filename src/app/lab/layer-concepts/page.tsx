import type { Metadata } from "next";
import Image from "next/image";
import { ANSWER, PROBLEM } from "@/components/home/story/copy";
import styles from "./layer-concepts.module.css";

export const metadata: Metadata = { title: "Lab: layer concepts", robots: { index: false, follow: false } };

// /lab/layer-concepts (D83): fast, rough concept drafts (Higgsfield stills, not GL) for the rail's two layer moments, in
// the stations' render-plus-vector style, to pick a concept before it is built properly. Each concept shows the problem
// moment (someone else's layer) and the answer moment (user-owned).
const SRC = "/images/lab/layer-concepts";
// Round 4 (D86) first, from Lawrence’s sketch; round 3 (D85), no balls or discs; then round 2 (D84): the owner of the layer is an object in both frames, a dark gunmetal sphere (someone else) that
// becomes the green ball (you); "sees what they see" is drawn as lines from each agent to the owner, "keeps what they
// earn" as tiny chrome beads running to it. Round 1 (D83) below for reference.
const ROUNDS = [
  {
    title: "Round 4: Lawrence’s sketch",
    lede: "From Lawrence’s sketch: your data as pucks round a plain core on an outer plate, transactions running between them. Then the data draws in, and the core grows over it, frosted and turning green, the data blurred inside (hidden), the N etched into its face. Four design options of the same two frames. The N is the official mark from the brand files, laid onto the render afterwards; it is never generated.",
    prefix: "r4-",
    concepts: [
      { key: "a", name: "Instrument", note: "A thin frosted plate with a chrome rim and fine graduations; the data as machined chrome cylinders with engraved glyphs; a frosted core with a chrome rim." },
      { key: "b", name: "Glass tokens", note: "A brushed chrome plate with a ticked rim; the data as clear glass tokens with chrome rims and etched glyphs; a thick frosted core." },
      { key: "c", name: "Low and deep", note: "A lower camera so the pieces show their depth: a thick frosted slab with a bright chrome bevel, frosted data pucks on chrome bases, a wide polished chrome core." },
      { key: "d", name: "Plan view", note: "A steeper, more graphic view with richer construction lines: concentric circles, radial scales, small markers; chrome-rimmed frosted pucks and core." },
    ],
  },
  {
    title: "Round 3",
    lede: "No balls, no discs: four everyday images of something underneath that watches or takes. Green appears only once the layer is user-owned.",
    prefix: "r3-",
    concepts: [
      { key: "a", name: "The cutaway", note: "A section through three strata: the agents on top, the layer in the middle, a base. The layer is smoked and its conduits run out of the block into someone else's vault. Owned, the vault is gone, the exits are capped and the conduits run green inside a clear layer." },
      { key: "b", name: "The aqueduct", note: "What the agents make pours down glass channels and away into someone else's dark tank. Owned, the channels turn back and gather it in a green vessel right beneath them." },
      { key: "c", name: "The camera obscura", note: "Lenses in the floor project an image of each agent into a dark chamber below, for someone else to watch. Owned, the lenses and the chamber are gone, the floor is sealed with a green line, and nothing gets through." },
      { key: "d", name: "The roots", note: "A glass-and-chrome plant whose roots are tapped by someone else's pipe and drained to their reservoir. Owned, the pipe is gone, the roots are green and stay in the block, and the buds open." },
    ],
  },
  {
    title: "Round 2",
    lede: "The owner is always visible: a dark sphere (someone else) that becomes the green ball (you), in the same place. Lines show what it sees; tiny chrome beads show what it keeps.",
    prefix: "r2-",
    concepts: [
      { key: "a", name: "The keeper beneath", note: "Every agent is wired to a dark sphere at the centre of the layer, and what they earn rolls down the wires and piles up around it. Owned, the green ball sits in its place and each agent keeps its own." },
      { key: "b", name: "The siphon", note: "Each agent's line runs into the layer, but a copy of it branches off and carries their earnings out to a dark sphere beside the layer. Owned, the branches are gone and nothing leaves the layer." },
      { key: "c", name: "The two-way mirror", note: "The layer is a mirror: the agents see themselves, while a dark sphere underneath watches every reflection and keeps the beads. Owned, the mirror turns to frost, nothing is reflected, and the green ball sits on top." },
      { key: "d", name: "The wired tile", note: "The old drawing, rendered: three agents wired into a glass tile on a slab, with a dark sphere shut inside the tile's smoked glass. Owned, the glass clears, the wires turn solid, and the green ball is inside." },
    ],
  },
  {
    title: "Round 1",
    lede: "The first drafts: the style held, but the story didn't read enough.",
    prefix: "",
    concepts: [
      { key: "a", name: "The housing", note: "The layer is a smoked slab locked in someone else's heavy housing; owned, the housing falls away and the green ball sits in clear frosted glass." },
      { key: "b", name: "The drain", note: "What the agents earn drops into the layer and drains off down a chute to someone else; owned, the chute is gone and it gathers round the green ball." },
      { key: "c", name: "The one-way dome", note: "A dark one-way mirror over the layer, the agents' sight-lines converging inside it; owned, it turns to frost that no one can see into, the green ball within." },
      { key: "d", name: "The pull", note: "The agents' orbits are bent off towards a heavy sphere outside the layer; owned, it is gone and they orbit the green ball at the centre." },
    ],
  },
];
const answer = `${ANSWER.pre}${ANSWER.near}${ANSWER.mid}${ANSWER.owned}`;

export default function LayerConcepts() {
  return (
    <main id="main" className={`container-page ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className="t-h2">The <span className="accent">layer</span>, concepts</h1>
        <p className="t-lede">
          Rough drafts, not final renders: fast generated stills to choose a concept for the two moments before the four
          stations. The chosen one gets built in real-time 3D like the stations. They are rough on purpose: shapes may
          drift between the two frames, and lines and markers are approximate.
        </p>
      </header>
      {ROUNDS.map((r) => (
        <section key={r.title} className={styles.round}>
          <h2 className="t-h3">{r.title}</h2>
          <p className={styles.note}>{r.lede}</p>
          <ol className={styles.list}>
            {r.concepts.map((c) => (
              <li key={c.key} className={styles.item}>
                <div className={styles.head}>
                  <h3 className="t-h3">{c.key.toUpperCase()} · {c.name}</h3>
                  <p className={styles.note}>{c.note}</p>
                </div>
                <div className={styles.pair}>
                  <figure className={styles.fig}>
                    <Image src={`${SRC}/${r.prefix}${c.key}1.webp`} alt={`${c.name}, before: someone else's layer`} width={1168} height={880} unoptimized />
                    <figcaption>{PROBLEM}</figcaption>
                  </figure>
                  <figure className={styles.fig}>
                    <Image src={`${SRC}/${r.prefix}${c.key}2.webp`} alt={`${c.name}, after: the layer is user-owned`} width={1168} height={880} unoptimized />
                    <figcaption>{answer}</figcaption>
                  </figure>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}
