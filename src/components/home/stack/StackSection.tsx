import { StackDrawing } from "./StackDrawing";
import { StackInteractions } from "./StackInteractions";
import { StackLayers } from "./StackLayers";
import styles from "./Stack.module.css";

// Section 2 (spec/pages/home.md §2, D7, D14, D17, D18): an ink band. The heading, then three columns: the four layers
// as a numbered list (core first), the selected layer's detail, and the isometric Stack on the right (the Protocol
// pillar inside the Intents, NEAR AI and near.com frames). On desktop with motion the columns pin while the reader
// scrolls through the four layers and the drawing builds outwards, one layer per step (StackInteractions). Hovering a
// layer in the list or the drawing highlights it; clicking one in the drawing selects it. Then the close and the
// secondary row.
export function StackSection() {
  return (
    <section className={styles.band} aria-labelledby="stack-title" data-stack data-tone="dark" data-active-layer="protocol">
      <span className={styles.handoff} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.grid}>
          <header className={styles.head}>
            <h2 id="stack-title" className="t-h2">
              Four layers. One <span className="accent">system.</span>
            </h2>
            <p className="t-lede">Each layer does one job, and together they keep your world in your&nbsp;hands.</p>
          </header>
          <div className={styles.track} data-track>
            <div className={styles.pin} data-pin>
              <span className={styles.pinLine} aria-hidden="true" />
              <div className={styles.cols}>
                <div className={styles.art}><StackDrawing /></div>
                <StackLayers />
              </div>
              {/* Inside the pin (D23), so it stays readable at the bottom while the layers build */}
              <p className={`t-h3 ${styles.close}`}>
                <span className={styles.sentence}>Four layers, built as one system.</span>{" "}
                <span className={styles.sentence}>At&nbsp;every one of them, the owner is you.</span>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.secondary}>
          <div>
            <h3 className="t-h4">Governance</h3>
            <p>The network is user-owned too. NEAR&apos;s direction is set onchain through House of Stake.</p>
            <a className={styles.more} href="https://houseofstake.org/">House of Stake<svg className={styles.ext} viewBox="0 0 10 10" width="9" height="9" aria-hidden="true" focusable="false"><path d="M3 1.5h5.5V7M8.5 1.5 1.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg><span className="sr-only"> (another site)</span></a>
          </div>
          <div>
            <h3 className="t-h4">Economics</h3>
            <p>How the network sustains itself, explained in one&nbsp;place.</p>
            <a className={styles.more} href="/economics">Read the fundamentals</a>
          </div>
        </div>
      </div>
      <StackInteractions />
    </section>
  );
}
