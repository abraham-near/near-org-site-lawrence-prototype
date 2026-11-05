import { Guides, Ext } from "./Shapes";
import { StackArt } from "./StackArt";
import { StackPanels } from "./StackPanels";
import { StackMotion } from "./StackMotion";
import styles from "./Stack.module.css";

// Field, section 3: the Stack. The three columns that work (list, detail, drawing) on the light page and its visible
// grid, with the drawing re-skinned (StackArt): quiet construction planes, and the layer being read in the full green
// duotone. Content and behaviour as on the current homepage (components/home/stack/layers.ts; D14, D18, D38): the
// heading stays up while, on desktop with motion, the drawing builds outwards one layer per step. Then the secondary
// row (Governance, Economics).
export function Stack() {
  return (
    <section id="stack" className={styles.band} aria-labelledby="c-stack-title" data-c-stack data-active-layer="protocol">
      <Guides />
      <div className={styles.inner}>
        <div className={styles.track} data-track>
          <div className={styles.pin}>
            <header className={styles.head}>
              <p className={`t-label ${styles.label}`}>The NEAR Stack</p>
              <h2 id="c-stack-title" className="t-h2">Four layers. One <span className="accent">system.</span></h2>
              <p className={`t-lede ${styles.lede}`}>Each layer does one job, and together they keep your world in your&nbsp;hands.</p>
            </header>
            <div className={styles.art}><StackArt /></div>
            <StackPanels />
          </div>
        </div>

        <div className={styles.secondary}>
          <div className={styles.sec}>
            <h3 className="t-h4">Governance</h3>
            <p>The network is user-owned too. NEAR&apos;s direction is set onchain through House of Stake.</p>
            <a className={styles.more} href="https://houseofstake.org/">House of Stake<Ext /></a>
          </div>
          <div className={styles.sec}>
            <h3 className="t-h4">Economics</h3>
            <p>How the network sustains itself, explained in one&nbsp;place.</p>
            <a className={styles.more} href="/economics">Read the fundamentals</a>
          </div>
        </div>
      </div>
      <StackMotion />
    </section>
  );
}
