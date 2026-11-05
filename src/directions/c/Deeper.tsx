import { Guides } from "./Shapes";
import { DeeperIndex } from "./DeeperIndex";
import styles from "./Lower.module.css";

// Field, section 5: Go deeper, as an editorial index (DeeperIndex). The heading, then the filter, the picture frame
// and the list on the grid; "View everything" goes to the blog (D16).
export function Deeper() {
  return (
    <section id="deeper" className={styles.deeper} aria-labelledby="c-deeper-title">
      <Guides />
      <div className={styles.wrap}>
        <h2 id="c-deeper-title" className={`t-h1 ${styles.dHeading}`}>Go <span className="accent">deeper</span></h2>
        <DeeperIndex />
        <p className={styles.dAll}><a className={styles.textLink} href="/blog">View everything</a></p>
      </div>
    </section>
  );
}
