import { Anchor, Guides } from "./Shapes";
import { seeded } from "./construction";
import styles from "./Lower.module.css";

// Field, section 6: Origin, the page's one dark section (forest). The heading and the account (F18, copy verbatim)
// sit on the right; on the left, a drawing of attention: a row of 28 tokens, each joined to one point by a fine line
// whose strength is its weight, the strongest three in NEAR green. The lines draw on as it comes up the screen
// (FieldMotion), then hold. "2017" is set large as the drawing's date (from the copy; decorative).
const W = 640, H = 520, N = 28, BASE = 468, Q = { x: 440, y: 92 };
const rnd = seeded(2017);
const xs = Array.from({ length: N }, (_, i) => 24 + (i * (W - 48)) / (N - 1));
const raw = xs.map(() => rnd() ** 3);
const strong = [5, 14, 21];
strong.forEach((i) => { raw[i] = 1; });
const weights = raw.map((w) => 0.12 + w * 0.6);

export function Origin() {
  return (
    <section id="origin" className={styles.origin} data-tone="dark" aria-labelledby="c-origin-title">
      <Guides />
      <div className={`${styles.wrap} ${styles.oGrid}`}>
        <div className={styles.oArt} aria-hidden="true">
          <p className={`t-display ${styles.oYear}`}>2017</p>
          <svg viewBox={`0 0 ${W} ${H}`} className={styles.oSvg} focusable="false" data-draw-group data-draw-stagger="0.03" data-draw-start="top 85%" data-draw-end="top 20%">
            <path className={styles.oBase} d={`M0 ${BASE}H${W}`} />
            <path className={styles.oDash} d={`M${Q.x} 0V${BASE - 30}`} />
            {xs.map((x, i) => (
              <path
                key={i} d={`M${x.toFixed(1)} ${BASE - 10}L${Q.x} ${Q.y}`} pathLength={1} data-draw=""
                className={`${styles.oLine} ${strong.includes(i) ? styles.oStrong : ""}`}
                style={{ opacity: strong.includes(i) ? 1 : weights[i] }}
              />
            ))}
            {xs.map((x, i) => (
              <rect key={i} x={x - 4} y={BASE - 10} width="8" height="8" className={strong.includes(i) ? styles.oTokStrong : styles.oTok} />
            ))}
            <rect x={Q.x - 9} y={Q.y - 9} width="18" height="18" className={styles.oQuery} />
            <Anchor x={0} y={BASE} className={styles.oAnchor} />
            <Anchor x={W} y={BASE} className={styles.oAnchor} />
          </svg>
        </div>
        <div className={styles.oCopy}>
          <h2 id="c-origin-title" className="t-h2">Built by people who helped <span className="accent">invent modern&nbsp;AI</span></h2>
          <p className={`t-lede ${styles.oLede}`}>
            NEAR began in 2017 as an AI lab. <span className={styles.nowrap}>Co-founder</span> <span className={styles.nowrap}>Illia Polosukhin</span> <span className={styles.nowrap}>co-authored</span> &ldquo;Attention Is All You Need&rdquo;, the paper that introduced the Transformer behind today&rsquo;s AI models. NEAR exists so the next era of AI is owned&nbsp;by&nbsp;its&nbsp;users.
          </p>
          <a className={`btn ${styles.oBtn}`} href="/about">Our story</a>
        </div>
      </div>
    </section>
  );
}
