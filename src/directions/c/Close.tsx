import { Anchor, Guides, Hatch } from "./Shapes";
import { N_RUN } from "./construction";
import { CloseForm } from "./CloseForm";
import styles from "./Lower.module.css";

// Field, section 9: the close, the page's second NEAR-green field (D20's green close, which this direction brings
// back as one of its two field moments; ink type, and on green the button is ink and the field surface, DESIGN §1).
// "NEAR belongs to you" runs large across the grid; the line and the form sit under it. On the right, a hatched band
// cut on the N's diagonal and, well apart from it, a plain stem (they never meet, so they never read as the mark),, cropped by the field's edge, travel up the diagonal with the scroll (FieldMotion).
const H = 720;
const B = { x: 20, y: 40, w: 96, h: 330 };
const BAND = `${B.x},${B.y} ${B.x + B.w},${B.y} ${B.x + B.w + B.h * N_RUN},${B.y + B.h} ${B.x + B.h * N_RUN},${B.y + B.h}`;
const STEM = { x: 480, y: 300, w: 56 };
export function Close() {
  return (
    <section id="close" className={styles.close} data-tone="green" aria-labelledby="c-close-title">
      <Guides />
      <div className={styles.cArt} aria-hidden="true" data-drift="200">
        <svg viewBox={`0 0 600 ${H}`} className={styles.cSvg} focusable="false">
          <defs><Hatch id="c-close-h" angle={-56} gap={5} width={0.8} color="var(--color-ink)" /></defs>
          {/* A hatched band on the diagonal, closed at both ends, and apart from it a plain stem: never touching */}
          <polygon points={BAND} fill="url(#c-close-h)" />
          <polygon points={BAND} className={styles.inkLine} />
          <rect x={STEM.x} y={STEM.y} width={STEM.w} height={H - STEM.y + 48} className={styles.inkLine} />
          <path className={styles.cDash} d={`M0 ${STEM.y}H600`} />
          <Anchor x={B.x} y={B.y} className={styles.anchorOnGreen} />
          <Anchor x={B.x + B.w} y={B.y} className={styles.anchorOnGreen} />
          <Anchor x={B.x + B.h * N_RUN} y={B.y + B.h} className={styles.anchorOnGreen} />
          <Anchor x={B.x + B.w + B.h * N_RUN} y={B.y + B.h} className={styles.anchorOnGreen} />
          <Anchor x={STEM.x} y={STEM.y} className={styles.anchorOnGreen} />
          <Anchor x={STEM.x + STEM.w} y={STEM.y} className={styles.anchorOnGreen} />
        </svg>
      </div>
      <div className={`${styles.wrap} ${styles.cGrid}`}>
        <h2 id="c-close-title" className={`t-display ${styles.cTitle}`}>NEAR belongs to <span className="accent">you</span></h2>
        <p className={`t-lede ${styles.cLede}`}>Get the latest product launches, protocol milestones, and ecosystem updates straight to your&nbsp;inbox.</p>
        <CloseForm />
      </div>
    </section>
  );
}
