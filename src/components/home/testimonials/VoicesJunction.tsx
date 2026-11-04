import { ALL, type Quote } from "./quotes";
import { InView } from "./InView";
import { Wires } from "./Wires";
import styles from "./VoicesJunction.module.css";

// Lab option H (D36), "Junction": the page's own drawing language. A hairline thread drops into the section and lands
// on a flat plan of the Stack's rings with the N mark at the core (D18's nested model); four fine connectors leave the
// outer ring through ports and run to the four voices, each met by an end node on the voice's top rule (after Tempo's
// settlement diagram and Monad's frame nodes). The connectors carry the speaker's organisation, taken from their role.
// Hover or focus on a voice turns its connector mint. One entrance on first view (opacity, transform); nothing loops.
const org = (q: Quote) => q.role?.split(" of ")[1];

// The ring plan: core square plus three rings, each with one opening (as the isometric drawing has), in a 200 box
const RINGS = [
  { s: 104, gap: "top" }, { s: 144, gap: "left" }, { s: 184, gap: "bottom" },
] as const;
function ring(size: number, gap: string) {
  const o = (200 - size) / 2, e = o + size, g = 14, m = 100;
  // four sides as separate segments, with the gap cut from the middle of one side
  const sides: Record<string, string> = {
    top: gap === "top" ? `M${o},${o}H${m - g}M${m + g},${o}H${e}` : `M${o},${o}H${e}`,
    right: `M${e},${o}V${e}`,
    bottom: gap === "bottom" ? `M${o},${e}H${m - g}M${m + g},${e}H${e}` : `M${o},${e}H${e}`,
    left: gap === "left" ? `M${o},${o}V${m - g}M${o},${m + g}V${e}` : `M${o},${o}V${e}`,
  };
  return Object.values(sides).join("");
}
const PORTS = [52, 84, 116, 148]; // y of the four ports on the outer ring's right edge

export function VoicesJunction({ titleId = "voices-title" }: { titleId?: string }) {
  return (
    <section className={styles.band} aria-labelledby={titleId}>
      <InView />
      <div className={styles.inner}>
        <span className={styles.frame} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />

        <div className={styles.junction} aria-hidden="true">
          <span className={styles.thread} />
          <div className={styles.plan}>
            <svg viewBox="0 0 200 200" className={styles.rings}>
              <rect x="72" y="72" width="56" height="56" className={styles.core} />
              {RINGS.map((r) => <path key={r.s} d={ring(r.s, r.gap)} />)}
              {PORTS.map((y) => <path key={y} d={`M188,${y}h8`} className={styles.tick} />)}
            </svg>
            {/* The N mark, unaltered (assets/brand) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/icon.svg" alt="" className={styles.mark} />
            <span className={styles.point} />
            {PORTS.map((y, i) => <span key={y} className={styles.port} style={{ top: `${(y / 200) * 100}%` }} data-wire-start={ALL[i].id} />)}
          </div>
        </div>

        <div className={styles.voices}>
          <h2 id={titleId} className={styles.title}>What the world is saying about NEAR</h2>
          <ol className={styles.list}>
            {ALL.map((q, i) => (
              <li key={q.id} className={styles.voice} data-voice={q.id} data-lead={i === 0 || undefined}>
                <span className={styles.node} data-wire-end={q.id} aria-hidden="true" />
                <figure className={styles.fig}>
                  <blockquote className={styles.quote}><p><span className={styles.hang}>&ldquo;</span>{q.text}&rdquo;</p></blockquote>
                  <figcaption className={styles.credit}>
                    <span className={styles.name}>{q.name}</span>
                    {q.role && <span>{q.role}</span>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>

        <Wires className={styles.wires} />
        {ALL.map((q) => org(q) && <span key={q.id} className={styles.pill} data-wire-label={q.id} aria-hidden="true">{org(q)}</span>)}
      </div>
    </section>
  );
}
